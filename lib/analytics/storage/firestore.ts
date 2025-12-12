// ============================================
// Firestore Storage Layer for Analytics
// ============================================

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  increment,
  serverTimestamp,
  DocumentSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, analyticsConfig } from "../config";
import type {
  Session,
  Visitor,
  Pageview,
  AnalyticsEvent,
  DashboardMetrics,
} from "../types";

// ---------- Type Converters ----------

/**
 * Convert Date to Firestore Timestamp
 */
function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Convert Firestore Timestamp to Date
 */
function fromTimestamp(timestamp: Timestamp | Date): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
}

/**
 * Prepare object for Firestore (convert dates, remove undefined)
 */
function prepareForFirestore<T extends Record<string, unknown>>(data: T): T {
  const prepared: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip undefined values (Firestore doesn't accept them)
    if (value === undefined) {
      continue;
    }

    if (value instanceof Date) {
      prepared[key] = toTimestamp(value);
    } else if (value === null) {
      // Firestore accepts null, keep it
      prepared[key] = value;
    } else if (Array.isArray(value)) {
      // Process arrays, filtering out undefined elements
      prepared[key] = value
        .filter((item) => item !== undefined)
        .map((item) =>
          item && typeof item === "object"
            ? prepareForFirestore(item as Record<string, unknown>)
            : item
        );
    } else if (typeof value === "object") {
      // Recursively process nested objects
      const nested = prepareForFirestore(value as Record<string, unknown>);
      // Only include if not empty
      if (Object.keys(nested).length > 0) {
        prepared[key] = nested;
      }
    } else {
      prepared[key] = value;
    }
  }

  return prepared as T;
}

// ---------- Session Operations ----------

/**
 * Save session to Firestore
 */
export async function saveSession(session: Session): Promise<void> {
  if (!db) {
    console.warn("[Analytics] Firestore not initialized");
    return;
  }

  try {
    const sessionRef = doc(collection(db, COLLECTIONS.SESSIONS), session.id);
    const data = prepareForFirestore({
      ...session,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(sessionRef, data);

    if (analyticsConfig.debug) {
      console.log("[Analytics] Session saved:", session.id);
    }
  } catch (error) {
    console.error("[Analytics] Failed to save session:", error);
  }
}

/**
 * Update session in Firestore
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<Session>
): Promise<void> {
  if (!db) return;

  try {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    const data = prepareForFirestore({
      ...updates,
      updatedAt: serverTimestamp(),
    });

    await updateDoc(sessionRef, data);
  } catch (error) {
    console.error("[Analytics] Failed to update session:", error);
  }
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  if (!db) return null;

  try {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    const snapshot = await getDoc(sessionRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      ...data,
      startedAt: fromTimestamp(data.startedAt),
      lastActivityAt: fromTimestamp(data.lastActivityAt),
    } as Session;
  } catch (error) {
    console.error("[Analytics] Failed to get session:", error);
    return null;
  }
}

// ---------- Visitor Operations ----------

/**
 * Save or update visitor
 */
export async function saveVisitor(visitor: Visitor): Promise<void> {
  if (!db) return;

  try {
    const visitorRef = doc(collection(db, COLLECTIONS.VISITORS), visitor.id);
    const existingDoc = await getDoc(visitorRef);

    if (existingDoc.exists()) {
      // Update existing visitor
      await updateDoc(visitorRef, {
        lastSeenAt: serverTimestamp(),
        totalSessions: increment(1),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new visitor
      const data = prepareForFirestore({
        ...visitor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await setDoc(visitorRef, data);
    }
  } catch (error) {
    console.error("[Analytics] Failed to save visitor:", error);
  }
}

/**
 * Get visitor by ID
 */
export async function getVisitor(visitorId: string): Promise<Visitor | null> {
  if (!db) return null;

  try {
    const visitorRef = doc(db, COLLECTIONS.VISITORS, visitorId);
    const snapshot = await getDoc(visitorRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      ...data,
      firstSeenAt: fromTimestamp(data.firstSeenAt),
      lastSeenAt: fromTimestamp(data.lastSeenAt),
    } as Visitor;
  } catch (error) {
    console.error("[Analytics] Failed to get visitor:", error);
    return null;
  }
}

// ---------- Pageview Operations ----------

/**
 * Save pageview to Firestore
 */
export async function savePageview(pageview: Pageview): Promise<void> {
  if (!db) return;

  try {
    const pageviewRef = doc(collection(db, COLLECTIONS.PAGEVIEWS), pageview.id);
    const data = prepareForFirestore({
      ...pageview,
      createdAt: serverTimestamp(),
    });

    await setDoc(pageviewRef, data);

    // Update daily stats
    await updateDailyStats("pageviews", 1);

    if (analyticsConfig.debug) {
      console.log("[Analytics] Pageview saved:", pageview.id);
    }
  } catch (error) {
    console.error("[Analytics] Failed to save pageview:", error);
  }
}

/**
 * Update pageview (time on page, scroll depth)
 */
export async function updatePageview(
  pageviewId: string,
  updates: Partial<Pageview>
): Promise<void> {
  if (!db) return;

  try {
    const pageviewRef = doc(db, COLLECTIONS.PAGEVIEWS, pageviewId);
    const data = prepareForFirestore(updates);

    await updateDoc(pageviewRef, data);
  } catch (error) {
    console.error("[Analytics] Failed to update pageview:", error);
  }
}

// ---------- Event Operations ----------

/**
 * Save event to Firestore
 */
export async function saveEvent(event: AnalyticsEvent): Promise<void> {
  if (!db) return;

  try {
    const eventRef = doc(collection(db, COLLECTIONS.EVENTS), event.id);
    const data = prepareForFirestore({
      ...event,
      createdAt: serverTimestamp(),
    });

    await setDoc(eventRef, data);

    // Update daily stats
    await updateDailyStats("events", 1);
    await updateDailyStats(`event_${event.name}`, 1);

    if (analyticsConfig.debug) {
      console.log("[Analytics] Event saved:", event.name);
    }
  } catch (error) {
    console.error("[Analytics] Failed to save event:", error);
  }
}

/**
 * Save multiple events in batch
 */
export async function saveEventsBatch(events: AnalyticsEvent[]): Promise<void> {
  if (!db || events.length === 0) return;

  try {
    const batch = writeBatch(db);

    for (const event of events) {
      const eventRef = doc(collection(db, COLLECTIONS.EVENTS), event.id);
      const data = prepareForFirestore({
        ...event,
        createdAt: serverTimestamp(),
      });
      batch.set(eventRef, data);
    }

    await batch.commit();

    // Update daily stats
    await updateDailyStats("events", events.length);

    if (analyticsConfig.debug) {
      console.log("[Analytics] Batch saved:", events.length, "events");
    }
  } catch (error) {
    console.error("[Analytics] Failed to save events batch:", error);
  }
}

// ---------- Daily Stats Operations ----------

/**
 * Get today's date key for daily stats
 */
function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Update daily statistics
 */
async function updateDailyStats(metric: string, value: number): Promise<void> {
  if (!db) return;

  try {
    const dateKey = getTodayKey();
    const statsRef = doc(db, COLLECTIONS.DAILY_STATS, dateKey);

    await setDoc(
      statsRef,
      {
        date: dateKey,
        [metric]: increment(value),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("[Analytics] Failed to update daily stats:", error);
  }
}

// ---------- Query Operations ----------

/**
 * Get recent sessions
 */
export async function getRecentSessions(
  limitCount: number = 50,
  lastDoc?: DocumentSnapshot
): Promise<Session[]> {
  if (!db) return [];

  try {
    const constraints: QueryConstraint[] = [
      orderBy("startedAt", "desc"),
      limit(limitCount),
    ];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, COLLECTIONS.SESSIONS), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        startedAt: fromTimestamp(data.startedAt),
        lastActivityAt: fromTimestamp(data.lastActivityAt),
      } as Session;
    });
  } catch (error) {
    console.error("[Analytics] Failed to get recent sessions:", error);
    return [];
  }
}

/**
 * Get recent events
 */
export async function getRecentEvents(
  limitCount: number = 100,
  eventName?: string
): Promise<AnalyticsEvent[]> {
  if (!db) return [];

  try {
    const constraints: QueryConstraint[] = [
      orderBy("timestamp", "desc"),
      limit(limitCount),
    ];

    if (eventName) {
      constraints.unshift(where("name", "==", eventName));
    }

    const q = query(collection(db, COLLECTIONS.EVENTS), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        timestamp: fromTimestamp(data.timestamp),
      } as AnalyticsEvent;
    });
  } catch (error) {
    console.error("[Analytics] Failed to get recent events:", error);
    return [];
  }
}

/**
 * Get pageviews for a specific path
 */
export async function getPageviewsByPath(
  path: string,
  limitCount: number = 100
): Promise<Pageview[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, COLLECTIONS.PAGEVIEWS),
      where("path", "==", path),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        timestamp: fromTimestamp(data.timestamp),
      } as Pageview;
    });
  } catch (error) {
    console.error("[Analytics] Failed to get pageviews by path:", error);
    return [];
  }
}

/**
 * Get daily stats for date range
 */
export async function getDailyStats(
  startDate: string,
  endDate: string
): Promise<Record<string, Record<string, number>>> {
  if (!db) return {};

  try {
    const q = query(
      collection(db, COLLECTIONS.DAILY_STATS),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);
    const stats: Record<string, Record<string, number>> = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      stats[data.date] = data;
    });

    return stats;
  } catch (error) {
    console.error("[Analytics] Failed to get daily stats:", error);
    return {};
  }
}

/**
 * Get dashboard metrics for a period
 */
export async function getDashboardMetrics(
  startDate: Date,
  endDate: Date
): Promise<Partial<DashboardMetrics>> {
  if (!db) return {};

  try {
    const startTs = toTimestamp(startDate);
    const endTs = toTimestamp(endDate);

    // Get sessions in period
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where("startedAt", ">=", startTs),
      where("startedAt", "<=", endTs)
    );
    const sessionsSnapshot = await getDocs(sessionsQuery);
    const sessions = sessionsSnapshot.docs.map((doc) => doc.data() as Session);

    // Get pageviews in period
    const pageviewsQuery = query(
      collection(db, COLLECTIONS.PAGEVIEWS),
      where("timestamp", ">=", startTs),
      where("timestamp", "<=", endTs)
    );
    const pageviewsSnapshot = await getDocs(pageviewsQuery);
    const pageviews = pageviewsSnapshot.docs.map((doc) => doc.data() as Pageview);

    // Get events in period
    const eventsQuery = query(
      collection(db, COLLECTIONS.EVENTS),
      where("timestamp", ">=", startTs),
      where("timestamp", "<=", endTs)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map((doc) => doc.data() as AnalyticsEvent);

    // Calculate metrics
    const uniqueVisitors = new Set(sessions.map((s) => s.visitorId)).size;
    const totalSessions = sessions.length;
    const totalPageviews = pageviews.length;
    const totalEvents = events.length;

    const avgSessionDuration =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
        : 0;

    const bounces = sessions.filter((s) => s.isBounce).length;
    const bounceRate = totalSessions > 0 ? (bounces / totalSessions) * 100 : 0;

    // Device breakdown
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
    sessions.forEach((s) => {
      if (s.device?.type && s.device.type in deviceCounts) {
        deviceCounts[s.device.type as keyof typeof deviceCounts]++;
      }
    });

    // Top pages
    const pageCount: Record<string, { views: number; title: string }> = {};
    pageviews.forEach((pv) => {
      if (!pageCount[pv.path]) {
        pageCount[pv.path] = { views: 0, title: pv.title };
      }
      pageCount[pv.path].views++;
    });

    const topPages = Object.entries(pageCount)
      .map(([path, data]) => ({
        path,
        title: data.title,
        views: data.views,
        uniqueViews: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Event breakdown
    const eventCount: Record<string, { count: number; category: string }> = {};
    events.forEach((ev) => {
      if (!eventCount[ev.name]) {
        eventCount[ev.name] = { count: 0, category: ev.category };
      }
      eventCount[ev.name].count++;
    });

    const topEvents = Object.entries(eventCount)
      .map(([name, data]) => ({
        name,
        category: data.category as AnalyticsEvent["category"],
        count: data.count,
        uniqueUsers: 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      period: { start: startDate, end: endDate },
      overview: {
        totalVisitors: uniqueVisitors,
        uniqueVisitors,
        totalSessions,
        totalPageviews,
        totalEvents,
        avgSessionDuration,
        bounceRate,
        returningVisitors: 0,
      },
      topPages,
      devices: deviceCounts,
      events: topEvents,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get dashboard metrics:", error);
    return {};
  }
}

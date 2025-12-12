// ============================================
// Analytics Dashboard Component
// ============================================

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getDashboardMetrics,
  getRecentSessions,
  getRecentEvents,
  formatDuration,
} from "@/lib/analytics";
import type {
  DashboardMetrics,
  Session,
  AnalyticsEvent,
} from "@/lib/analytics/types";

// ---------- Types ----------

interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

// ---------- Date Ranges ----------

const getDateRanges = (): Record<string, DateRange> => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return {
    today: {
      start: today,
      end: now,
      label: "Hoy",
    },
    yesterday: {
      start: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      end: today,
      label: "Ayer",
    },
    last7days: {
      start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now,
      label: "7 dias",
    },
    last30days: {
      start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: now,
      label: "30 dias",
    },
    last90days: {
      start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      end: now,
      label: "90 dias",
    },
  };
};

// ---------- Stat Card Component ----------

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-card__icon" style={{ backgroundColor: `${color}20` }}>
        <span>{icon}</span>
      </div>
      <div className="stat-card__content">
        <h4 className="stat-card__title">{title}</h4>
        <p className="stat-card__value">{value}</p>
        {change !== undefined && (
          <span
            className={`stat-card__change ${change >= 0 ? "positive" : "negative"}`}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- Device Chart Component ----------

interface DeviceChartProps {
  devices: { desktop: number; mobile: number; tablet: number };
}

function DeviceChart({ devices }: DeviceChartProps) {
  const total = devices.desktop + devices.mobile + devices.tablet;
  if (total === 0) return <p className="no-data">Sin datos</p>;

  const data = [
    { label: "Desktop", value: devices.desktop, color: "#3B82F6", icon: "💻" },
    { label: "Mobile", value: devices.mobile, color: "#10B981", icon: "📱" },
    { label: "Tablet", value: devices.tablet, color: "#F59E0B", icon: "📱" },
  ];

  return (
    <div className="device-chart">
      <div className="device-chart__bars">
        {data.map((item) => (
          <div key={item.label} className="device-chart__item">
            <div className="device-chart__label">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div className="device-chart__bar-container">
              <div
                className="device-chart__bar"
                style={{
                  width: `${(item.value / total) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <div className="device-chart__value">
              {item.value} ({((item.value / total) * 100).toFixed(0)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Recent Sessions Table ----------

interface RecentSessionsProps {
  sessions: Session[];
}

function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return <p className="no-data">No hay sesiones recientes</p>;
  }

  return (
    <div className="sessions-table">
      <table>
        <thead>
          <tr>
            <th>Visitante</th>
            <th>Dispositivo</th>
            <th>Ubicacion</th>
            <th>Paginas</th>
            <th>Duracion</th>
            <th>Fuente</th>
          </tr>
        </thead>
        <tbody>
          {sessions.slice(0, 10).map((session) => (
            <tr key={session.id}>
              <td>
                <code className="visitor-id">
                  {session.visitorId.substring(0, 10)}...
                </code>
              </td>
              <td>
                <span className="device-badge">
                  {session.device?.type === "desktop" ? "💻" : "📱"}
                  {session.device?.browser || "Unknown"}
                </span>
              </td>
              <td>
                {session.geo?.city || session.geo?.country || "Desconocido"}
              </td>
              <td>{session.pageviews}</td>
              <td>{formatDuration(session.duration)}</td>
              <td>
                <span className="source-badge">
                  {session.referrer?.type || "direct"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Recent Events Table ----------

interface RecentEventsProps {
  events: AnalyticsEvent[];
}

function RecentEvents({ events }: RecentEventsProps) {
  if (events.length === 0) {
    return <p className="no-data">No hay eventos recientes</p>;
  }

  const categoryColors: Record<string, string> = {
    engagement: "#3B82F6",
    conversion: "#10B981",
    navigation: "#6366F1",
    social: "#EC4899",
    content: "#F59E0B",
    error: "#EF4444",
    performance: "#8B5CF6",
  };

  return (
    <div className="events-table">
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>Categoria</th>
            <th>Pagina</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 15).map((event) => (
            <tr key={event.id}>
              <td>
                <strong>{event.name}</strong>
                {event.label && (
                  <span className="event-label">{event.label}</span>
                )}
              </td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: `${categoryColors[event.category] || "#6B7280"}20`,
                    color: categoryColors[event.category] || "#6B7280",
                  }}
                >
                  {event.category}
                </span>
              </td>
              <td className="event-path">{event.path}</td>
              <td>
                {new Date(event.timestamp).toLocaleTimeString("es-BO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Top Pages Table ----------

interface TopPagesProps {
  pages: Array<{
    path: string;
    title: string;
    views: number;
  }>;
}

function TopPages({ pages }: TopPagesProps) {
  if (!pages || pages.length === 0) {
    return <p className="no-data">Sin datos de paginas</p>;
  }

  const maxViews = Math.max(...pages.map((p) => p.views));

  return (
    <div className="top-pages">
      {pages.map((page, index) => (
        <div key={page.path} className="top-page-item">
          <div className="top-page-rank">{index + 1}</div>
          <div className="top-page-info">
            <div className="top-page-title">{page.title || page.path}</div>
            <div className="top-page-path">{page.path}</div>
          </div>
          <div className="top-page-bar-container">
            <div
              className="top-page-bar"
              style={{ width: `${(page.views / maxViews) * 100}%` }}
            />
          </div>
          <div className="top-page-views">{page.views}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Main Dashboard Component ----------

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>("last7days");
  const [metrics, setMetrics] = useState<Partial<DashboardMetrics>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const dateRanges = getDateRanges();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const range = dateRanges[selectedRange];

      console.log("[Analytics Dashboard] Loading data for range:", selectedRange);

      // Load all data in parallel
      const [metricsData, sessionsData, eventsData] = await Promise.all([
        getDashboardMetrics(range.start, range.end),
        getRecentSessions(50),
        getRecentEvents(50),
      ]);

      console.log("[Analytics Dashboard] Data loaded:", {
        metrics: metricsData,
        sessions: sessionsData.length,
        events: eventsData.length,
      });

      setMetrics(metricsData);
      setSessions(sessionsData);
      setEvents(eventsData);
    } catch (err: unknown) {
      console.error("[Analytics Dashboard] Error loading:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(`Error al cargar datos: ${errorMessage}. Verifica que Firestore este habilitado y las reglas permitan lectura.`);
    } finally {
      setLoading(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="analytics-dashboard">
      <style jsx global>{`
        .analytics-dashboard {
          min-height: 100vh;
          background: var(--color-bg, #f5f5f5);
          padding: 2rem;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dashboard-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text, #1a1a1a);
          margin: 0;
        }

        .date-range-selector {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .date-range-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border, #e5e5e5);
          background: var(--color-surface, #fff);
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .date-range-btn:hover {
          border-color: var(--color-primary, #3B82F6);
        }

        .date-range-btn.active {
          background: var(--color-primary, #3B82F6);
          color: white;
          border-color: var(--color-primary, #3B82F6);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--color-surface, #fff);
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 4px solid;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-card__icon {
          width: 48px;
          height: 48px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-card__title {
          font-size: 0.875rem;
          color: var(--color-muted, #6b7280);
          margin: 0 0 0.25rem;
          font-weight: 500;
        }

        .stat-card__value {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: var(--color-text, #1a1a1a);
        }

        .stat-card__change {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-card__change.positive {
          color: #10B981;
        }

        .stat-card__change.negative {
          color: #EF4444;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card {
          background: var(--color-surface, #fff);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dashboard-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 1rem;
          color: var(--color-text, #1a1a1a);
        }

        .no-data {
          color: var(--color-muted, #6b7280);
          text-align: center;
          padding: 2rem;
        }

        .device-chart__item {
          display: grid;
          grid-template-columns: 100px 1fr 80px;
          gap: 1rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .device-chart__label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .device-chart__bar-container {
          height: 8px;
          background: var(--color-border, #e5e5e5);
          border-radius: 4px;
          overflow: hidden;
        }

        .device-chart__bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .device-chart__value {
          font-size: 0.875rem;
          text-align: right;
          color: var(--color-muted, #6b7280);
        }

        .sessions-table,
        .events-table {
          overflow-x: auto;
        }

        .sessions-table table,
        .events-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .sessions-table th,
        .events-table th {
          text-align: left;
          padding: 0.75rem 0.5rem;
          border-bottom: 2px solid var(--color-border, #e5e5e5);
          font-weight: 600;
          color: var(--color-muted, #6b7280);
        }

        .sessions-table td,
        .events-table td {
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
        }

        .visitor-id {
          font-size: 0.75rem;
          background: var(--color-border, #e5e5e5);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .device-badge,
        .source-badge,
        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          background: var(--color-border, #e5e5e5);
        }

        .category-badge {
          font-weight: 600;
        }

        .event-label {
          display: block;
          font-size: 0.75rem;
          color: var(--color-muted, #6b7280);
        }

        .event-path {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top-pages {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .top-page-item {
          display: grid;
          grid-template-columns: 32px 1fr 100px 60px;
          gap: 0.75rem;
          align-items: center;
        }

        .top-page-rank {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-border, #e5e5e5);
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .top-page-title {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .top-page-path {
          font-size: 0.75rem;
          color: var(--color-muted, #6b7280);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .top-page-bar-container {
          height: 6px;
          background: var(--color-border, #e5e5e5);
          border-radius: 3px;
          overflow: hidden;
        }

        .top-page-bar {
          height: 100%;
          background: var(--color-primary, #3B82F6);
          border-radius: 3px;
        }

        .top-page-views {
          font-weight: 600;
          text-align: right;
        }

        .loading-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: var(--color-muted, #6b7280);
        }

        .error-message {
          background: #FEE2E2;
          color: #991B1B;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          background: var(--color-primary, #3B82F6);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: opacity 0.2s;
        }

        .refresh-btn:hover {
          opacity: 0.9;
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <div className="date-range-selector">
          {Object.entries(dateRanges).map(([key, range]) => (
            <button
              key={key}
              className={`date-range-btn ${selectedRange === key ? "active" : ""}`}
              onClick={() => setSelectedRange(key)}
            >
              {range.label}
            </button>
          ))}
          <button
            className="refresh-btn"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !metrics.overview ? (
        <div className="loading-overlay">
          <div>Cargando datos de analytics...</div>
          <small style={{ marginTop: "1rem", opacity: 0.7 }}>
            Si tarda mucho, verifica la consola del navegador (F12)
          </small>
        </div>
      ) : !metrics.overview && !loading ? (
        <div className="loading-overlay">
          <div style={{ textAlign: "center" }}>
            <h3>Sin datos de analytics</h3>
            <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>
              Los datos apareceran cuando los usuarios visiten el sitio.<br />
              Visita tu sitio en produccion para generar datos de prueba.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="stats-grid">
            <StatCard
              title="Visitantes Unicos"
              value={metrics.overview?.uniqueVisitors || 0}
              icon="👥"
              color="#3B82F6"
            />
            <StatCard
              title="Sesiones"
              value={metrics.overview?.totalSessions || 0}
              icon="📊"
              color="#10B981"
            />
            <StatCard
              title="Paginas Vistas"
              value={metrics.overview?.totalPageviews || 0}
              icon="📄"
              color="#F59E0B"
            />
            <StatCard
              title="Eventos"
              value={metrics.overview?.totalEvents || 0}
              icon="🎯"
              color="#8B5CF6"
            />
            <StatCard
              title="Duracion Media"
              value={formatDuration(metrics.overview?.avgSessionDuration || 0)}
              icon="⏱️"
              color="#EC4899"
            />
            <StatCard
              title="Tasa de Rebote"
              value={`${(metrics.overview?.bounceRate || 0).toFixed(1)}%`}
              icon="↩️"
              color="#EF4444"
            />
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Recent Sessions */}
            <div className="dashboard-card">
              <h3>Sesiones Recientes</h3>
              <RecentSessions sessions={sessions} />
            </div>

            {/* Device Distribution */}
            <div className="dashboard-card">
              <h3>Dispositivos</h3>
              <DeviceChart
                devices={metrics.devices || { desktop: 0, mobile: 0, tablet: 0 }}
              />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="dashboard-grid">
            {/* Recent Events */}
            <div className="dashboard-card">
              <h3>Eventos Recientes</h3>
              <RecentEvents events={events} />
            </div>

            {/* Top Pages */}
            <div className="dashboard-card">
              <h3>Paginas Populares</h3>
              <TopPages pages={metrics.topPages || []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

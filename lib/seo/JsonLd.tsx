// ============================================
// JSON-LD Component Helper
// ============================================

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(data) ? data : data),
      }}
    />
  );
}

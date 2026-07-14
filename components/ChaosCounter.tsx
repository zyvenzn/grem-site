export default function ChaosCounter() {
  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px 20px 80px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <Card
          title="Coffee Consumed"
          value="37 Cups"
          color="#a855f7"
        />

        <Card
          title="Rug Pulls Witnessed"
          value="9,999+"
          color="#ef4444"
        />

        <Card
          title="Sanity Remaining"
          value="2%"
          color="#f59e0b"
        />

        <Card
          title="Cycles Survived"
          value="∞"
          color="#10b981"
        />
      </div>
    </section>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "rgba(10,10,10,0.85)",
        border: "1px solid rgba(168,85,247,0.15)",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <div
        style={{
          color: "#9ca3af",
          fontSize: "13px",
          marginBottom: "12px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: "34px",
          fontWeight: "800",
        }}
      >
        {value}
      </div>
    </div>
  );
}
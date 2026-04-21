const statusMap = {
  new:       { bg: "#DBEAFE", color: "#1E40AF" },
  contacted: { bg: "#FEF3C7", color: "#92400E" },
  converted: { bg: "#D1FAE5", color: "#065F46" },
  replied:   { bg: "#FEF3C7", color: "#92400E" },
  closed:    { bg: "#F1F5F9", color: "#475569" },
  confirmed: { bg: "#D1FAE5", color: "#065F46" },
  completed: { bg: "#DCFCE7", color: "#14532D" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B" },
  pending:   { bg: "#FEF9C3", color: "#854D0E" },
};

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const style = statusMap[normalized] || { bg: "#F1F5F9", color: "#475569" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        backgroundColor: style.bg,
        color: style.color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;

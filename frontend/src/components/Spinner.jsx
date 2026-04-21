function Spinner({ label = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "3rem 0",
        color: "#475569",
      }}
    >
      <span
        style={{
          width: "1.25rem",
          height: "1.25rem",
          borderRadius: "50%",
          border: "2px solid #E2E8F0",
          borderTopColor: "#2563EB",
          animation: "spin 0.7s linear infinite",
          display: "inline-block",
        }}
      />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Spinner;

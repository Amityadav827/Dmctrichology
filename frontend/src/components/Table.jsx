function Table({ columns, children, stickyHeader = false }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              backgroundColor: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
              position: stickyHeader ? "sticky" : "static",
              top: stickyHeader ? 0 : "auto",
              zIndex: stickyHeader ? 10 : "auto",
            }}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: "0.75rem 1.25rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#64748B",
                    textAlign: column.align === "right" ? "right" : "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            style={{
              backgroundColor: "#FFFFFF",
              color: "#334155",
              fontSize: "0.875rem",
            }}
          >
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;

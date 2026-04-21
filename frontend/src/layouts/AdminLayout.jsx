import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          minWidth: "260px",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          boxShadow: "1px 0 0 #E2E8F0",
          zIndex: 30,
        }}
        className="scrollbar-hide"
      >
        <Sidebar />
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <Header />

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: "1.5rem",
            maxWidth: "100%",
          }}
          className="animate-fade-in"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

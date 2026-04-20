import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 xl:flex-row animate-fade-in p-4 md:p-6">
        
        {/* Sidebar Section */}
        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:w-[280px] xl:flex-none z-20">
          <Sidebar />
        </div>

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          <Header />
          
          {/* Premium Glassmorphism Page Wrapper */}
          <div className="flex-1 bg-white/80 dark:bg-darkCard/80 backdrop-blur-xl rounded-2xl shadow-panel border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
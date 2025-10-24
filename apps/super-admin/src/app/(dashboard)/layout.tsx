"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import SidebarNav from "./SidebarNav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-white text-black">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 md:hidden ${isSidebarOpen ? "block" : "hidden"}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      />
      {/* Sidebar */}
      <aside
        className={`border-r border-black/10 p-5 bg-[linear-gradient(to_bottom,#EFEDE7,#E7E2D9)] md:sticky md:top-0 md:h-screen md:overflow-y-auto md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 transform transition-transform duration-200 ease-in-out -translate-x-full z-40 ${
          isSidebarOpen ? "translate-x-0" : ""
        }`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-black.png" alt="Brand logo" width={36} height={36} className="h-9 w-9 rounded-md object-contain" />
            <div className="text-lg font-semibold tracking-tight">ShipCaptain</div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-black">beta</span>
        </div>
        <SidebarNav setIsSidebarOpen={setIsSidebarOpen} />
      </aside>

      {/* Main area */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-black/10 bg-white p-3 shadow-md">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open sidebar"
                aria-expanded={isSidebarOpen}
                onClick={() => setIsSidebarOpen((v) => !v)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
              <div className="font-medium"></div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="search"
                placeholder="Search"
                className="px-3 py-1.5 border border-black/20 rounded-md outline-none focus:ring-2 focus:ring-black/20 bg-white placeholder-black/40"
              />
              <Button variant="ghost" size="sm" asChild className="text-sm text-black/70 hover:bg-[#E7E2D9] px-2 py-1 rounded-md">
                <a href="/login">Logout</a>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 mx-auto max-w-7xl w-full">{children}</main>
      </div>
    </div>
  );
}



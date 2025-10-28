import { Button } from "@repo/ui/components/ui/button";
import SideMenu from "./SideMenu";
import { SidebarProvider, SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <SideMenu />
      <main className="flex-1">
        <header className="flex justify-between items-center sticky top-0 z-10 h-12 bg-white border-b border-gray-200 px-4 shadow-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </header>
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

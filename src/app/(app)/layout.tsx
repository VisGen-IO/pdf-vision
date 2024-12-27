'use client';
import "@/app/globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen">
      <SidebarProvider>
        {/* Sidebar Section */}
        <AppSidebar />

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col bg-gray-100">
          {/* Header with Sidebar Trigger */}
          <div className="p-4 flex items-center gap-2 bg-white shadow-sm">
            <SidebarTrigger className="-ml-1 text-gray-700 hover:text-gray-900" />
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

'use client'
import "@/app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
  return (
    <div  >
      <SidebarProvider>
        <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
      </SidebarProvider>
    </div>

  );
}

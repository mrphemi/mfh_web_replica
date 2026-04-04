import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { auth0 } from "@/lib/auth0";
import { QueryProvider } from "@/providers/queryProvider";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MFH Attendance",
  description: "Church attendance management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  return (
    <html lang="en">
      <body className={`${jakarta.variable} antialiased`}>
        <QueryProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" user={session.user} />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col p-4 md:p-6">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}

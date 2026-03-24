"use client";

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import SideMenu from "@/components/sideMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname.includes("/sign-in") || pathname.includes("/sign-up");

  return (
    <ClerkProvider
      dynamic
      signInFallbackRedirectUrl={"/dashboard"}
      afterSignOutUrl={"/"}
    >
      <Providers>
        {isAuthRoute ? (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            {children}
          </div>
        ) : (
          <div className="flex min-h-screen bg-gray-50">
            <SideMenu />
            <div className="flex-1 flex flex-col ml-[280px]">
              <Navbar />
              <main className="flex-1 p-6 pt-24 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        )}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-card border border-border shadow-lg rounded-xl",
              title: "text-foreground font-medium",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-secondary text-secondary-foreground",
              closeButton: "text-muted-foreground hover:text-foreground",
            },
          }}
        />
      </Providers>
    </ClerkProvider>
  );
}

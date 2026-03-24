"use client";

import { useLanguage } from "@/contexts/language.context";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Bot,
  Zap,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const mainNavItems: NavItem[] = [
    {
      labelKey: "nav.interviews",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      labelKey: "nav.interviewers",
      href: "/dashboard/interviewers",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      labelKey: "nav.settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.includes("/interviews");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white flex flex-col border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              ROBUT
            </span>
            <span className="text-[10px] text-gray-500 -mt-1 tracking-widest uppercase">
              AI Interviews
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Plataforma
        </p>
        {mainNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <span className={cn(
                "transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{t(item.labelKey)}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-accent/10 text-accent rounded-full">
                  {item.badge}
                </span>
              )}
              {active && (
                <ChevronRight className="w-4 h-4 text-primary/70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-border/30 space-y-1">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <span className={cn(
                "transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{t(item.labelKey)}</span>
            </button>
          );
        })}

        {/* Pro Upgrade Card */}
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 rounded-xl border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Zap className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Actualizar a Pro</span>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Desbloquea entrevistas ilimitadas y funciones avanzadas de IA.
            </p>
            <a
              href="mailto:support@robut.ai"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Comenzar
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Help Link */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ayuda y Soporte</span>
        </button>
      </div>
    </aside>
  );
}

export default SideMenu;

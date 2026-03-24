"use client";

import LanguageSwitcher from "@/components/language-switcher";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Bell, Search, Command, Sparkles } from "lucide-react";
import React from "react";

function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-[280px] z-40 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-lg">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search interviews, interviewers..."
              className="w-full pl-11 pr-20 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-secondary transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md">
              <Command className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">K</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* AI Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-600">IA Lista</span>
          </div>

          <div className="h-6 w-px bg-border/50" />
          
          <LanguageSwitcher />

          <OrganizationSwitcher
            afterCreateOrganizationUrl="/dashboard"
            hidePersonal={true}
            afterSelectOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "flex items-center",
                organizationSwitcherTrigger: "py-1.5 px-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary hover:border-border transition-all text-foreground",
                organizationSwitcherTriggerIcon: "text-muted-foreground",
              },
              variables: {
                fontSize: "0.875rem",
              },
            }}
          />
          
          <button
            type="button"
            className="relative p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary border border-transparent hover:border-border/50 transition-all"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
          </button>

          <UserButton 
            afterSignOutUrl="/sign-in" 
            signInUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 rounded-xl ring-2 ring-border/50 hover:ring-primary/50 transition-all",
                userButtonTrigger: "focus:shadow-none",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;

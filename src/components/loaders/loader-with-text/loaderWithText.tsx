"use client";

import { useLanguage } from "@/contexts/language.context";
import { Loader2 } from "lucide-react";

function LoaderWithText() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-secondary" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {t("general.loading")}
      </span>
    </div>
  );
}

export default LoaderWithText;

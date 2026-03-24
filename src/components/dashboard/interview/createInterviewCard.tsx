"use client";

import Modal from "@/components/dashboard/Modal";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";
import { useLanguage } from "@/contexts/language.context";
import { Plus, Zap } from "lucide-react";
import React, { useState } from "react";

function CreateInterviewCard() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-64 border border-dashed border-primary/40 rounded-2xl flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 hover:from-primary/10 hover:to-accent/10 hover:border-primary/60 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative w-16 h-16 bg-primary/10 group-hover:bg-primary/20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 border border-primary/20 group-hover:border-primary/40">
          <Plus className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        <div className="relative flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-primary" />
          <p className="text-base font-semibold text-foreground">
            {t("dashboard.createInterview")}
          </p>
        </div>
        <p className="relative text-sm text-muted-foreground text-center">
          {t("dashboard.startGettingResponses")}
        </p>
      </button>

      <Modal
        open={open}
        closeOnOutsideClick={false}
        onClose={() => setOpen(false)}
      >
        <CreateInterviewModal open={open} setOpen={setOpen} />
      </Modal>
    </>
  );
}

export default CreateInterviewCard;

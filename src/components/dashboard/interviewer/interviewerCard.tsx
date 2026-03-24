"use client";

import Modal from "@/components/dashboard/Modal";
import InterviewerDetailsModal from "@/components/dashboard/interviewer/interviewerDetailsModal";
import { useLanguage } from "@/contexts/language.context";
import { getLanguageByCode } from "@/lib/languages";
import type { Interviewer } from "@/types/interviewer";
import { Bot, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  interviewer: Interviewer;
}

function InterviewerCard({ interviewer }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const language = getLanguageByCode(interviewer.language || "en");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex-none w-44 bg-card/50 border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/40 cursor-pointer group"
      >
        {/* Image Section */}
        <div className="h-32 overflow-hidden relative">
          <Image
            src={interviewer.image}
            alt={`${interviewer.name}`}
            width={176}
            height={128}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Language Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border/50">
            <span className="text-base">{language?.flag}</span>
            <span className="text-xs font-medium text-foreground">{language?.code.toUpperCase()}</span>
          </div>

          {/* AI Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-primary backdrop-blur-sm rounded-lg shadow-lg shadow-primary/30">
            <Bot className="w-3 h-3 text-primary-foreground" />
            <span className="text-[10px] font-semibold text-primary-foreground uppercase tracking-wide">AI</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {interviewer.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {interviewer.description?.slice(0, 60) || t("interviewers.aiInterviewer")}...
          </p>
          
          {/* Stats Preview */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden border border-border/30">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${((interviewer.empathy || 5) / 10) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-primary">
              {((interviewer.empathy || 5) / 10 * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </button>

      <Modal
        open={open}
        closeOnOutsideClick={true}
        onClose={() => setOpen(false)}
      >
        <InterviewerDetailsModal interviewer={interviewer} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export default InterviewerCard;

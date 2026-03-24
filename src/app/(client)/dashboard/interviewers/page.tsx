"use client";

import CreateInterviewerButton from "@/components/dashboard/interviewer/createInterviewerButton";
import InterviewerCard from "@/components/dashboard/interviewer/interviewerCard";
import { useLanguage } from "@/contexts/language.context";
import { useInterviewers } from "@/contexts/interviewers.context";
import { ChevronLeft, ChevronRight, Users, Zap, UserPlus, Bot, Cpu } from "lucide-react";
import React, { useRef } from "react";

function Interviewers() {
  const { interviewers, interviewersLoading } = useInterviewers();
  const { t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 220;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 220;
    }
  };

  function InterviewersLoader() {
    return (
      <div className="flex gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-none w-44 rounded-2xl overflow-hidden bg-secondary/30 animate-pulse border border-border/50">
            <div className="h-32 bg-secondary/40" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-secondary/40 rounded-lg w-3/4" />
              <div className="h-3 bg-secondary/40 rounded-lg w-full" />
              <div className="h-2 bg-secondary/40 rounded-full w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-lg flex items-center justify-center border-2 border-background">
                <Zap className="w-3 h-3 text-accent-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {t("interviewers.title")}
              </h1>
              <p className="text-muted-foreground mt-0.5">
                {t("interviewers.subtitle")}
              </p>
            </div>
          </div>
          
          {/* Stats Badge */}
          {interviewers.length > 0 && (
            <div className="flex items-center gap-3 px-5 py-3 bg-card/50 rounded-2xl border border-border/50">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{interviewers.length}</p>
                <p className="text-xs text-muted-foreground">{t("interviewers.totalInterviewers")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {interviewers.length === 0 && !interviewersLoading && (
        <div className="relative bg-gradient-to-br from-card via-secondary/20 to-card rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden border border-border/50">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] border border-primary/20">
                <Bot className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 p-2.5 bg-accent rounded-xl shadow-lg shadow-accent/30">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
                {t("interviewers.emptyState")}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg text-lg leading-relaxed">
                {t("interviewers.emptyDescription")}
              </p>
              <CreateInterviewerButton variant="prominent" />
            </div>
          </div>
        </div>
      )}

      {/* Interviewers Grid/Carousel */}
      {(interviewers.length > 0 || interviewersLoading) && (
        <div className="relative">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <p className="text-sm font-medium text-muted-foreground">
                {t("interviewers.manageTeam")}
              </p>
            </div>
            
            {/* Navigation Arrows */}
            {interviewers.length > 4 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={slideLeft}
                  className="p-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground transition-all hover:shadow-lg active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={slideRight}
                  className="p-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground transition-all hover:shadow-lg active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Carousel */}
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {interviewersLoading ? (
              <InterviewersLoader />
            ) : (
              <>
                {interviewers.map((interviewer) => (
                  <InterviewerCard key={interviewer.id} interviewer={interviewer} />
                ))}
                {/* Add New Interviewer Card */}
                <CreateInterviewerButton variant="card" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Interviewers;

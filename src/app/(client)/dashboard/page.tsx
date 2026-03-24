"use client";

import Modal from "@/components/dashboard/Modal";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import { useLanguage } from "@/contexts/language.context";
import { useInterviews } from "@/contexts/interviews.context";
import { ClientService } from "@/services/clients.service";
import { InterviewService } from "@/services/interviews.service";
import { ResponseService } from "@/services/responses.service";
import { useOrganization } from "@clerk/nextjs";
import { Gem, Bot, TrendingUp, Users, Zap, Activity } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews();
  const { organization } = useOrganization();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [allowedResponsesCount, setAllowedResponsesCount] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Calculate stats
  const totalInterviews = interviews.length;
  const activeInterviews = interviews.filter((i) => i.is_active).length;

  function InterviewsLoader() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-secondary/30 animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (organization?.id) {
          const data = await ClientService.getOrganizationById(organization.id);
          if (data?.plan) {
            setCurrentPlan(data.plan);
            if (data.plan === "free_trial_over") {
              setIsModalOpen(true);
            }
          }
          if (data?.allowed_responses_count) {
            setAllowedResponsesCount(data.allowed_responses_count);
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchOrganizationData();
  }, [organization]);

  useEffect(() => {
    const fetchResponsesCount = async () => {
      if (!organization || currentPlan !== "free") {
        return;
      }

      setLoading(true);
      try {
        const totalResponses = await ResponseService.getResponseCountByOrganizationId(
          organization.id,
        );
        const hasExceededLimit = totalResponses >= allowedResponsesCount;
        if (hasExceededLimit) {
          setCurrentPlan("free_trial_over");
          await InterviewService.deactivateInterviewsByOrgId(organization.id);
          await ClientService.updateOrganization({ plan: "free_trial_over" }, organization.id);
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsesCount();
  }, [organization, currentPlan, allowedResponsesCount]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                <Zap className="w-2.5 h-2.5 text-accent-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {t("dashboard.myInterviews")}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {t("dashboard.startGettingResponses")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-card/50 border border-border/50 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors group">
          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalInterviews}</p>
            <p className="text-sm text-muted-foreground">{t("nav.interviews")}</p>
          </div>
        </div>
        <div className="bg-card/50 border border-border/50 rounded-2xl p-5 flex items-center gap-4 hover:border-accent/30 transition-colors group">
          <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeInterviews}</p>
            <p className="text-sm text-muted-foreground">{t("interview.active")}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl p-5 flex items-center gap-4 text-primary-foreground group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative p-3 bg-white/20 rounded-xl">
            <Gem className="w-5 h-5" />
          </div>
          <div className="relative">
            <p className="text-sm font-semibold">
              {currentPlan === "free_trial_over" ? t("upgrade.proPlan") : t("upgrade.freePlan")}
            </p>
            <p className="text-xs opacity-80">
              {currentPlan === "free_trial_over" ? t("upgrade.toUpgrade") : `${allowedResponsesCount} ${t("dashboard.responses")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Interview Cards Grid */}
      {interviewsLoading || loading ? (
        <InterviewsLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {currentPlan === "free_trial_over" ? (
            <div className="h-64 border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center p-6 bg-secondary/30">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Gem className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground text-center font-medium">
                {t("dashboard.cannotCreate")}
              </p>
            </div>
          ) : (
            <CreateInterviewCard />
          )}
          
          {interviews.map((item) => (
            <InterviewCard
              id={item.id}
              interviewerId={item.interviewer_id}
              key={item.id}
              name={item.name}
              url={item.url ?? ""}
              readableSlug={item.readable_slug}
            />
          ))}
        </div>
      )}

      {/* Upgrade Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col space-y-6 p-2 max-w-lg">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Gem className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t("upgrade.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("upgrade.message")}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-xl bg-secondary/30">
                <h4 className="font-semibold text-foreground mb-3">{t("upgrade.freePlan")}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                    {t("upgrade.freeResponses")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                    {t("upgrade.freeSupport")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                    {t("upgrade.freeFeatures")}
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border-2 border-primary rounded-xl bg-primary/5">
                <h4 className="font-semibold text-foreground mb-3">{t("upgrade.proPlan")}</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {t("upgrade.proResponses")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {t("upgrade.proSupport")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {t("upgrade.proFeatures")}
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              {t("upgrade.contact")} <span className="font-semibold text-primary">founders@folo-up.co</span> {t("upgrade.toUpgrade")}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Interviews;

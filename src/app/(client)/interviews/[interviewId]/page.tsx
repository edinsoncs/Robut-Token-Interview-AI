"use client";

import CallInfo from "@/components/call/callInfo";
import Modal from "@/components/dashboard/Modal";
import EditInterview from "@/components/dashboard/interview/editInterview";
import SharePopup from "@/components/dashboard/interview/sharePopup";
import SummaryInfo from "@/components/dashboard/interview/summaryInfo";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language.context";
import { useInterviews } from "@/contexts/interviews.context";
import { CandidateStatus } from "@/lib/enum";
import { formatTimestampToDateHHMM } from "@/lib/utils";
import { ClientService } from "@/services/clients.service";
import { InterviewService } from "@/services/interviews.service";
import { ResponseService } from "@/services/responses.service";
import type { Interview } from "@/types/interview";
import type { Response } from "@/types/response";
import { useOrganization } from "@clerk/nextjs";
import { Eye, Filter, Palette, Pencil, Share2, Users, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, use } from "react";
import { ChromePicker } from "react-color";
import { toast } from "sonner";

interface Props {
  params: Promise<{
    interviewId: string;
  }>;
  searchParams: Promise<{
    call: string;
    edit: boolean;
  }>;
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewHome({ params, searchParams }: Props) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const [interview, setInterview] = useState<Interview>();
  const [responses, setResponses] = useState<Response[]>();
  const { getInterviewById } = useInterviews();
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<string>("#0d9488");
  const [iconColor, seticonColor] = useState<string>("#0d9488");
  const { organization } = useOrganization();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const seeInterviewPreviewPage = () => {
    const protocol = base_url?.includes("localhost") ? "http" : "https";
    if (interview?.url) {
      const url = interview?.readable_slug
        ? `${protocol}://${base_url}/call/${interview?.readable_slug}`
        : interview.url.startsWith("http")
          ? interview.url
          : `https://${interview.url}`;
      window.open(url, "_blank");
    } else {
      console.error("Interview URL is null or undefined.");
    }
  };

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(resolvedParams.interviewId);
        setInterview(response);
        setIsActive(response.is_active);
        setIsViewed(response.is_viewed);
        setThemeColor(response.theme_color ?? "#0d9488");
        seticonColor(response.theme_color ?? "#0d9488");
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!interview || !isGeneratingInsights) {
      fetchInterview();
    }
  }, [getInterviewById, resolvedParams.interviewId, isGeneratingInsights, interview]);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (organization?.id) {
          const data = await ClientService.getOrganizationById(organization.id);
          if (data?.plan) {
            setCurrentPlan(data.plan);
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchOrganizationData();
  }, [organization]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await ResponseService.getAllResponses(resolvedParams.interviewId);
        setResponses(response);
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [resolvedParams.interviewId]);

  const handleDeleteResponse = (deletedCallId: string) => {
    if (responses) {
      setResponses(responses.filter((response) => response.call_id !== deletedCallId));
      if (resolvedSearchParams.call === deletedCallId) {
        router.push(`/interviews/${resolvedParams.interviewId}`);
      }
    }
  };

  const handleResponseClick = async (response: Response) => {
    try {
      await ResponseService.saveResponse({ is_viewed: true }, response.call_id);
      if (responses) {
        const updatedResponses = responses.map((r) =>
          r.call_id === response.call_id ? { ...r, is_viewed: true } : r,
        );
        setResponses(updatedResponses);
      }
      setIsViewed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async () => {
    try {
      const updatedIsActive = !isActive;
      setIsActive(updatedIsActive);

      await InterviewService.updateInterview(
        { is_active: updatedIsActive },
        resolvedParams.interviewId,
      );

      toast.success(t("interview.statusUpdated"), {
        description: `${t("interview.statusDescription")} ${updatedIsActive ? t("interview.active").toLowerCase() : t("interview.inactive").toLowerCase()}.`,
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error(t("general.error"), {
        description: t("interview.errorUpdate"),
        duration: 3000,
      });
    }
  };

  const handleThemeColorChange = async (newColor: string) => {
    try {
      await InterviewService.updateInterview({ theme_color: newColor }, resolvedParams.interviewId);

      toast.success(t("interview.themeUpdated"), {
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error(t("general.error"), {
        description: "Failed to update the theme color.",
        duration: 3000,
      });
    }
  };

  const handleCandidateStatusChange = (callId: string, newStatus: string) => {
    setResponses((prevResponses) => {
      return prevResponses?.map((response) =>
        response.call_id === callId ? { ...response, candidate_status: newStatus } : response,
      );
    });
  };

  const openSharePopup = () => {
    setIsSharePopupOpen(true);
  };

  const closeSharePopup = () => {
    setIsSharePopupOpen(false);
  };

  const handleColorChange = (color: { hex: string }) => {
    setThemeColor(color.hex);
  };

  const applyColorChange = () => {
    if (themeColor !== iconColor) {
      seticonColor(themeColor);
      handleThemeColorChange(themeColor);
    }
    setShowColorPicker(false);
  };

  const filterResponses = () => {
    if (!responses) {
      return [];
    }
    if (filterStatus === "ALL") {
      return responses;
    }

    return responses?.filter((response) => response?.candidate_status === filterStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_SELECTED": return "bg-red-500";
      case "POTENTIAL": return "bg-amber-500";
      case "SELECTED": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-background">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoaderWithText />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-card/50 border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-lg ring-2 ring-background shadow-lg"
                  style={{ backgroundColor: iconColor }}
                />
                <h1 className="text-lg font-bold text-foreground">{interview?.name}</h1>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 border border-border/50 rounded-full">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{responses?.length || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <button
                type="button"
                onClick={openSharePopup}
                className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                title={t("interview.share")}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={seeInterviewPreviewPage}
                className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                title={t("interview.preview")}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                title={t("interview.themeColor")}
              >
                <Palette className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push(`/interviews/${resolvedParams.interviewId}?edit=true`)}
                className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                title={t("interview.edit")}
              >
                <Pencil className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-border/50 mx-1" />

              {/* Active Toggle */}
              {currentPlan !== "free_trial_over" && (
                <div className="flex items-center gap-3 px-3 py-1.5 bg-secondary/30 rounded-xl border border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("interview.active")}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      isActive ? "bg-accent shadow-lg shadow-accent/30" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 gap-4 p-4 overflow-hidden">
            {/* Sidebar - Responses List */}
            <div className="w-72 flex-shrink-0 bg-card/50 border border-border/50 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border/50">
                <Select onValueChange={(newValue: string) => setFilterStatus(newValue)}>
                  <SelectTrigger className="w-full bg-secondary/50 border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                    <Filter className="w-4 h-4 text-primary" />
                    <SelectValue placeholder={t("responses.filterBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CandidateStatus.NO_STATUS}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                        {t("responses.noStatus")}
                      </div>
                    </SelectItem>
                    <SelectItem value={CandidateStatus.NOT_SELECTED}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        {t("responses.notSelected")}
                      </div>
                    </SelectItem>
                    <SelectItem value={CandidateStatus.POTENTIAL}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                        {t("responses.potential")}
                      </div>
                    </SelectItem>
                    <SelectItem value={CandidateStatus.SELECTED}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        {t("responses.selected")}
                      </div>
                    </SelectItem>
                    <SelectItem value="ALL">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 border-2 border-muted-foreground rounded-full" />
                        {t("responses.all")}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="flex-1 p-2">
                {filterResponses().length > 0 ? (
                  <div className="space-y-2">
                    {filterResponses().map((response) => (
                      <button
                        type="button"
                        key={response?.id}
                        onClick={() => {
                          router.push(`/interviews/${resolvedParams.interviewId}?call=${response.call_id}`);
                          handleResponseClick(response);
                        }}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          resolvedSearchParams.call === response.call_id
                            ? "bg-primary/10 border border-primary/50 shadow-lg shadow-primary/10"
                            : "bg-secondary/30 border border-transparent hover:border-primary/30 hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-1 h-full min-h-[40px] rounded-full ${getStatusColor(response.candidate_status)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-foreground truncate">
                                {response?.name ? `${response?.name}` : t("responses.anonymous")}
                              </p>
                              {!response.is_viewed && (
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatTimestampToDateHHMM(String(response?.created_at))}
                            </p>
                            {response.analytics?.overallScore !== undefined && (
                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                  {response.analytics.overallScore}
                                </span>
                                <span className="text-xs text-muted-foreground">score</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-muted-foreground">{t("responses.noResponses")}</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Main Panel */}
            {responses && (
              <div className="flex-1 bg-card/50 border border-border/50 rounded-2xl overflow-hidden">
                {resolvedSearchParams.call ? (
                  <CallInfo
                    call_id={resolvedSearchParams.call}
                    onDeleteResponse={handleDeleteResponse}
                    onCandidateStatusChange={handleCandidateStatusChange}
                  />
                ) : resolvedSearchParams.edit ? (
                  <EditInterview interview={interview} />
                ) : (
                  <SummaryInfo responses={responses} interview={interview} />
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Color Picker Modal */}
      <Modal open={showColorPicker} closeOnOutsideClick={false} onClose={applyColorChange}>
        <div className="w-[280px]">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            {t("interview.themeColor")}
          </h3>
          <ChromePicker
            disableAlpha={true}
            color={themeColor}
            styles={{
              default: {
                picker: { width: "100%", boxShadow: "none" },
              },
            }}
            onChange={handleColorChange}
          />
          <button
            type="button"
            onClick={applyColorChange}
            className="btn-primary w-full mt-4"
          >
            {t("general.save")}
          </button>
        </div>
      </Modal>

      {/* Share Popup */}
      {isSharePopupOpen && (
        <SharePopup
          open={isSharePopupOpen}
          shareContent={
            interview?.readable_slug
              ? `${base_url}/call/${interview?.readable_slug}`
              : (interview?.url as string)
          }
          onClose={closeSharePopup}
        />
      )}
    </div>
  );
}

export default InterviewHome;

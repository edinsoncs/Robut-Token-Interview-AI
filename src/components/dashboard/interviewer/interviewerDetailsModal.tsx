"use client";

import { Button } from "@/components/ui/button";
import { useInterviewers } from "@/contexts/interviewers.context";
import { useLanguage } from "@/contexts/language.context";
import { getLanguageByCode } from "@/lib/languages";
import type { Interviewer } from "@/types/interviewer";
import { Volume2, Trash2, Loader2, Sparkles, Globe, Bot, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactAudioPlayer from "react-audio-player";

interface Props {
  interviewer: Interviewer | undefined;
  onClose?: () => void;
}

function InterviewerDetailsModal({ interviewer, onClose }: Props) {
  const { t } = useLanguage();
  const { deleteInterviewer } = useInterviewers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!interviewer) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteInterviewer(interviewer.id);
      if (success && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting interviewer:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const interviewerLanguage = getLanguageByCode(interviewer?.language || "en");

  const settings = [
    { label: t("interviewers.empathy"), value: (interviewer?.empathy || 10) / 10, color: "from-blue-500 to-cyan-500" },
    { label: t("interviewers.rapport"), value: (interviewer?.rapport || 10) / 10, color: "from-purple-500 to-pink-500" },
    { label: t("interviewers.exploration"), value: (interviewer?.exploration || 10) / 10, color: "from-orange-500 to-amber-500" },
    { label: t("interviewers.speed"), value: (interviewer?.speed || 10) / 10, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="w-full max-w-2xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        {/* Avatar */}
        <div className="relative flex-shrink-0 w-full sm:w-44 h-48 sm:h-52 rounded-3xl overflow-hidden border-4 border-secondary bg-secondary group">
          {interviewer?.image ? (
            <Image
              src={interviewer.image}
              alt={interviewer.name}
              width={176}
              height={208}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Bot className="w-16 h-16" />
            </div>
          )}
          
          {/* Language Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-background/95 backdrop-blur-sm rounded-full shadow-lg border border-border/50">
            <span className="text-lg">{interviewerLanguage?.flag}</span>
            <span className="text-sm font-medium text-foreground">{interviewerLanguage?.name}</span>
          </div>

          {/* AI Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-primary/95 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">AI Powered</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-2xl font-bold text-foreground">{interviewer?.name}</h2>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-5">
            {interviewer?.description}
          </p>
          
          {/* Audio Preview */}
          {interviewer?.audio && (
            <div className="bg-secondary/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Volume2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{t("interviewers.voicePreview")}</span>
                  <p className="text-xs text-muted-foreground">{interviewerLanguage?.voiceName}</p>
                </div>
              </div>
              <ReactAudioPlayer 
                src={`/audio/${interviewer.audio}`} 
                controls 
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="bg-gradient-to-br from-secondary/50 to-secondary/20 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{t("interviewers.settings")}</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {settings.map((setting) => (
            <div key={setting.label} className="bg-background/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{setting.label}</span>
                <span className="text-lg font-bold text-foreground">
                  {(setting.value * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${setting.color} rounded-full transition-all duration-500`}
                  style={{ width: `${setting.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Section */}
      <div className="border-t border-border pt-6">
        {!showConfirm ? (
          <Button
            variant="outline"
            className="w-full py-6 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 transition-all"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("interviewers.deleteInterviewer")}
          </Button>
        ) : (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{t("interviewers.deleteTitle")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("interviewers.confirmDelete")}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-5 rounded-xl"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                {t("general.cancel")}
              </Button>
              <Button
                variant="destructive"
                className="flex-1 py-5 rounded-xl"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("general.loading")}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("general.delete")}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewerDetailsModal;

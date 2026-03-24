"use client";

import Modal from "@/components/dashboard/Modal";
import { Button } from "@/components/ui/button";
import { useInterviewers } from "@/contexts/interviewers.context";
import { useLanguage } from "@/contexts/language.context";
import { LANGUAGES } from "@/lib/languages";
import type { Language } from "@/types/interviewer";
import axios from "axios";
import { Loader2, UserPlus, Sparkles, Check, Globe, Mic, Bot } from "lucide-react";
import { useState } from "react";

interface Props {
  variant?: "card" | "prominent";
}

function CreateInterviewerButton({ variant = "card" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { t } = useLanguage();
  const { refreshInterviewers } = useInterviewers();

  const createInterviewers = async (lang: Language) => {
    setIsLoading(true);
    try {
      await axios.post("/api/create-interviewer", {
        language: lang.code,
      });
      refreshInterviewers();
      setIsModalOpen(false);
      setSelectedLanguage(null);
    } catch (error: any) {
      console.error("Error creating interviewers:", error?.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      createInterviewers(selectedLanguage);
    }
  };

  // Show English, Spanish, and Russian
  const availableLanguages = LANGUAGES.filter(lang => lang.code === "en" || lang.code === "es" || lang.code === "ru");

  if (variant === "prominent") {
    return (
      <>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t("interviewers.getStarted")}
        </Button>

        <Modal open={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedLanguage(null); }}>
          <CreateInterviewerModalContent
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            onConfirm={handleConfirm}
            onCancel={() => { setIsModalOpen(false); setSelectedLanguage(null); }}
            isLoading={isLoading}
            availableLanguages={availableLanguages}
            t={t}
          />
        </Modal>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className="flex-none w-40 h-[176px] bg-gradient-to-br from-primary/5 via-secondary/30 to-accent/5 border-2 border-dashed border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="relative mb-4">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
            </div>
          </div>
          <p className="text-sm font-medium text-foreground text-center">
            {t("interviewers.createNew")}
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {t("interviewers.clickToStart")}
          </p>
        </div>
      </button>

      <Modal open={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedLanguage(null); }}>
        <CreateInterviewerModalContent
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleSelectLanguage}
          onConfirm={handleConfirm}
          onCancel={() => { setIsModalOpen(false); setSelectedLanguage(null); }}
          isLoading={isLoading}
          availableLanguages={availableLanguages}
          t={t}
        />
      </Modal>
    </>
  );
}

interface ModalContentProps {
  selectedLanguage: Language | null;
  onSelectLanguage: (lang: Language) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  availableLanguages: Language[];
  t: (key: string) => string;
}

function CreateInterviewerModalContent({
  selectedLanguage,
  onSelectLanguage,
  onConfirm,
  onCancel,
  isLoading,
  availableLanguages,
  t,
}: ModalContentProps) {
  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl mb-4">
          <Bot className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("interviewers.createNewTitle")}
        </h2>
        <p className="text-muted-foreground">
          {t("interviewers.selectLanguageDesc")}
        </p>
      </div>

      {/* Language Selection */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t("interviewers.selectLanguage")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang)}
              disabled={isLoading}
              className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left group
                ${selectedLanguage?.code === lang.code 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                  : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {/* Flag */}
              <div className={`text-4xl transition-transform duration-300 ${selectedLanguage?.code === lang.code ? "scale-110" : "group-hover:scale-105"}`}>
                {lang.flag}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-lg">{lang.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Mic className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{lang.voiceName}</span>
                </div>
              </div>

              {/* Check */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${selectedLanguage?.code === lang.code 
                  ? "border-primary bg-primary" 
                  : "border-border"
                }
              `}>
                {selectedLanguage?.code === lang.code && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      {selectedLanguage && (
        <div className="bg-secondary/30 rounded-2xl p-4 mb-6">
          <p className="text-sm text-muted-foreground text-center">
            {t("interviewers.willCreate")} <span className="font-medium text-foreground">2 {t("interviewers.aiInterviewers")}</span> {t("interviewers.inLanguage")} <span className="font-medium text-foreground">{selectedLanguage.name}</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-6 rounded-xl"
        >
          {t("general.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!selectedLanguage || isLoading}
          className="flex-1 py-6 rounded-xl bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("interviewers.creating")}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {t("interviewers.createInterviewers")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CreateInterviewerButton;

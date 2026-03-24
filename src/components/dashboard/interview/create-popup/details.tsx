"use client";

import Modal from "@/components/dashboard/Modal";
import InterviewerDetailsModal from "@/components/dashboard/interviewer/interviewerDetailsModal";
import { useLanguage } from "@/contexts/language.context";
import { useInterviewers } from "@/contexts/interviewers.context";
import type { InterviewBase, Question } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import axios from "axios";
import { ChevronLeft, ChevronRight, FileText, Info, UploadCloud, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import FileUpload from "../fileUpload";

interface Props {
  open: boolean;
  setLoading: (loading: boolean) => void;
  interviewData: InterviewBase;
  setInterviewData: (interviewData: InterviewBase) => void;
  isUploaded: boolean;
  setIsUploaded: (isUploaded: boolean) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
}

type DocMode = "upload" | "manual";

function DetailsPopup({
  open,
  setLoading,
  interviewData,
  setInterviewData,
  isUploaded,
  setIsUploaded,
  fileName,
  setFileName,
}: Props) {
  const { interviewers } = useInterviewers();
  const { t } = useLanguage();
  const [isClicked, setIsClicked] = useState(false);
  const [openInterviewerDetails, setOpenInterviewerDetails] = useState(false);
  const [interviewerDetails, setInterviewerDetails] = useState<Interviewer>();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(interviewData.name);
  const [selectedInterviewer, setSelectedInterviewer] = useState(interviewData.interviewer_id);
  const [objective, setObjective] = useState(interviewData.objective);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(interviewData.is_anonymous);
  const [numQuestions, setNumQuestions] = useState(
    interviewData.question_count === 0 ? "" : String(interviewData.question_count),
  );
  const [duration, setDuration] = useState(interviewData.time_duration);
  const [uploadedDocumentContext, setUploadedDocumentContext] = useState("");

  const [docMode, setDocMode] = useState<DocMode>("upload");
  const [manualQuestions, setManualQuestions] = useState<string[]>([""]);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 120;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 120;
    }
  };

  useEffect(() => {
    const count = Number(numQuestions) || 1;
    setManualQuestions((prev) => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        return [...prev, ...Array(count - prev.length).fill("")];
      }
      return prev.slice(0, count);
    });
  }, [numQuestions]);

  const onGenrateQuestions = async () => {
    setLoading(true);

    const data = {
      name: name.trim(),
      objective: objective.trim(),
      number: numQuestions,
      context: uploadedDocumentContext,
    };

    try {
      const generatedQuestions = (await axios.post("/api/generate-interview-questions", data)) as any;
      const generatedQuestionsResponse = JSON.parse(generatedQuestions?.data?.response);

      const updatedQuestions = generatedQuestionsResponse.questions.map((question: Question) => ({
        id: uuidv4(),
        question: question.question.trim(),
        follow_up_count: 1,
      }));

      const updatedInterviewData = {
        ...interviewData,
        name: name.trim(),
        objective: objective.trim(),
        questions: updatedQuestions,
        interviewer_id: selectedInterviewer,
        question_count: Number(numQuestions),
        time_duration: duration,
        description: generatedQuestionsResponse.description,
        is_anonymous: isAnonymous,
      };
      setInterviewData(updatedInterviewData);
    } catch (error: any) {
      console.error("Error generating questions:", error?.response?.data || error?.message || error);
      alert("Failed to generate questions. Please try again.");
      setIsClicked(false);
    } finally {
      setLoading(false);
    }
  };

  const onManual = () => {
    setLoading(true);

    const updatedInterviewData = {
      ...interviewData,
      name: name.trim(),
      objective: objective.trim(),
      questions: [{ id: uuidv4(), question: "", follow_up_count: 1 }],
      interviewer_id: selectedInterviewer,
      question_count: Number(numQuestions),
      time_duration: String(duration),
      description: "",
      is_anonymous: isAnonymous,
    };
    setInterviewData(updatedInterviewData);
  };

  const onManualQuestions = () => {
    setLoading(true);

    const questions = manualQuestions.map((q) => ({
      id: uuidv4(),
      question: q.trim(),
      follow_up_count: 1,
    }));

    const updatedInterviewData = {
      ...interviewData,
      name: name.trim(),
      objective: objective.trim(),
      questions,
      interviewer_id: selectedInterviewer,
      question_count: Number(numQuestions),
      time_duration: String(duration),
      description: "",
      is_anonymous: isAnonymous,
    };
    setInterviewData(updatedInterviewData);
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setSelectedInterviewer(BigInt(0));
      setObjective("");
      setIsAnonymous(false);
      setNumQuestions("");
      setDuration("");
      setIsClicked(false);
      setDocMode("upload");
      setManualQuestions([""]);
    }
  }, [open]);

  const baseFieldsFilled =
    name && objective && numQuestions && duration && selectedInterviewer !== BigInt(0);

  const allManualQuestionsFilled =
    manualQuestions.length === Number(numQuestions) &&
    manualQuestions.every((q) => q.trim() !== "");

  return (
    <>
      <div className="w-[42rem] max-w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t("createInterview.title")}</h1>
        </div>

        <div className="space-y-5">
          {/* Interview Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("createInterview.name")}
            </label>
            <input
              type="text"
              className="input-modern"
              placeholder={t("createInterview.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => setName(e.target.value.trim())}
            />
          </div>

          {/* Select Interviewer */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("createInterview.selectInterviewer")}
            </label>
            <div className="relative flex items-center gap-2">
              <div
                ref={sliderRef}
                className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide py-2 flex-1"
              >
                {interviewers.map((item) => (
                  <div key={item.id} className="flex-none relative">
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 z-10 p-1 bg-primary rounded-full shadow-md hover:bg-primary/90 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInterviewerDetails(item);
                        setOpenInterviewerDetails(true);
                      }}
                    >
                      <Info className="w-3 h-3 text-primary-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedInterviewer(item.id)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-3 transition-all duration-200 ${
                        selectedInterviewer === item.id
                          ? "border-primary ring-4 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <p className="text-xs text-center text-muted-foreground mt-1 truncate w-20">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
              {interviewers.length > 4 && (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={slideRight}
                    className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={slideLeft}
                    className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("createInterview.objective")}
            </label>
            <textarea
              value={objective}
              className="input-modern h-24 resize-none"
              placeholder={t("createInterview.objectivePlaceholder")}
              onChange={(e) => setObjective(e.target.value)}
              onBlur={(e) => setObjective(e.target.value.trim())}
            />
          </div>

          {/* Document / Questions Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                {docMode === "upload"
                  ? t("createInterview.uploadDocs")
                  : t("createInterview.enterManually")}
              </label>
              <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setDocMode("upload")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    docMode === "upload"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {t("createInterview.upload")}
                </button>
                <button
                  type="button"
                  onClick={() => setDocMode("manual")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    docMode === "manual"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {t("createInterview.manual")}
                </button>
              </div>
            </div>

            {docMode === "upload" && (
              <FileUpload
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                fileName={fileName}
                setFileName={setFileName}
                setUploadedDocumentContext={setUploadedDocumentContext}
              />
            )}

            {docMode === "manual" && (
              <div className="space-y-2 max-h-32 overflow-y-auto p-3 bg-secondary/30 rounded-xl">
                {manualQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-5 shrink-0">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => {
                        const updated = [...manualQuestions];
                        updated[idx] = e.target.value;
                        setManualQuestions(updated);
                      }}
                      placeholder={`Question ${idx + 1}`}
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                ))}
                {!numQuestions && (
                  <p className="text-xs text-muted-foreground italic">
                    {t("createInterview.setNumQuestions")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Anonymous Switch */}
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("createInterview.anonymous")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("createInterview.anonymousNote")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isAnonymous ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isAnonymous ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Number of Questions & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("createInterview.numQuestions")}
              </label>
              <input
                type="number"
                min="1"
                max="5"
                className="input-modern text-center"
                value={numQuestions}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === "" || (Number.isInteger(Number(value)) && Number(value) > 0)) {
                    if (Number(value) > 5) value = "5";
                    setNumQuestions(value);
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("createInterview.duration")}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="input-modern text-center"
                value={duration}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === "" || (Number.isInteger(Number(value)) && Number(value) > 0)) {
                    if (Number(value) > 10) value = "10";
                    setDuration(value);
                  }
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {docMode === "upload" && (
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                disabled={!baseFieldsFilled || isClicked}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setIsClicked(true);
                  onGenrateQuestions();
                }}
              >
                <Sparkles className="w-4 h-4" />
                {t("createInterview.generateQuestions")}
              </button>
              <button
                type="button"
                disabled={!baseFieldsFilled || isClicked}
                className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setIsClicked(true);
                  onManual();
                }}
              >
                {t("createInterview.doItMyself")}
              </button>
            </div>
          )}

          {docMode === "manual" && (
            <div className="pt-2">
              <button
                type="button"
                disabled={!(baseFieldsFilled && allManualQuestionsFilled) || isClicked}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setIsClicked(true);
                  onManualQuestions();
                }}
              >
                {t("createInterview.proceedWithQuestions")}
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={openInterviewerDetails}
        closeOnOutsideClick={true}
        onClose={() => setOpenInterviewerDetails(false)}
      >
        <InterviewerDetailsModal interviewer={interviewerDetails} />
      </Modal>
    </>
  );
}

export default DetailsPopup;

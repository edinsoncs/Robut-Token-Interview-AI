"use client";

import QuestionCard from "@/components/dashboard/interview/create-popup/questionCard";
import { useLanguage } from "@/contexts/language.context";
import { useInterviews } from "@/contexts/interviews.context";
import type { InterviewBase, Question } from "@/types/interview";
import { useClerk, useOrganization } from "@clerk/nextjs";
import axios from "axios";
import { Plus, ChevronLeft, Save, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  interviewData: InterviewBase;
  setProceed: (proceed: boolean) => void;
  setOpen: (open: boolean) => void;
}

function QuestionsPopup({ interviewData, setProceed, setOpen }: Props) {
  const { user } = useClerk();
  const { organization } = useOrganization();
  const { t } = useLanguage();
  const [isClicked, setIsClicked] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(interviewData.questions);
  const [description, setDescription] = useState<string>(interviewData.description.trim());
  const { fetchInterviews } = useInterviews();

  const endOfListRef = useRef<HTMLDivElement>(null);
  const prevQuestionLengthRef = useRef(questions.length);

  const handleInputChange = (id: string, newQuestion: Question) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, ...newQuestion } : question,
      ),
    );
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) {
      setQuestions(
        questions.map((question) => ({
          ...question,
          question: "",
          follow_up_count: 1,
        })),
      );
      return;
    }
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const handleAddQuestion = () => {
    if (questions.length < interviewData.question_count) {
      setQuestions([...questions, { id: uuidv4(), question: "", follow_up_count: 1 }]);
    }
  };

  const onSave = async () => {
    try {
      interviewData.user_id = user?.id || "";
      interviewData.organization_id = organization?.id || "";

      interviewData.questions = questions;
      interviewData.description = description;

      const sanitizedInterviewData = {
        ...interviewData,
        interviewer_id: interviewData.interviewer_id.toString(),
        response_count: interviewData.response_count.toString(),
        logo_url: organization?.imageUrl || "",
      };

      const response = await axios.post("/api/create-interview", {
        organizationName: organization?.name,
        interviewData: sanitizedInterviewData,
      });
      setIsClicked(false);
      fetchInterviews();
      setOpen(false);
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  useEffect(() => {
    if (questions.length > prevQuestionLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevQuestionLengthRef.current = questions.length;
  }, [questions.length]);

  return (
    <div className="w-[42rem] max-w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setProceed(false)}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t("questions.title")}</h1>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-secondary/30 rounded-xl">
        <p className="text-sm text-muted-foreground">
          {t("questions.reviewQuestions")}
        </p>
      </div>

      {/* Questions List */}
      <div className={`space-y-3 ${interviewData.question_count > 1 ? "max-h-72 overflow-y-auto pr-2" : ""}`}>
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            questionNumber={index + 1}
            questionData={question}
            onDelete={handleDeleteQuestion}
            onQuestionChange={handleInputChange}
          />
        ))}
        <div ref={endOfListRef} />
      </div>

      {/* Add Question Button */}
      {questions.length < interviewData.question_count && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add Question</span>
          </button>
        </div>
      )}

      {/* Description */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("questions.description")}
          <span className="text-xs text-muted-foreground font-normal ml-2">
            ({t("questions.descriptionNote")})
          </span>
        </label>
        <textarea
          value={description}
          className="input-modern h-24 resize-none"
          placeholder={t("questions.descriptionPlaceholder")}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => setDescription(e.target.value.trim())}
        />
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={
            isClicked ||
            questions.length < interviewData.question_count ||
            description.trim() === "" ||
            questions.some((question) => question.question.trim() === "")
          }
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            setIsClicked(true);
            onSave();
          }}
        >
          <Save className="w-4 h-4" />
          {t("questions.save")}
        </button>
      </div>
    </div>
  );
}

export default QuestionsPopup;

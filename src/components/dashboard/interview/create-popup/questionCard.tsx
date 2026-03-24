"use client";

import { useLanguage } from "@/contexts/language.context";
import type { Question } from "@/types/interview";
import { Trash2 } from "lucide-react";

interface QuestionCardProps {
  questionNumber: number;
  questionData: Question;
  onQuestionChange: (id: string, question: Question) => void;
  onDelete: (id: string) => void;
}

function QuestionCard({
  questionNumber,
  questionData,
  onQuestionChange,
  onDelete,
}: QuestionCardProps) {
  const { t } = useLanguage();
  
  const depthLevels = [
    { value: 1, label: "Low", description: "Brief follow-up" },
    { value: 2, label: "Medium", description: "Moderate follow-up" },
    { value: 3, label: "High", description: "In-depth follow-up" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 transition-all hover:border-primary/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary/10 text-primary text-sm font-semibold rounded-lg flex items-center justify-center">
            {questionNumber}
          </span>
          <span className="text-sm font-medium text-foreground">Question</span>
        </div>
        
        {/* Depth Level Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Depth:</span>
          {depthLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              title={level.description}
              onClick={() =>
                onQuestionChange(questionData.id, {
                  ...questionData,
                  follow_up_count: level.value,
                })
              }
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                questionData?.follow_up_count === level.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <textarea
          value={questionData?.question}
          className="flex-1 input-modern min-h-[80px] resize-none"
          placeholder="e.g. Can you tell me about a challenging project you've worked on?"
          rows={3}
          onChange={(e) =>
            onQuestionChange(questionData.id, {
              ...questionData,
              question: e.target.value,
            })
          }
          onBlur={(e) =>
            onQuestionChange(questionData.id, {
              ...questionData,
              question: e.target.value.trim(),
            })
          }
        />
        <button
          type="button"
          onClick={() => onDelete(questionData.id)}
          className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;

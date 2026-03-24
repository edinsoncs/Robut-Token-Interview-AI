"use client";

import DataTable, { type TableData } from "@/components/dashboard/interview/dataTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/language.context";
import { useInterviewers } from "@/contexts/interviewers.context";
import { CandidateStatus } from "@/lib/enum";
import { convertSecondstoMMSS } from "@/lib/utils";
import type { Interview } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import type { Response } from "@/types/response";
import { PieChart } from "@mui/x-charts/PieChart";
import { Info, SmileIcon, UserCircleIcon, Clock, TrendingUp, Share2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type SummaryProps = {
  responses: Response[];
  interview: Interview | undefined;
};

function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info
            className="w-3.5 h-3.5 text-primary inline-block ml-1 align-text-top"
            strokeWidth={2}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-foreground text-background font-normal max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SummaryInfo({ responses, interview }: SummaryProps) {
  const { interviewers } = useInterviewers();
  const { t } = useLanguage();
  const [interviewer, setInterviewer] = useState<Interviewer>();
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [completedInterviews, setCompletedInterviews] = useState<number>(0);
  const [sentimentCount, setSentimentCount] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [callCompletion, setCallCompletion] = useState({
    complete: 0,
    incomplete: 0,
    partial: 0,
  });

  const totalResponses = responses.length;

  const [candidateStatusCount, setCandidateStatusCount] = useState({
    [CandidateStatus.NO_STATUS]: 0,
    [CandidateStatus.NOT_SELECTED]: 0,
    [CandidateStatus.POTENTIAL]: 0,
    [CandidateStatus.SELECTED]: 0,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);

  const prepareTableData = (responses: Response[]): TableData[] => {
    return responses.map((response) => ({
      call_id: response.call_id,
      name: response.name || "Anonymous",
      overallScore: response.analytics?.overallScore || 0,
      communicationScore: response.analytics?.communication?.score || 0,
      callSummary:
        response.analytics?.softSkillSummary ||
        response.details?.call_analysis?.call_summary ||
        "No summary available",
    }));
  };

  useEffect(() => {
    if (!interviewers || !interview) {
      return;
    }
    const interviewer = interviewers.find(
      (interviewer) => interviewer.id === interview.interviewer_id,
    );
    setInterviewer(interviewer);
  }, [interviewers, interview]);

  useEffect(() => {
    if (!responses) {
      return;
    }

    const sentimentCounter = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    const callCompletionCounter = {
      complete: 0,
      incomplete: 0,
      partial: 0,
    };

    let totalDuration = 0;
    let completedCount = 0;

    const statusCounter = {
      [CandidateStatus.NO_STATUS]: 0,
      [CandidateStatus.NOT_SELECTED]: 0,
      [CandidateStatus.POTENTIAL]: 0,
      [CandidateStatus.SELECTED]: 0,
    };

    for (const response of responses) {
      const sentiment = response.details?.call_analysis?.user_sentiment;
      if (sentiment === "Positive") {
        sentimentCounter.positive += 1;
      } else if (sentiment === "Negative") {
        sentimentCounter.negative += 1;
      } else if (sentiment === "Neutral") {
        sentimentCounter.neutral += 1;
      }

      const callCompletion = response.details?.call_analysis?.call_completion_rating;
      if (callCompletion === "Complete") {
        callCompletionCounter.complete += 1;
      } else if (callCompletion === "Incomplete") {
        callCompletionCounter.incomplete += 1;
      } else if (callCompletion === "Partial") {
        callCompletionCounter.partial += 1;
      }

      const agentTaskCompletion = response.details?.call_analysis?.agent_task_completion_rating;
      if (agentTaskCompletion === "Complete" || agentTaskCompletion === "Partial") {
        completedCount += 1;
      }

      totalDuration += response.duration;
      if (Object.values(CandidateStatus).includes(response.candidate_status as CandidateStatus)) {
        statusCounter[response.candidate_status as CandidateStatus]++;
      }
    }

    setSentimentCount(sentimentCounter);
    setCallCompletion(callCompletionCounter);
    setTotalDuration(totalDuration);
    setCompletedInterviews(completedCount);
    setCandidateStatusCount(statusCounter);

    const preparedData = prepareTableData(responses);
    setTableData(preparedData);
  }, [responses]);

  if (responses.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6">
          <Share2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t("summary.waitingResponses")}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {t("summary.shareLink")}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("summary.interviewSummary")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {interview?.description}
          </p>
        </div>
        {interviewer && (
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl">
            <span className="text-xs text-muted-foreground">Interviewer:</span>
            <span className="text-sm font-medium text-foreground">{interviewer.name}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Average Duration
              <InfoTooltip content="Average time users took to complete an interview" />
            </span>
          </div>
          <p className="text-3xl font-bold text-primary">
            {convertSecondstoMMSS(totalDuration / responses.length)}
          </p>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Completion Rate
              <InfoTooltip content="Percentage of interviews completed successfully" />
            </span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {Math.round((completedInterviews / responses.length) * 10000) / 100}%
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary/30 rounded-2xl p-4 mb-6">
        <ScrollArea className="h-[200px]">
          <DataTable data={tableData} interviewId={interview?.id || ""} />
        </ScrollArea>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sentiment Chart */}
        <div className="bg-secondary/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <SmileIcon className="w-5 h-5 text-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Candidate Sentiment
              <InfoTooltip content="Distribution of user sentiments during interviews" />
            </span>
          </div>
          <PieChart
            sx={{
              "& .MuiChartsLegend-series text": {
                fontSize: "0.75rem !important",
                fill: "hsl(var(--foreground))",
              },
            }}
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: sentimentCount.positive,
                    label: `Positive (${sentimentCount.positive})`,
                    color: "#22c55e",
                  },
                  {
                    id: 1,
                    value: sentimentCount.neutral,
                    label: `Neutral (${sentimentCount.neutral})`,
                    color: "#eab308",
                  },
                  {
                    id: 2,
                    value: sentimentCount.negative,
                    label: `Negative (${sentimentCount.negative})`,
                    color: "#ef4444",
                  },
                ],
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 10,
                  additionalRadius: -10,
                  color: "gray",
                },
              },
            ]}
            width={320}
            height={120}
          />
        </div>

        {/* Status Chart */}
        <div className="bg-secondary/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Candidate Status
                <InfoTooltip content="Breakdown of the candidate selection status" />
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Total: {totalResponses}
            </span>
          </div>
          <PieChart
            sx={{
              "& .MuiChartsLegend-series text": {
                fontSize: "0.7rem !important",
                fill: "hsl(var(--foreground))",
              },
            }}
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: candidateStatusCount[CandidateStatus.SELECTED],
                    label: `Selected (${candidateStatusCount[CandidateStatus.SELECTED]})`,
                    color: "#22c55e",
                  },
                  {
                    id: 1,
                    value: candidateStatusCount[CandidateStatus.POTENTIAL],
                    label: `Potential (${candidateStatusCount[CandidateStatus.POTENTIAL]})`,
                    color: "#eab308",
                  },
                  {
                    id: 2,
                    value: candidateStatusCount[CandidateStatus.NOT_SELECTED],
                    label: `Not Selected (${candidateStatusCount[CandidateStatus.NOT_SELECTED]})`,
                    color: "#ef4444",
                  },
                  {
                    id: 3,
                    value: candidateStatusCount[CandidateStatus.NO_STATUS],
                    label: `No Status (${candidateStatusCount[CandidateStatus.NO_STATUS]})`,
                    color: "#9ca3af",
                  },
                ],
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 10,
                  additionalRadius: -10,
                  color: "gray",
                },
              },
            ]}
            width={320}
            height={120}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: 0,
                itemMarkWidth: 8,
                itemMarkHeight: 8,
                markGap: 4,
                itemGap: 4,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SummaryInfo;

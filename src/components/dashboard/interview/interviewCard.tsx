"use client";

import MiniLoader from "@/components/loaders/mini-loader/miniLoader";
import { useLanguage } from "@/contexts/language.context";
import { InterviewerService } from "@/services/interviewers.service";
import { ResponseService } from "@/services/responses.service";
import axios from "axios";
import { ArrowUpRight, Copy, CopyCheck, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string | null;
  interviewerId: bigint;
  id: string;
  url: string;
  readableSlug: string;
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewCard({ name, interviewerId, id, url, readableSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [img, setImg] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchInterviewer = async () => {
      const interviewer = await InterviewerService.getInterviewer(interviewerId);
      setImg(interviewer.image);
    };
    fetchInterviewer();
  }, [interviewerId]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responses = await ResponseService.getAllResponses(id);
        setResponseCount(responses.length);
        if (responses.length > 0) {
          setIsFetching(true);
          for (const response of responses) {
            if (!response.is_analysed) {
              try {
                const result = await axios.post("/api/get-call", {
                  id: response.call_id,
                });

                if (result.status !== 200) {
                  throw new Error(`HTTP error! status: ${result.status}`);
                }
              } catch (error) {
                console.error(
                  `Failed to call api/get-call for response id ${response.call_id}:`,
                  error,
                );
              }
            }
          }
          setIsFetching(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchResponses();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(readableSlug ? `${base_url}/call/${readableSlug}` : (url as string))
      .then(
        () => {
          setCopied(true);
          toast.success(t("interview.linkCopied"), {
            position: "bottom-right",
            duration: 3000,
          });
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        },
        (err) => {
          console.log("failed to copy", err.mesage);
        },
      );
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const interviewUrl = readableSlug ? `/call/${readableSlug}` : `/call/${url}`;
    window.open(interviewUrl, "_blank");
  };

  return (
    <a
      href={`/interviews/${id}`}
      style={{
        pointerEvents: isFetching ? "none" : "auto",
        cursor: isFetching ? "default" : "pointer",
      }}
      className="block group"
    >
      <div className={`relative h-64 bg-card/50 border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 ${isFetching ? "opacity-60" : ""}`}>
        {/* Header with gradient */}
        <div className="h-32 bg-gradient-to-br from-primary via-primary/90 to-accent/60 p-4 flex flex-col justify-between relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-accent rounded-full blur-3xl" />
          </div>
          
          {/* Title */}
          <div className="relative">
            <h3 className="text-lg font-semibold text-primary-foreground line-clamp-2 pr-20">
              {name}
            </h3>
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={handleJumpToInterview}
              className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg backdrop-blur-sm transition-colors border border-primary-foreground/10"
            >
              <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                copyToClipboard();
              }}
              className={`p-2 rounded-lg backdrop-blur-sm transition-colors border border-primary-foreground/10 ${
                copied ? "bg-primary-foreground/30" : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
              }`}
            >
              {copied ? (
                <CopyCheck className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Copy className="w-4 h-4 text-primary-foreground" />
              )}
            </button>
          </div>

          {/* Loading indicator */}
          {isFetching && (
            <div className="absolute bottom-3 right-3">
              <MiniLoader />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex items-center justify-between">
          {/* Interviewer avatar */}
          <div className="flex items-center gap-3">
            {img && (
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-border ring-2 ring-background">
                <Image
                  src={img}
                  alt="Interviewer"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">Interviewer</p>
              <p className="text-xs text-muted-foreground">AI Agent</p>
            </div>
          </div>

          {/* Response count */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 border border-border/50 rounded-full">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {responseCount ?? 0}
            </span>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </a>
  );
}

export default InterviewCard;

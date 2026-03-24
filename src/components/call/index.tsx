"use client";

import { FeedbackForm } from "@/components/call/feedbackForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useResponses } from "@/contexts/responses.context";
import { getTranslations, type Translations } from "@/lib/translations";
import { isLightColor, testEmail } from "@/lib/utils";
import { FeedbackService } from "@/services/feedback.service";
import { InterviewerService } from "@/services/interviewers.service";
import { ResponseService } from "@/services/responses.service";
import type { Interview } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import type { FeedbackData } from "@/types/response";
import axios from "axios";
import { AlarmClockIcon, Bot, CheckCircleIcon, Mic, XCircleIcon } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { toast } from "sonner";
import MiniLoader from "../loaders/mini-loader/miniLoader";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { TabSwitchWarning, useTabSwitchPrevention } from "./tabSwitchPrevention";

const webClient = new RetellWebClient();

type InterviewProps = {
  interview: Interview;
};

type registerCallResponseType = {
  data: {
    registerCallResponse: {
      call_id: string;
      access_token: string;
    };
  };
};

type transcriptType = {
  role: string;
  content: string;
};

function Call({ interview }: InterviewProps) {
  const { createResponse } = useResponses();
  const [lastInterviewerResponse, setLastInterviewerResponse] = useState<string>("");
  const [lastUserResponse, setLastUserResponse] = useState<string>("");
  const [activeTurn, setActiveTurn] = useState<string>("");
  const [Loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isOldUser, setIsOldUser] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>("");
  const { tabSwitchCount } = useTabSwitchPrevention();
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interviewerImg, setInterviewerImg] = useState("");
  const [interviewTimeDuration, setInterviewTimeDuration] = useState<string>("1");
  const [time, setTime] = useState(0);
  const [currentTimeDuration, setCurrentTimeDuration] = useState<string>("0");
  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [t, setT] = useState<Translations>(getTranslations("es"));

  const lastUserResponseRef = useRef<HTMLDivElement | null>(null);

  // Fetch interviewer and set language-based translations
  useEffect(() => {
    const fetchInterviewer = async () => {
      const interviewerData = await InterviewerService.getInterviewer(interview.interviewer_id);
      if (interviewerData) {
        setInterviewer(interviewerData);
        setInterviewerImg(interviewerData.image);
        // Set translations based on interviewer language
        const lang = interviewerData.language || "es";
        setT(getTranslations(lang));
      }
    };
    fetchInterviewer();
  }, [interview.interviewer_id]);

  const handleFeedbackSubmit = async (formData: Omit<FeedbackData, "interview_id">) => {
    try {
      const result = await FeedbackService.submitFeedback({
        ...formData,
        interview_id: interview.id,
      });

      if (result) {
        toast.success(t.feedbackSuccess);
        setIsFeedbackSubmitted(true);
        setIsDialogOpen(false);
      } else {
        toast.error(t.feedbackError);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(t.feedbackErrorGeneric);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (lastUserResponseRef.current) {
      const { current } = lastUserResponseRef;
      current.scrollTop = current.scrollHeight;
    }
  }, [lastUserResponse]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let intervalId: any;
    if (isCalling) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    setCurrentTimeDuration(String(Math.floor(time / 100)));
    if (Number(currentTimeDuration) === Number(interviewTimeDuration) * 60) {
      webClient.stopCall();
      setIsEnded(true);
    }

    return () => clearInterval(intervalId);
  }, [isCalling, time, currentTimeDuration]);

  useEffect(() => {
    if (testEmail(email)) {
      setIsValidEmail(true);
    }
  }, [email]);

  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started");
      setIsCalling(true);
    });

    webClient.on("call_ended", () => {
      console.log("Call ended");
      setIsCalling(false);
      setIsEnded(true);
    });

    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent");
    });

    webClient.on("agent_stop_talking", () => {
      setActiveTurn("user");
    });

    webClient.on("error", (error) => {
      console.error("An error occurred:", error);
      webClient.stopCall();
      setIsEnded(true);
      setIsCalling(false);
    });

    webClient.on("update", (update) => {
      if (update.transcript) {
        const transcripts: transcriptType[] = update.transcript;
        const roleContents: { [key: string]: string } = {};

        for (const transcript of transcripts) {
          roleContents[transcript?.role] = transcript?.content;
        }

        setLastInterviewerResponse(roleContents.agent);
        setLastUserResponse(roleContents.user);
      }
    });

    return () => {
      webClient.removeAllListeners();
    };
  }, []);

  const onEndCallClick = async () => {
    if (isStarted) {
      setLoading(true);
      webClient.stopCall();
      setIsEnded(true);
      setLoading(false);
    } else {
      setIsEnded(true);
    }
  };

  const startConversation = async () => {
    const data = {
      mins: interview?.time_duration,
      objective: interview?.objective,
      questions: interview?.questions.map((q) => q.question).join(", "),
      name: name || "not provided",
    };
    setLoading(true);

    const oldUserEmails: string[] = (await ResponseService.getAllEmails(interview.id)).map(
      (item) => item.email,
    );
    const OldUser =
      oldUserEmails.includes(email) ||
      (interview?.respondents && !interview?.respondents.includes(email));

    if (OldUser) {
      setIsOldUser(true);
    } else {
      const registerCallResponse: registerCallResponseType = await axios.post(
        "/api/register-call",
        { dynamic_data: data, interviewer_id: interview?.interviewer_id },
      );
      if (registerCallResponse.data.registerCallResponse.access_token) {
        await webClient
          .startCall({
            accessToken: registerCallResponse.data.registerCallResponse.access_token,
          })
          .catch(console.error);
        setIsCalling(true);
        setIsStarted(true);

        setCallId(registerCallResponse?.data?.registerCallResponse?.call_id);

        const response = await createResponse({
          interview_id: interview.id,
          call_id: registerCallResponse.data.registerCallResponse.call_id,
          email: email,
          name: name,
        });
      } else {
        console.log("Failed to register call");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (interview?.time_duration) {
      setInterviewTimeDuration(interview?.time_duration);
    }
  }, [interview]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isEnded) {
      const updateInterview = async () => {
        await ResponseService.saveResponse(
          { is_ended: true, tab_switch_count: tabSwitchCount },
          callId,
        );
      };

      updateInterview();
    }
  }, [isEnded]);

  const themeColor = interview.theme_color ?? "#3B82F6";

  return (
    <div className="flex justify-center items-center min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 px-0 sm:px-4">
      {isStarted && <TabSwitchWarning />}
      
      <div className="bg-white sm:rounded-2xl shadow-xl w-full sm:w-[95%] md:w-[90%] lg:w-[80%] max-w-4xl min-h-[100dvh] sm:min-h-0">
        <Card className="min-h-[100dvh] sm:min-h-[85vh] rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 text-xl font-bold transition-all overflow-hidden flex flex-col">
          
          {/* Progress Bar */}
          <div className="px-3 pt-3 sm:px-4 sm:pt-4">
            <div className="h-2 sm:h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: themeColor,
                  width: isEnded
                    ? "100%"
                    : `${(Number(currentTimeDuration) / (Number(interviewTimeDuration) * 60)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Header */}
          <CardHeader className="items-center px-3 py-2 sm:p-4">
            {!isEnded && (
              <CardTitle className="flex flex-row items-center text-base sm:text-lg md:text-xl font-bold text-gray-800 text-center">
                {interview?.name}
              </CardTitle>
            )}
            {!isEnded && (
              <div className="flex flex-row items-center mt-1 sm:mt-2">
                <AlarmClockIcon
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                  style={{ color: themeColor }}
                />
                <span className="text-xs sm:text-sm font-normal text-gray-600">
                  {t.estimatedDuration}{" "}
                  <span className="font-semibold" style={{ color: themeColor }}>
                    {interviewTimeDuration} {t.mins}
                  </span>{" "}
                  {t.orLess}
                </span>
              </div>
            )}
          </CardHeader>

          {/* Pre-call Form */}
          {!isStarted && !isEnded && !isOldUser && (
            <div className="flex-1 flex items-center justify-center px-3 pb-3 sm:px-4 sm:pb-4">
              <div className="w-full max-w-md border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
                {interview?.logo_url && (
                  <div className="flex justify-center mb-4">
                    <Image
                      src={interview?.logo_url}
                      alt="Logo"
                      className="h-10 sm:h-12 w-auto object-contain"
                      width={100}
                      height={100}
                    />
                  </div>
                )}
                
                <div className="text-sm font-normal text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                  {interview?.description}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4 mb-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm text-gray-700">
                      <p className="font-medium text-gray-800 mb-1">{t.volumeWarning}</p>
                      <p className="text-gray-500 text-xs">{t.tabSwitchNote}</p>
                    </div>
                  </div>
                </div>

                {!interview?.is_anonymous && (
                  <div className="flex flex-col gap-3 mb-4">
                    <input
                      value={email}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                      placeholder={t.enterEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                    />
                    <input
                      value={name}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                      placeholder={t.enterName}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 h-12 sm:h-11 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl text-sm sm:text-base order-1 sm:order-1"
                    style={{
                      backgroundColor: themeColor,
                      color: isLightColor(themeColor) ? "black" : "white",
                    }}
                    disabled={Loading || (!interview?.is_anonymous && (!isValidEmail || !name))}
                    onClick={startConversation}
                  >
                    {!Loading ? t.startInterview : <MiniLoader />}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="h-11 sm:h-11 px-6 rounded-xl bg-white border-2 text-gray-700 hover:bg-gray-50 transition-all text-sm order-2 sm:order-2"
                        style={{ borderColor: themeColor }}
                        disabled={Loading}
                      >
                        {t.exit}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl mx-4 sm:mx-0">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-xl"
                          style={{ backgroundColor: themeColor }}
                          onClick={async () => {
                            await onEndCallClick();
                          }}
                        >
                          {t.continue}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}

          {/* Active Call View */}
          {isStarted && !isEnded && !isOldUser && (
            <div className="flex-1 flex flex-col px-3 pb-3 sm:px-4 sm:pb-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4">
                
                {/* Interviewer Section */}
                <div className="flex-1 flex flex-col border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-0.5 rounded-full ${activeTurn === "agent" ? "ring-3 ring-blue-500/50" : ""} transition-all`}>
                      <Image
                        src={interviewerImg || "/user-icon.png"}
                        alt="Interviewer"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-9 h-9 sm:w-10 sm:h-10"
                      />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{t.interviewer}</span>
                    {activeTurn === "agent" && (
                      <div className="flex gap-1 ml-auto">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse delay-75" />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-sm sm:text-base font-normal text-gray-700 leading-relaxed overflow-y-auto max-h-28 sm:max-h-40 md:max-h-52">
                    {lastInterviewerResponse}
                  </div>
                </div>

                {/* User Section */}
                <div className="flex-1 flex flex-col border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-0.5 rounded-full ${activeTurn === "user" ? "ring-3 ring-green-500/50" : ""} transition-all`}>
                      <Image
                        src="/user-icon.png"
                        alt="You"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-9 h-9 sm:w-10 sm:h-10"
                      />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{t.you}</span>
                    {activeTurn === "user" && (
                      <div className="flex gap-1 ml-auto">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse delay-75" />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                  <div
                    ref={lastUserResponseRef}
                    className="flex-1 text-sm sm:text-base font-normal text-gray-700 leading-relaxed overflow-y-auto max-h-28 sm:max-h-40 md:max-h-52"
                  >
                    {lastUserResponse}
                  </div>
                </div>
              </div>

              {/* End Call Button */}
              <div className="mt-3 sm:mt-4">
                <AlertDialog>
                  <AlertDialogTrigger className="w-full">
                    <Button
                      className="w-full h-11 sm:h-12 bg-white text-gray-700 border-2 border-red-400 hover:bg-red-50 rounded-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                      disabled={Loading}
                    >
                      {t.endInterview}
                      <XCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl mx-4 sm:mx-0">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.endInterviewDescription}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 rounded-xl"
                        onClick={async () => {
                          await onEndCallClick();
                        }}
                      >
                        {t.continue}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* End Screen */}
          {isEnded && !isOldUser && (
            <div className="flex-1 flex items-center justify-center px-3 pb-3 sm:px-4 sm:pb-4">
              <div className="w-full max-w-md border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white shadow-lg">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
                </div>
                <p className="text-lg sm:text-xl font-semibold text-center text-gray-800">
                  {isStarted ? t.thanksForParticipating : t.thanksForConsidering}
                </p>
                <p className="text-center text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base">
                  {t.closeTabNow}
                </p>

                {!isFeedbackSubmitted && (
                  <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger className="w-full flex justify-center mt-4">
                      <Button
                        className="h-11 sm:h-12 rounded-xl font-semibold px-8 transition-all text-white"
                        style={{ backgroundColor: themeColor }}
                        onClick={() => setIsDialogOpen(true)}
                      >
                        {t.leaveFeedback}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl mx-4 sm:mx-0">
                      <FeedbackForm email={email} onSubmit={handleFeedbackSubmit} />
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          )}

          {/* Already Responded Screen */}
          {isOldUser && (
            <div className="flex-1 flex items-center justify-center px-3 pb-3 sm:px-4 sm:pb-4">
              <div className="w-full max-w-md border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white shadow-lg">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-center text-gray-800">
                  {t.alreadyResponded}
                </p>
                <p className="text-center text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base">
                  {t.closeTabNow}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-white sm:bg-transparent">
          <span className="text-xs sm:text-sm text-gray-500">{t.poweredBy}</span>
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-blue-500 rounded-lg">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm sm:text-base">Robut</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Call;

"use client";

import Call from "@/components/call";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { useInterviews } from "@/contexts/interviews.context";
import { getTranslations, type Translations } from "@/lib/translations";
import { InterviewerService } from "@/services/interviewers.service";
import type { Interview } from "@/types/interview";

import { Bot } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{
    interviewId: string;
  }>;
};

type PopupProps = {
  title: string;
  description: string;
  image: string;
};

function PoweredByRobut() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 sm:py-4">
      <span className="text-xs sm:text-sm text-gray-500">Powered by</span>
      <div className="flex items-center gap-1.5">
        <div className="p-1 bg-blue-500 rounded-lg">
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
        <span className="font-bold text-gray-800 text-sm sm:text-base">Robut</span>
      </div>
    </div>
  );
}

function PopupLoader() {
  return (
    <div className="bg-white sm:rounded-2xl shadow-xl fixed inset-0 sm:inset-4 md:inset-auto md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:left-1/2 md:w-[90%] md:max-w-lg flex flex-col">
      <div className="flex-1 flex justify-center items-center sm:rounded-2xl border-0 sm:border border-gray-200">
        <div className="relative flex flex-col items-center justify-center">
          <LoaderWithText />
        </div>
      </div>
      <PoweredByRobut />
    </div>
  );
}

function PopUpMessage({ title, description, image }: PopupProps) {
  return (
    <div className="bg-white sm:rounded-2xl shadow-xl fixed inset-0 sm:inset-4 md:inset-auto md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:left-1/2 md:w-[90%] md:max-w-lg flex flex-col">
      <div className="flex-1 flex items-center justify-center sm:rounded-2xl border-0 sm:border border-gray-200">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8">
          <Image 
            src={image} 
            alt="Graphic" 
            width={150} 
            height={150} 
            className="mb-4 sm:mb-6 w-28 h-28 sm:w-36 sm:h-36 md:w-[180px] md:h-[180px]" 
          />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 text-center px-4">
            {title}
          </h1>
          <p className="text-gray-600 text-center max-w-sm text-sm sm:text-base px-4">
            {description}
          </p>
        </div>
      </div>
      <PoweredByRobut />
    </div>
  );
}

function InterviewInterface({ params }: Props) {
  const resolvedParams = use(params);
  const [interview, setInterview] = useState<Interview>();
  const [isActive, setIsActive] = useState(true);
  const { getInterviewById } = useInterviews();
  const [interviewNotFound, setInterviewNotFound] = useState(false);
  const [t, setT] = useState<Translations>(getTranslations("es"));

  useEffect(() => {
    if (interview) {
      setIsActive(interview?.is_active === true);
    }
  }, [interview]);

  useEffect(() => {
    const fetchinterview = async () => {
      try {
        const response = await getInterviewById(resolvedParams.interviewId);
        if (response) {
          setInterview(response);
          document.title = response.name;
          
          // Fetch interviewer to get language
          const interviewer = await InterviewerService.getInterviewer(response.interviewer_id);
          if (interviewer?.language) {
            setT(getTranslations(interviewer.language));
          }
        } else {
          setInterviewNotFound(true);
        }
      } catch (error) {
        console.error(error);
        setInterviewNotFound(true);
      }
    };

    fetchinterview();
  }, [getInterviewById, resolvedParams.interviewId]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="sm:p-4 md:p-8 mx-auto form-container">
        {!interview ? (
          interviewNotFound ? (
            <PopUpMessage
              title={t.invalidLink}
              description={t.invalidLinkDescription}
              image="/invalid-url.png"
            />
          ) : (
            <PopupLoader />
          )
        ) : !isActive ? (
          <PopUpMessage
            title={t.interviewNotAvailable}
            description={t.notAcceptingResponses}
            image="/closed.png"
          />
        ) : (
          <Call interview={interview} />
        )}
      </div>
    </div>
  );
}

export default InterviewInterface;

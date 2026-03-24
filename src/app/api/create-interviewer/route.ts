import { RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";
import { LANGUAGES, getLanguageByCode } from "@/lib/languages";
import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { type NextRequest, NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

// Interviewer templates per language
const INTERVIEWER_TEMPLATES = {
  en: {
    LISA: {
      name: "Explorer Lisa",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "Hi! I'm Lisa, an enthusiastic and empathetic interviewer who loves to explore. With a perfect balance of empathy and rapport, I delve deep into conversations while maintaining a steady pace. Let's embark on this journey together and uncover meaningful insights!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Empathetic Bob",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "Hi! I'm Bob, your go-to empathetic interviewer. I excel at understanding and connecting with people on a deeper level, ensuring every conversation is insightful and meaningful. With a focus on empathy, I'm here to listen and learn from you. Let's create a genuine connection!",
      audio: "Bob.wav",
    },
  },
  es: {
    LISA: {
      name: "Exploradora María",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "¡Hola! Soy María, una entrevistadora entusiasta y empática que ama explorar. Con un equilibrio perfecto de empatía y conexión, profundizo en las conversaciones manteniendo un ritmo constante. ¡Embarquémonos juntos en este viaje y descubramos ideas significativas!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Empático Carlos",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "¡Hola! Soy Carlos, tu entrevistador empático. Me destaco en comprender y conectar con las personas en un nivel más profundo, asegurando que cada conversación sea perspicaz y significativa. ¡Creemos una conexión genuina!",
      audio: "Bob.wav",
    },
  },
  fr: {
    LISA: {
      name: "Exploratrice Sophie",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "Bonjour! Je suis Sophie, une intervieweuse enthousiaste et empathique qui adore explorer. Avec un équilibre parfait d'empathie et de rapport, j'approfondis les conversations tout en maintenant un rythme régulier. Embarquons ensemble dans ce voyage!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Empathique Pierre",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "Bonjour! Je suis Pierre, votre intervieweur empathique. J'excelle à comprendre et à me connecter avec les gens à un niveau plus profond. Créons une connexion authentique!",
      audio: "Bob.wav",
    },
  },
  de: {
    LISA: {
      name: "Entdeckerin Anna",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "Hallo! Ich bin Anna, eine begeisterte und einfühlsame Interviewerin, die es liebt zu erkunden. Mit einer perfekten Balance aus Empathie und Rapport gehe ich tief in Gespräche ein. Lassen Sie uns gemeinsam bedeutungsvolle Erkenntnisse entdecken!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Einfühlsamer Hans",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "Hallo! Ich bin Hans, Ihr einfühlsamer Interviewer. Ich bin hier, um zuzuhören und von Ihnen zu lernen. Lassen Sie uns eine echte Verbindung schaffen!",
      audio: "Bob.wav",
    },
  },
  pt: {
    LISA: {
      name: "Exploradora Ana",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "Olá! Sou Ana, uma entrevistadora entusiasmada e empática que adora explorar. Com um equilíbrio perfeito de empatia e conexão, mergulho em conversas profundas. Vamos descobrir insights significativos juntos!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Empático João",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "Olá! Sou João, seu entrevistador empático. Me destaco em compreender e conectar com as pessoas em um nível mais profundo. Vamos criar uma conexão genuína!",
      audio: "Bob.wav",
    },
  },
  it: {
    LISA: {
      name: "Esploratrice Giulia",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "Ciao! Sono Giulia, un'intervistatrice entusiasta ed empatica che ama esplorare. Con un perfetto equilibrio di empatia e rapporto, approfondisco le conversazioni. Scopriamo insieme intuizioni significative!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Empatico Marco",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "Ciao! Sono Marco, il tuo intervistatore empatico. Eccello nel comprendere e connettermi con le persone. Creiamo una connessione autentica!",
      audio: "Bob.wav",
    },
  },
  zh: {
    LISA: {
      name: "探索者小丽",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "你好！我是小丽，一个热情而有同理心的面试官，喜欢探索。凭借同理心和亲和力的完美平衡，我深入对话。让我们一起发现有意义的见解！",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "共情者小明",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "你好！我是小明，你的共情面试官。我擅长在更深层次上理解和联系人们。让我们建立真诚的联系！",
      audio: "Bob.wav",
    },
  },
  ja: {
    LISA: {
      name: "探検家リサ",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "こんにちは！私はリサです。探求心旺盛で共感力のあるインタビュアーです。共感とラポールの完璧なバランスで、会話を深めていきます。一緒に意味のある洞察を発見しましょう！",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "共感的ボブ",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "こんにちは！私はボブです。共感力のあるインタビュアーとして、人々とより深いレベルで理解し、つながることに優れています。本物のつながりを作りましょう！",
      audio: "Bob.wav",
    },
  },
  ru: {
    LISA: {
      name: "Исследователь Анна",
      rapport: 7,
      exploration: 10,
      empathy: 7,
      speed: 5,
      image: "/interviewers/Lisa.png",
      description:
        "Привет! Я Анна, увлечённый и эмпатичный интервьюер, который любит исследовать. С идеальным балансом эмпатии и взаимопонимания я углубляюсь в беседы. Давайте вместе откроем значимые идеи!",
      audio: "Lisa.wav",
    },
    BOB: {
      name: "Эмпатичный Иван",
      rapport: 7,
      exploration: 7,
      empathy: 10,
      speed: 5,
      image: "/interviewers/Bob.png",
      description:
        "Привет! Я Иван, ваш эмпатичный интервьюер. Я превосхожу в понимании и установлении связи с людьми на более глубоком уровне. Давайте создадим настоящую связь!",
      audio: "Bob.wav",
    },
  },
};

// Voice IDs per language
// ElevenLabs voices support multiple languages when language is set on the agent
// Using multilingual-capable voices for all non-English languages
const VOICE_IDS: Record<string, { female: string; male: string }> = {
  en: { female: "11labs-Chloe", male: "11labs-Brian" },
  es: { female: "11labs-Chloe", male: "11labs-Brian" },
  fr: { female: "11labs-Chloe", male: "11labs-Brian" },
  de: { female: "11labs-Chloe", male: "11labs-Brian" },
  pt: { female: "11labs-Chloe", male: "11labs-Brian" },
  it: { female: "11labs-Chloe", male: "11labs-Brian" },
  zh: { female: "11labs-Chloe", male: "11labs-Brian" },
  ja: { female: "11labs-Chloe", male: "11labs-Brian" },
  ru: { female: "11labs-Chloe", male: "11labs-Brian" },
};

export async function POST(req: NextRequest) {
  logger.info("create-interviewer request received");

  try {
    const body = await req.json();
    const languageCode = body.language || "en";
    
    const language = getLanguageByCode(languageCode);
    if (!language) {
      logger.error(`Invalid language code: ${languageCode}`);
      return NextResponse.json({ error: "Invalid language code" }, { status: 400 });
    }

    // Use apiCode for Retell API (e.g., "es-ES" instead of "es")
    // Cast to the Retell API expected type
    const apiLanguageCode = language.apiCode as "en-US" | "es-ES" | "fr-FR" | "de-DE" | "pt-BR" | "it-IT" | "zh-CN" | "ja-JP" | "ru-RU";
    logger.info(`[v0] Language mapping: ${languageCode} -> ${apiLanguageCode}`);

    const templates = INTERVIEWER_TEMPLATES[languageCode as keyof typeof INTERVIEWER_TEMPLATES] || INTERVIEWER_TEMPLATES.en;
    const voices = VOICE_IDS[languageCode] || VOICE_IDS.en;

    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });

    // Create first interviewer (Lisa equivalent)
    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: voices.female,
      agent_name: templates.LISA.name,
      language: apiLanguageCode,
    });

    const newInterviewer = await InterviewerService.createInterviewer({
      agent_id: newFirstAgent.agent_id,
      language: languageCode,
      ...templates.LISA,
    });

    // Create second interviewer (Bob equivalent)
    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: voices.male,
      agent_name: templates.BOB.name,
      language: apiLanguageCode,
    });

    const newSecondInterviewer = await InterviewerService.createInterviewer({
      agent_id: newSecondAgent.agent_id,
      language: languageCode,
      ...templates.BOB,
    });

    logger.info(`Created interviewers for language: ${languageCode} (API: ${apiLanguageCode})`);

    return NextResponse.json(
      {
        newInterviewer,
        newSecondInterviewer,
        language: languageCode,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error creating interviewers:", errorMessage);

    return NextResponse.json({ error: "Failed to create interviewers", details: errorMessage }, { status: 500 });
  }
}

// Keep GET for backwards compatibility
export async function GET(req: NextRequest) {
  logger.info("create-interviewer GET request received (legacy)");

  try {
    const templates = INTERVIEWER_TEMPLATES.en;
    const voices = VOICE_IDS.en;

    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });

    // Create Lisa
    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: voices.female,
      agent_name: templates.LISA.name,
    });

    const newInterviewer = await InterviewerService.createInterviewer({
      agent_id: newFirstAgent.agent_id,
      language: "en",
      ...templates.LISA,
    });

    // Create Bob
    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: voices.male,
      agent_name: templates.BOB.name,
    });

    const newSecondInterviewer = await InterviewerService.createInterviewer({
      agent_id: newSecondAgent.agent_id,
      language: "en",
      ...templates.BOB,
    });

    logger.info("Created default English interviewers");

    return NextResponse.json(
      {
        newInterviewer,
        newSecondInterviewer,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error creating interviewers:");

    return NextResponse.json({ error: "Failed to create interviewers" }, { status: 500 });
  }
}

import type { Language } from "@/types/interviewer";

export const LANGUAGES: Language[] = [
  {
    code: "en",
    apiCode: "en-US",
    name: "English",
    flag: "🇺🇸",
    voiceId: "11labs-Chloe",
    voiceName: "Chloe",
  },
  {
    code: "es",
    apiCode: "es-ES",
    name: "Español",
    flag: "🇪🇸",
    voiceId: "11labs-Chloe",
    voiceName: "Chloe",
  },
  {
    code: "fr",
    apiCode: "fr-FR",
    name: "Français",
    flag: "🇫🇷",
    voiceId: "11labs-Charlotte",
    voiceName: "Charlotte",
  },
  {
    code: "de",
    apiCode: "de-DE",
    name: "Deutsch",
    flag: "🇩🇪",
    voiceId: "11labs-Klaus",
    voiceName: "Klaus",
  },
  {
    code: "pt",
    apiCode: "pt-BR",
    name: "Português",
    flag: "🇧🇷",
    voiceId: "11labs-Clara",
    voiceName: "Clara",
  },
  {
    code: "it",
    apiCode: "it-IT",
    name: "Italiano",
    flag: "🇮🇹",
    voiceId: "11labs-Marco",
    voiceName: "Marco",
  },
  {
    code: "zh",
    apiCode: "zh-CN",
    name: "中文",
    flag: "🇨🇳",
    voiceId: "11labs-Wei",
    voiceName: "Wei",
  },
  {
    code: "ja",
    apiCode: "ja-JP",
    name: "日本語",
    flag: "🇯🇵",
    voiceId: "11labs-Yuki",
    voiceName: "Yuki",
  },
  {
    code: "ru",
    apiCode: "ru-RU",
    name: "Русский",
    flag: "🇷🇺",
    voiceId: "11labs-Chloe",
    voiceName: "Chloe",
  },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find((lang) => lang.code === code);
};

export const getLanguageFlag = (code: string): string => {
  const language = getLanguageByCode(code);
  return language?.flag || "🌐";
};

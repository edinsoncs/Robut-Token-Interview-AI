export interface Interviewer {
  id: bigint;
  user_id: string;
  created_at: Date;
  name: string;
  rapport: number;
  exploration: number;
  empathy: number;
  speed: number;
  image: string;
  description: string;
  audio: string;
  agent_id: string;
  language: string;
}

export interface Language {
  code: string;
  apiCode: string;
  name: string;
  flag: string;
  voiceId: string;
  voiceName: string;
}

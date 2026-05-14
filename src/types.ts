export interface Master {
  id: string;
  name: string;
  title: string;
  bio: string;
  philosophies: string[];
  avatar: string;
  themeColor: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface MatchResult {
  masterName: string;
  reason: string;
}

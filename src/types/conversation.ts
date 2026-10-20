import type { ChatMessage, Sender } from "./chat";

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  draft: string;
  sender: Sender;
  createdAt: number;
};

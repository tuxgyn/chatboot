export type Sender = "user" | "robot";

export type ChatMessage = {
  id: string;
  text: string;
  sender: Sender;
  createdAt: number;
};

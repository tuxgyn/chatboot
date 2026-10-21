import type { ChatMessage, Sender } from "./chat";

export const DEFAULT_CONVERSATION_TITLE = "Nova conversa";
export const EMPTY_CONVERSATION_PREVIEW = "Sem mensagens";
export const WELCOME_MESSAGE = "Olá! Como posso ajudar?";

const TITLE_MAX_CHARS = 28;

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  draft: string;
  sender: Sender;
  createdAt: number;
};

export function titleFromFirstMessage(text: string): string {
  const singleLine = toSingleLine(text);
  if (singleLine.length <= TITLE_MAX_CHARS) return singleLine;
  return `${singleLine.slice(0, TITLE_MAX_CHARS)}…`;
}

export function previewFromMessages(messages: ChatMessage[]): string {
  const lastMessage = messages.at(-1);
  if (!lastMessage) return EMPTY_CONVERSATION_PREVIEW;
  return toSingleLine(lastMessage.text);
}

function toSingleLine(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

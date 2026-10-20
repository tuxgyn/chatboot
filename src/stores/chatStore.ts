import { create } from "zustand";
import type { ChatMessage, Sender } from "../types/chat";
import type { Conversation } from "../types/conversation";

const TITLE_MAX_CHARS = 28;

export type ChatStore = {
  conversations: Conversation[];
  activeConversationId: string | null;
  createConversation: () => string;
  selectConversation: (id: string) => void;
  setDraft: (draft: string) => void;
  toggleSender: () => void;
  sendMessage: (text: string, sender: Sender) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,

  createConversation() {
    const id = crypto.randomUUID();
    const conversation: Conversation = {
      id,
      title: "Nova conversa",
      messages: [],
      draft: "",
      sender: "user",
      createdAt: Date.now(),
    };

    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: id,
    }));

    return id;
  },

  selectConversation(id) {
    const exists = get().conversations.some((conversation) => conversation.id === id);
    if (!exists) return;
    set({ activeConversationId: id });
  },

  setDraft(draft) {
    const activeId = get().activeConversationId;
    if (!activeId) return;

    set((state) => ({
      conversations: mapActive(state.conversations, activeId, (conversation) => ({
        ...conversation,
        draft,
      })),
    }));
  },

  toggleSender() {
    const activeId = get().activeConversationId;
    if (!activeId) return;

    set((state) => ({
      conversations: mapActive(state.conversations, activeId, (conversation) => ({
        ...conversation,
        sender: conversation.sender === "user" ? "robot" : "user",
      })),
    }));
  },

  sendMessage(text, sender) {
    const activeId = get().activeConversationId;
    if (!activeId) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender,
      createdAt: Date.now(),
    };

    set((state) => ({
      conversations: mapActive(state.conversations, activeId, (conversation) => {
        const messages = [...conversation.messages, message];
        return {
          ...conversation,
          messages,
          draft: "",
          title: messages.length === 1 ? titleFromFirstMessage(trimmed) : conversation.title,
        };
      }),
    }));
  },
}));

export function selectActiveConversation(state: ChatStore): Conversation | null {
  return state.conversations.find((conversation) => conversation.id === state.activeConversationId) ?? null;
}

function mapActive(
  conversations: Conversation[],
  activeId: string,
  update: (conversation: Conversation) => Conversation,
): Conversation[] {
  return conversations.map((conversation) =>
    conversation.id === activeId ? update(conversation) : conversation,
  );
}

function titleFromFirstMessage(text: string): string {
  if (text.length <= TITLE_MAX_CHARS) return text;
  return `${text.slice(0, TITLE_MAX_CHARS)}…`;
}

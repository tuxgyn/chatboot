import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Sender } from "../types/chat";
import { WELCOME_MESSAGE, titleFromFirstMessage, type Conversation } from "../types/conversation";

const STORAGE_KEY = "multichat-history";

export type ChatStore = {
  conversations: Conversation[];
  activeConversationId: string | null;
  createConversation: () => string;
  selectConversation: (id: string) => void;
  removeConversation: (id: string) => void;
  setDraft: (draft: string) => void;
  toggleSender: () => void;
  sendMessage: (text: string, sender: Sender) => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation() {
        const id = crypto.randomUUID();
        const welcome: ChatMessage = {
          id: crypto.randomUUID(),
          text: WELCOME_MESSAGE,
          sender: "robot",
          createdAt: Date.now(),
        };
        const conversation: Conversation = {
          id,
          title: titleFromFirstMessage(welcome.text),
          messages: [welcome],
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

      removeConversation(id) {
        const { conversations, activeConversationId } = get();
        const remaining = conversations.filter((conversation) => conversation.id !== id);
        if (remaining.length === conversations.length) return;

        set({
          conversations: remaining,
          activeConversationId:
            activeConversationId === id ? (remaining[0]?.id ?? null) : activeConversationId,
        });
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
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    },
  ),
);

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

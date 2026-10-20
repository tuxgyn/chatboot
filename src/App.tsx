import { useState } from "react";
import { ChatLayout } from "./components/ChatLayout";
import { Composer } from "./components/Composer";
import { EmptyChat } from "./components/EmptyChat";
import { MessageList } from "./components/MessageList";
import { MultiChatLayout } from "./components/MultiChatLayout";
import { useChatStore } from "./stores/chatStore";
import type { ChatMessage, Sender } from "./types/chat";

export default function App() {
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sender, setSender] = useState<Sender>("user");

  function onToggleSender() {
    setSender((current) => (current === "user" ? "robot" : "user"));
  }

  function onSend(text: string, currentSender: Sender) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: currentSender,
      createdAt: Date.now(),
    };

    setMessages((current) => [...current, message]);
    setDraft("");
  }

  const hasActiveConversation = activeConversationId != null;

  return (
    <MultiChatLayout
      list={null}
      chat={
        <ChatLayout
          history={hasActiveConversation ? <MessageList messages={messages} /> : <EmptyChat />}
          composer={
            hasActiveConversation ? (
              <Composer
                draft={draft}
                sender={sender}
                onDraftChange={setDraft}
                onToggleSender={onToggleSender}
                onSend={onSend}
              />
            ) : undefined
          }
        />
      }
    />
  );
}

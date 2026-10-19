import { useState } from "react";
import { ChatLayout } from "./components/ChatLayout";
import { Composer } from "./components/Composer";
import type { ChatMessage, Sender } from "./types/chat";

export default function App() {
  const [, setMessages] = useState<ChatMessage[]>([]);
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

  return (
    <ChatLayout
      history={null}
      composer={
        <Composer
          draft={draft}
          sender={sender}
          onDraftChange={setDraft}
          onToggleSender={onToggleSender}
          onSend={onSend}
        />
      }
    />
  );
}

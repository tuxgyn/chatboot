import { useState } from "react";
import { ChatLayout } from "./components/ChatLayout";
import { Composer } from "./components/Composer";
import type { ChatMessage, Sender } from "./types/chat";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sender, setSender] = useState<Sender>("user");

  function onToggleSender() {
    setSender((current) => (current === "user" ? "robot" : "user"));
  }

  function onSend(_draft: string, _sender: Sender) {
    // T5: no-op — o append entra na T6
    void [messages, setMessages];
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

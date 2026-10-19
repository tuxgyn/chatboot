import { useLayoutEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  const lastRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const last = lastRef.current;
    if (!last) return;

    const scroller = last.closest("[data-chat-scroll]");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p role="status" className="text-sm text-stone-500">
          Nenhuma mensagem ainda
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          ref={index === messages.length - 1 ? lastRef : undefined}
          className="w-full"
        >
          <MessageBubble message={message} />
        </div>
      ))}
    </div>
  );
}

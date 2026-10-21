import type { ChatMessage } from "../types/chat";

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <article className={`flex w-full flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      <p className="text-xs text-stone-500">
        {isUser ? "Usuário" : "Robô"} · {timeFormat.format(message.createdAt)}
      </p>
      <p
        className={`max-w-[72%] min-w-0 break-words whitespace-pre-wrap px-3 py-2 ${
          isUser
            ? "rounded-2xl rounded-br-md bg-stone-800 text-white"
            : "rounded-2xl rounded-bl-md bg-white text-stone-800 shadow-sm"
        }`}
      >
        {message.text}
      </p>
    </article>
  );
}

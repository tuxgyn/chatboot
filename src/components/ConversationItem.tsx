import type { Conversation } from "../types/conversation";
import { MessageBubble } from "./MessageBubble";

type ConversationItemProps = {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
};

export function ConversationItem({ conversation, active, onSelect, onRemove }: ConversationItemProps) {
  return (
    <li>
      <article
        className={`rounded-xl px-2 py-2 ${
          active ? "bg-white/70 ring-1 ring-stone-300" : ""
        }`}
      >
        <div className="flex items-start gap-1">
          <button
            type="button"
            onClick={() => onSelect(conversation.id)}
            aria-current={active ? "true" : undefined}
            className="min-w-0 flex-1 cursor-pointer text-left focus:ring-2 focus:ring-stone-800"
          >
            <span className="block truncate text-sm font-medium text-stone-800">{conversation.title}</span>
            <span className="block truncate font-mono text-[10px] text-stone-500">{conversation.id}</span>
          </button>
          <button
            type="button"
            onClick={() => onRemove(conversation.id)}
            aria-label={`Remover conversa ${conversation.title}`}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-stone-500 hover:bg-white/70 hover:text-stone-800 focus:ring-2 focus:ring-stone-800"
          >
            <TrashIcon />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(conversation.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(conversation.id);
            }
          }}
          className="mt-2 flex w-full cursor-pointer flex-col items-stretch gap-3"
        >
          {conversation.messages.length === 0 ? (
            <p className="text-xs text-stone-500">Sem mensagens</p>
          ) : (
            conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>
      </article>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2M9 7v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

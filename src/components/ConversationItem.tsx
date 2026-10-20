import { previewFromMessages, type Conversation } from "../types/conversation";

type ConversationItemProps = {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
};

export function ConversationItem({ conversation, active, onSelect, onRemove }: ConversationItemProps) {
  const preview = previewFromMessages(conversation.messages);

  return (
    <li className="flex items-stretch gap-1">
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        aria-current={active ? "true" : undefined}
        className={`flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-100 ${
          active
            ? "bg-stone-800 text-white hover:bg-stone-700 focus:ring-white"
            : "text-stone-800 hover:bg-white/70 focus:ring-stone-800"
        }`}
      >
        <span className="w-full truncate text-sm font-medium">{conversation.title}</span>
        <span className={`w-full truncate font-mono text-[10px] ${active ? "text-stone-300" : "text-stone-500"}`}>
          {conversation.id}
        </span>
        <span className={`w-full truncate text-xs ${active ? "text-stone-300" : "text-stone-500"}`}>
          {preview}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onRemove(conversation.id)}
        aria-label={`Remover conversa ${conversation.title}`}
        className={`flex size-11 shrink-0 cursor-pointer items-center justify-center self-center rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-100 md:size-9 ${
          active
            ? "text-stone-300 hover:bg-stone-800 hover:text-white focus:ring-white"
            : "text-stone-500 hover:bg-white/70 hover:text-stone-800 focus:ring-stone-800"
        }`}
      >
        <TrashIcon />
      </button>
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

import { previewFromMessages, type Conversation } from "../types/conversation";

type ConversationItemProps = {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
};

export function ConversationItem({ conversation, active, onSelect }: ConversationItemProps) {
  const preview = previewFromMessages(conversation.messages);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        aria-current={active ? "true" : undefined}
        className={`flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-100 ${
          active
            ? "bg-stone-800 text-white hover:bg-stone-700 focus:ring-white"
            : "text-stone-800 hover:bg-white/70 focus:ring-stone-800"
        }`}
      >
        <span className="w-full truncate text-sm font-medium">{conversation.title}</span>
        <span className={`w-full truncate text-xs ${active ? "text-stone-300" : "text-stone-500"}`}>
          {preview}
        </span>
      </button>
    </li>
  );
}

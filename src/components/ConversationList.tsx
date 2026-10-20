import { useChatStore } from "../stores/chatStore";
import { ConversationItem } from "./ConversationItem";

export function ConversationList() {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const createConversation = useChatStore((state) => state.createConversation);
  const selectConversation = useChatStore((state) => state.selectConversation);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-col gap-2 px-3 py-3">
        <p className="text-sm font-semibold text-stone-800">Conversas</p>
        <button
          type="button"
          onClick={createConversation}
          aria-label="Nova conversa"
          className="cursor-pointer rounded-xl bg-stone-800 px-3 py-2 text-sm font-medium text-white hover:bg-stone-700 focus:ring-2 focus:ring-stone-800 focus:ring-offset-2 focus:ring-offset-amber-100"
        >
          Nova conversa
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-3">
          <p role="status" className="text-sm text-stone-500">
            Nenhuma conversa
          </p>
        </div>
      ) : (
        <ul aria-label="Conversas" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-3">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeConversationId}
              onSelect={selectConversation}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

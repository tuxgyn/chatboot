import { ChatLayout } from "./components/ChatLayout";
import { Composer } from "./components/Composer";
import { ConversationList } from "./components/ConversationList";
import { EmptyChat } from "./components/EmptyChat";
import { MessageList } from "./components/MessageList";
import { MultiChatLayout } from "./components/MultiChatLayout";
import { selectActiveConversation, useChatStore } from "./stores/chatStore";

export default function App() {
  const activeConversation = useChatStore(selectActiveConversation);
  const setDraft = useChatStore((state) => state.setDraft);
  const toggleSender = useChatStore((state) => state.toggleSender);
  const sendMessage = useChatStore((state) => state.sendMessage);

  return (
    <MultiChatLayout
      list={<ConversationList />}
      chat={
        <ChatLayout
          history={
            activeConversation ? (
              <MessageList
                messages={activeConversation.messages}
                activeConversationId={activeConversation.id}
              />
            ) : (
              <EmptyChat />
            )
          }
          composer={
            <Composer
              draft={activeConversation?.draft ?? ""}
              sender={activeConversation?.sender ?? "user"}
              disabled={activeConversation == null}
              onDraftChange={setDraft}
              onToggleSender={toggleSender}
              onSend={sendMessage}
            />
          }
        />
      }
    />
  );
}

import type { ReactNode } from "react";

type ChatLayoutProps = {
  history: ReactNode;
  composer: ReactNode;
};

export function ChatLayout({ history, composer }: ChatLayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-amber-100 px-4">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
        <div
          data-chat-scroll
          className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4"
        >
          {history}
        </div>
        <div className="shrink-0 pb-4">{composer}</div>
      </div>
    </div>
  );
}

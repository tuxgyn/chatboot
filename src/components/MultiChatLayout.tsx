import type { ReactNode } from "react";

type MultiChatLayoutProps = {
  list: ReactNode;
  chat: ReactNode;
};

export function MultiChatLayout({ list, chat }: MultiChatLayoutProps) {
  return (
    <div className="flex h-dvh items-center justify-center bg-white px-4">
      <div className="flex h-[70vh] min-h-64 w-full max-w-4xl gap-3">
        <aside className="flex w-52 shrink-0 flex-col overflow-hidden rounded-[20px] border border-stone-300 bg-amber-100 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.45)] md:w-64">
          {list}
        </aside>
        {chat}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

type MultiChatLayoutProps = {
  list: ReactNode;
  chat: ReactNode;
};

export function MultiChatLayout({ list, chat }: MultiChatLayoutProps) {
  return (
    <div className="flex h-dvh flex-col bg-amber-100 md:items-center md:justify-center md:bg-white md:px-4">
      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col-reverse md:h-[70vh] md:min-h-64 md:w-auto md:flex-none md:flex-row md:gap-3">
        <aside
          id="conversation-sidebar"
          className="flex h-[36vh] min-h-40 max-h-64 w-full shrink-0 flex-col overflow-hidden border-t border-stone-300 bg-amber-100 pb-[env(safe-area-inset-bottom)] md:h-auto md:max-h-none md:min-h-0 md:w-64 md:rounded-[20px] md:border md:border-stone-300 md:pb-0 md:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.45)]"
        >
          {list}
        </aside>
        {chat}
      </div>
    </div>
  );
}

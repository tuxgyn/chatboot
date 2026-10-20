import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";

type MultiChatLayoutProps = {
  list: ReactNode;
  chat: ReactNode;
};

export function MultiChatLayout({ list, chat }: MultiChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function onListClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      setSidebarOpen(false);
    }
  }

  return (
    <div className="relative flex h-dvh items-center justify-center bg-white px-4">
      <button
        type="button"
        className="absolute left-4 top-4 z-40 grid size-10 place-items-center rounded-xl bg-stone-800 text-white hover:bg-stone-700 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800 md:hidden"
        aria-label={sidebarOpen ? "Fechar conversas" : "Abrir conversas"}
        aria-expanded={sidebarOpen}
        aria-controls="conversation-sidebar"
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          aria-label="Fechar conversas"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex h-[70vh] min-h-64 w-full max-w-4xl gap-3">
        <aside
          id="conversation-sidebar"
          className={`fixed top-[15vh] left-4 z-30 flex h-[70vh] w-64 shrink-0 flex-col overflow-hidden rounded-[20px] border border-stone-300 bg-amber-100 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.45)] transition-transform md:static md:top-auto md:left-auto md:z-0 md:h-auto md:w-64 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-[120%] pointer-events-none md:translate-x-0 md:pointer-events-auto"
          }`}
          onClick={onListClick}
        >
          {list}
        </aside>
        {chat}
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

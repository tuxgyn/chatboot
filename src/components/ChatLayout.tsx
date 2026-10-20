import type { ReactNode } from "react";

type ChatLayoutProps = {
  history: ReactNode;
  composer?: ReactNode;
};

export function ChatLayout({ history, composer }: ChatLayoutProps) {
  return (
    <section
      aria-label="Chat"
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-stone-300 bg-amber-100 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.45)]"
    >
      <header className="flex shrink-0 items-center gap-2 bg-stone-800 px-4 py-2.5 text-white">
        <BotMark />
        <p className="text-sm font-semibold">Assistente</p>
      </header>
      <div
        data-chat-scroll
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3"
      >
        {history}
      </div>
      {composer != null ? <div className="shrink-0 p-3">{composer}</div> : null}
    </section>
  );
}

function BotMark() {
  return (
    <span className="grid size-7 place-items-center rounded-full bg-amber-100 text-stone-800">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="5" y="8" width="14" height="11" rx="2" />
        <circle cx="9" cy="13" r="1.2" fill="currentColor" />
        <circle cx="15" cy="13" r="1.2" fill="currentColor" />
        <path d="M12 8V5" strokeLinecap="round" />
        <circle cx="12" cy="4" r="1" fill="currentColor" />
      </svg>
    </span>
  );
}

import { useLayoutEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { Sender } from "../types/chat";
import { SendButton } from "./SendButton";
import { SenderToggle } from "./SenderToggle";

const LINE_HEIGHT_PX = 24;
const MAX_LINES = 8;

type ComposerProps = {
  draft: string;
  sender: Sender;
  onDraftChange: (draft: string) => void;
  onToggleSender: () => void;
  onSend: (draft: string, sender: Sender) => void;
  disabled?: boolean;
};

export function Composer({
  draft,
  sender,
  onDraftChange,
  onToggleSender,
  onSend,
  disabled = false,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && draft.trim().length > 0;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const maxHeight = LINE_HEIGHT_PX * MAX_LINES;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [draft]);

  function send() {
    if (!canSend) return;
    onSend(draft, sender);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    send();
  }

  return (
    <div
      className={`flex items-end gap-1.5 rounded-2xl border-2 bg-white p-2 shadow-md md:gap-2 md:p-3 ${
        sender === "robot" ? "border-violet-500" : "border-transparent"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <SenderToggle sender={sender} onToggle={onToggleSender} disabled={disabled} />
      <label htmlFor="chat-message" className="sr-only">
        Mensagem
      </label>
      <textarea
        id="chat-message"
        ref={textareaRef}
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        disabled={disabled}
        placeholder="Escreva uma mensagem"
        className="max-h-[192px] min-h-6 min-w-0 flex-1 resize-none bg-transparent py-2 leading-6 text-stone-800 outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
      />
      <SendButton disabled={!canSend} onClick={send} />
    </div>
  );
}

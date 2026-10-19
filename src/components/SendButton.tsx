type SendButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export function SendButton({ disabled, onClick }: SendButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label="Enviar"
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-stone-800 text-white hover:bg-stone-700 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-stone-800"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 12h12M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

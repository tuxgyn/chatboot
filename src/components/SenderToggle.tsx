import type { Sender } from "../types/chat";

type SenderToggleProps = {
  sender: Sender;
  onToggle: () => void;
};

export function SenderToggle({ sender, onToggle }: SenderToggleProps) {
  const isRobot = sender === "robot";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isRobot}
      aria-label={isRobot ? "Remetente: robô" : "Remetente: usuário"}
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 ${
        isRobot
          ? "bg-violet-50 text-violet-600 hover:bg-violet-100 focus-visible:outline-violet-500"
          : "text-stone-700 hover:bg-stone-100 focus-visible:outline-stone-800"
      }`}
    >
      {isRobot ? <RobotIcon /> : <PersonIcon />}
    </button>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" />
      <path d="M12 8V5" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

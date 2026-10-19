import { ChatLayout } from "./components/ChatLayout";

export default function App() {
  return (
    <ChatLayout
      history={null}
      composer={
        <div className="min-h-14 rounded-2xl bg-white shadow-md" />
      }
    />
  );
}

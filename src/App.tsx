import { ChatLayout } from "./components/ChatLayout";
import { Composer } from "./components/Composer";

export default function App() {
  return <ChatLayout history={null} composer={<Composer />} />;
}

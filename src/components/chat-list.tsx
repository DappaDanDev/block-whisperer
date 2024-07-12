import type { UIState } from "@/app/actions";
import { Stats } from "./llm/stats";

interface MessageProps {
  messages: UIState;
}

export function ChatList({ messages }: MessageProps) {
if (!messages) return null;

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message) => (
        <div key={message.id} className="pb-4">
          {message.display}
        </div>
      ))}
    </div>
  );
}

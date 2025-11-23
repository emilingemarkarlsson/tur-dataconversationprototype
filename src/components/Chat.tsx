import { Message } from "@/engine";
import { cn } from "@/lib/utils";

interface ChatProps {
  messages: Message[];
}

export function Chat({ messages }: ChatProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        if (message.role === "system") return null;
        
        const isUser = message.role === "user";
        
        return (
          <div
            key={index}
            className={cn(
              "flex w-full",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                isUser
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              )}
            >
              {message.content.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

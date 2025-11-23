import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chat } from "@/components/Chat";
import { ChartPanel } from "@/components/ChartPanel";
import { answerQuestion, Message, ChartDataPoint } from "@/engine";
import { Send, Sparkles, Share2, Copy, Check } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Why did sales drop in Germany last month?",
  "Highlight anything unusual in the last 14 days",
  "Show resellers down more than 20% YoY",
  "What's the revenue trend over time?",
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Welcome! Ask me about your sales data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [chartData, setChartData] = useState<ChartDataPoint[] | undefined>();
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Get answer from engine
    const result = answerQuestion(input);

    const assistantMessage: Message = {
      role: "assistant",
      content: result.text,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setChartData(result.chartData);
    setInput("");
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    // Trigger send after a brief delay to show the input
    setTimeout(() => {
      const userMessage: Message = {
        role: "user",
        content: prompt,
      };

      setMessages((prev) => [...prev, userMessage]);

      const result = answerQuestion(prompt);

      const assistantMessage: Message = {
        role: "assistant",
        content: result.text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setChartData(result.chartData);
      setInput("");
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyInsight = async () => {
    const lastAssistantMessage = messages.filter(m => m.role === "assistant").pop();
    if (!lastAssistantMessage) return;

    const textToCopy = `📊 Bold Analytics Insight\n\n${lastAssistantMessage.content}\n\nGenerated at: ${new Date().toLocaleString()}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const lastAssistantMessage = messages.filter(m => m.role === "assistant").pop();
    if (!lastAssistantMessage) return;

    const shareData = {
      title: 'Analytics Insight',
      text: lastAssistantMessage.content,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyInsight();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight">
              Bold Analytics
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium">
            Ask questions in natural language
          </p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-slate-200/50 dark:border-slate-700/50 rounded-3xl">
          <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Analytics Assistant</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Ask about trends, anomalies, or specific segments
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyInsight}
                  disabled={messages.filter(m => m.role === "assistant").length === 0}
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Copy insight"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  disabled={messages.filter(m => m.role === "assistant").length === 0}
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Share insight"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Chat History */}
            <div className="h-[300px] overflow-y-auto pr-2 space-y-4">
              <Chat messages={messages} />
              <div ref={chatEndRef} />
            </div>

            {/* Chart */}
            {chartData && <ChartPanel data={chartData} />}

            {/* Example Prompts */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>
            Bold Analytics — All data processing happens in your browser, no backend required.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

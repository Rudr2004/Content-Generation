import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your GreenAppleX AI assistant. I can help you with questions about our services, technologies, and solutions. How can I assist you today?\n\nYou can ask me about:\n• AI & Machine Learning services\n• Web3 & Blockchain development\n• Mobile app development\n• Custom software solutions\n• Pricing and project timelines\n• Our technologies and expertise",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString() + "_bot",
        text: data.reply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Chat Error",
        description: error?.message || "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + "_user",
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    chatMutation.mutate(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${isOpen ? "scale-0" : "scale-100"
          } bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 w-80 sm:w-96 transition-all duration-300 ${isMinimized ? "h-14" : "h-96 sm:h-[500px]"
            }`}
        >
          <Card className="h-full shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">GreenAppleX AI</CardTitle>
                    <p className="text-xs text-white/80">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Chat Content */}
            {!isMinimized && (
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.isUser ? "justify-end" : "justify-start"
                          }`}
                      >
                        {!message.isUser && (
                          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] p-3 rounded-lg text-sm ${message.isUser
                            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${message.isUser ? "text-white/70" : "text-gray-500"
                              }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {message.isUser && (
                          <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {chatMutation.isPending && (
                      <div className="flex gap-2 justify-start">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="max-w-[75%] p-3 rounded-lg text-sm bg-gray-100 text-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            </div>
                            <span className="text-gray-500">AI is typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-white mb-20">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1"
                      disabled={chatMutation.isPending}
                      autoFocus={false}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || chatMutation.isPending}
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
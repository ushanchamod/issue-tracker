import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import useAxios from "../../hooks/useAxios";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

// Optimized Markdown renderer with syntax highlighting
const MarkdownRenderer: React.FC<{ content: string }> = memo(({ content }) => {
  const renderMarkdown = useMemo(() => {
    let html = content;

    // Escape HTML to prevent XSS
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks with language detection and copy button
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
      console.log("Rendering code block:", { lang, code, match });
      const codeId = Math.random().toString(36).substr(2, 9);
      const language = lang || "text";
      const trimmedCode = code.trim();

      return `<div class="relative group my-3">
        <div class="flex items-center justify-between bg-gray-800 text-gray-300 px-3 py-2 text-xs rounded-t-lg">
          <span class="font-mono">${language}</span>
          <button 
            onclick="window.copyCode('${trimmedCode.replace(
              /'/g,
              "\\'"
            )}', '${codeId}')"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700 px-2 py-1 rounded flex items-center gap-1"
            data-code-id="${codeId}"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
          </button>
        </div>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto"><code class="language-${language} text-sm font-mono leading-relaxed">${trimmedCode}</code></pre>
      </div>`;
    });

    // Inline code with better styling
    html = html.replace(
      /`([^`\n]+)`/g,
      '<code class="bg-gray-100 text-pink-600 px-2 py-1 rounded text-sm font-mono border">$1</code>'
    );

    // Bold text with multiple patterns
    html = html.replace(
      /\*\*((?:(?!\*\*).)+)\*\*/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    );
    html = html.replace(
      /__((?:(?!__).)+)__/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    );

    // Italic text
    html = html.replace(
      /\*((?:(?!\*).)+)\*/g,
      '<em class="italic text-gray-700">$1</em>'
    );
    html = html.replace(
      /_((?:(?!_).)+)_/g,
      '<em class="italic text-gray-700">$1</em>'
    );

    // Headers with better styling
    html = html.replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2 pb-1 border-b border-gray-200">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-bold text-gray-800 mt-5 mb-3 pb-2 border-b-2 border-gray-300">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gm,
      '<h1 class="text-2xl font-bold text-gray-900 mt-5 mb-3 pb-2 border-b-2 border-blue-500">$1</h1>'
    );

    // Links with better styling and security
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Enhanced lists
    html = html.replace(
      /^(\s*)[-*+] (.+)$/gm,
      '$1<li class="ml-4 mb-1 pl-2 relative"><span class="absolute left-[-12px] text-blue-500">•</span>$2</li>'
    );
    html = html.replace(
      /(<li class="ml-4 mb-1 pl-2 relative">[\s\S]*?<\/li>\s*)+/g,
      '<ul class="my-3 space-y-1">$&</ul>'
    );

    html = html.replace(
      /^(\s*)(\d+)\. (.+)$/gm,
      '$1<li class="ml-6 mb-1 list-decimal list-inside">$3</li>'
    );
    html = html.replace(
      /(<li class="ml-6 mb-1 list-decimal list-inside">[\s\S]*?<\/li>\s*)+/g,
      '<ol class="my-3 space-y-1">$&</ol>'
    );

    // Tables (basic support)
    html = html.replace(/^\|(.+)\|$/gm, '<tr class="border-b">$1</tr>');
    html = html.replace(/\|([^|]+)/g, '<td class="px-3 py-2 border-r">$1</td>');
    html = html.replace(
      /(<tr class="border-b">[\s\S]*?<\/tr>\s*)+/g,
      '<table class="min-w-full border-collapse border border-gray-300 my-3"><tbody>$&</tbody></table>'
    );

    // Blockquotes with icon
    html = html.replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3 my-3 italic text-gray-700 relative"><div class="flex items-start gap-2"><span class="text-blue-400 font-bold">"</span><span>$1</span></div></blockquote>'
    );

    // Horizontal rules
    html = html.replace(
      /^---$/gm,
      '<hr class="border-t-2 border-gray-300 my-4">'
    );

    // Line breaks (convert \n to <br> but preserve structure)
    html = html.replace(/\n(?!\s*<)/g, "<br>");

    // Task lists
    html = html.replace(
      /^- \[ \] (.+)$/gm,
      '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="rounded"> <span>$1</span></div>'
    );
    html = html.replace(
      /^- \[x\] (.+)$/gm,
      '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="rounded"> <span class="line-through text-gray-500">$1</span></div>'
    );

    return html;
  }, [content]);

  return (
    <div
      className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: renderMarkdown }}
    />
  );
});

MarkdownRenderer.displayName = "MarkdownRenderer";

const ChatUI: React.FC = () => {
  const { fetchData } = useAxios();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input.trim(),
        sender: "user",
      };

      setMessages((prev) => [...prev, userMessage]);
      const messageText = input.trim();
      setInput("");
      setIsTyping(true);

      try {
        const res = await fetchData({
          url: "/ai/chat",
          method: "post",
          data: { message: messageText },
        });

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: res?.response || "Sorry, I couldn't process your request.",
          sender: "bot",
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "❌ **Connection Error**\n\nSorry, something went wrong. Please check your connection and try again.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="chat-button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        ) : (
          <motion.div
            className="chat-ui fixed top-0 left-0 bg-gray-900/50 w-[100vw] h-[100dvh] flex items-center justify-center md:items-end md:justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="chat-window"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl w-[28rem] h-[36rem] flex flex-col border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800">
                      AI Assistant
                    </span>
                    <div className="text-xs text-gray-500 flex items-center">
                      <motion.span className="inline-block w-1.5 h-1.5 mr-1 bg-green-500 rounded-full animate-pulse"></motion.span>
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearChat}
                      className="text-gray-400 hover:text-gray-600 transition-colors text-xs px-2 py-1 rounded"
                      title="Clear chat"
                    >
                      Clear
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 text-sm mt-16">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="font-medium mb-1">Welcome to AI Chat!</div>
                    <div className="text-xs">
                      Ask me anything with markdown support
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        {msg.sender === "bot" ? (
                          <MarkdownRenderer content={msg.text} />
                        ) : (
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white px-4 py-3 rounded-2xl max-w-[80%] border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            AI is typing...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-3">
                  <input
                    autoFocus
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 text-sm"
                    placeholder="Type your message... (Shift+Enter for new line)"
                    disabled={isTyping}
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim() || isTyping}
                    className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                      input.trim() && !isTyping
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">
                  Powered by UshanAI{" "}
                  <a
                    href="https://ushan.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-600"
                  >
                    ushan.me
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatUI;

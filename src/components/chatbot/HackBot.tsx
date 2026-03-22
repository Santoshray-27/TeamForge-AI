import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
  Trash2,
  ChevronDown,
  Zap,
} from 'lucide-react';
import {
  chatWithHackBot,
  type ChatMessage,
} from '../../services/gemini.service';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  '🏆 How do I win hackathons?',
  '👥 Best team size for 48h?',
  '🤖 AI/ML tech stack tips?',
  '📊 How to pitch my project?',
  '⚡ 24h hackathon strategy?',
  '🔗 Web3 hackathon must-haves?',
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Hey there! I'm **HackBot** 🤖 — your AI-powered hackathon expert!\n\nI can help you with:\n• 🏆 **Winning strategies** for hackathons\n• 👥 **Team formation** advice\n• 💻 **Tech stack** recommendations\n• 📚 **Learning paths** for new skills\n• 🚀 **Pitch deck** tips\n\nWhat would you like to know? Ask me anything hackathon-related!`,
  timestamp: new Date(),
};

function formatMessage(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const formatted = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} className="text-white font-semibold">
          {part}
        </strong>
      ) : (
        part
      )
    );
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export const HackBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithHackBot(messages, messageText);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen || isMinimized) setUnread((prev) => prev + 1);
    } catch (err) {
      console.error('HackBot error:', err);
      toast.error('HackBot is having trouble. Try again!');
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm having a momentary brain glitch 🤖⚡ Please try again in a second!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setUnread(0);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnread(0);
  };

  return (
    <>
      {/* ── Floating Action Button ──────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl
                       bg-gradient-to-br from-indigo-600 to-purple-600
                       flex items-center justify-center
                       shadow-2xl shadow-indigo-500/40 cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {unread > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5
                           bg-red-500 rounded-full
                           flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">{unread}</span>
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
              originX: 1,
              originY: 1,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 'auto' : undefined,
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px]
                       max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden
                       shadow-2xl shadow-black/50 border border-white/10"
            style={{ maxHeight: isMinimized ? undefined : '600px' }}
          >
            {/* ── Header ──────────────────────────────────────── */}
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600
                          p-4 flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-xl bg-white/20
                            flex items-center justify-center flex-shrink-0"
              >
                <Bot className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">HackBot</span>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5
                                bg-white/20 rounded-full"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">Gemini AI</span>
                  </div>
                </div>
                <p className="text-indigo-200 text-xs">
                  Hackathon expert • Always ready
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20
                             flex items-center justify-center transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/70" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20
                             flex items-center justify-center transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <Minimize2 className="w-3.5 h-3.5 text-white/70" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20
                             flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            </div>

            {/* ── Chat Body ───────────────────────────────────── */}
            {!isMinimized && (
              <div
                className="bg-[#0f0f1a] flex flex-col"
                style={{ height: '500px' }}
              >
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center
                                    justify-center flex-shrink-0 mt-0.5 ${
                                      msg.role === 'assistant'
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                                        : 'bg-white/10'
                                    }`}
                      >
                        {msg.role === 'assistant' ? (
                          <Bot className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-gray-300" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5
                                    text-sm leading-relaxed ${
                                      msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                        : 'bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm'
                                    }`}
                      >
                        {formatMessage(msg.content)}
                        <div
                          className={`text-xs mt-1 ${
                            msg.role === 'user'
                              ? 'text-indigo-300'
                              : 'text-gray-600'
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg bg-gradient-to-br
                                    from-indigo-600 to-purple-600
                                    flex items-center justify-center flex-shrink-0"
                      >
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div
                        className="bg-white/8 border border-white/10
                                    rounded-2xl rounded-tl-sm px-4 py-3"
                      >
                        <div className="flex gap-1.5 items-center">
                          <div
                            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          />
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          />
                          <div
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompt Chips */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-600 mb-2">
                      Quick questions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          disabled={loading}
                          className="text-xs px-2.5 py-1.5
                                     bg-white/5 hover:bg-indigo-600/20
                                     border border-white/10
                                     hover:border-indigo-500/40
                                     rounded-lg text-gray-400
                                     hover:text-indigo-300
                                     transition-all disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Bar */}
                <div className="p-3 border-t border-white/10 bg-[#0a0a0f]">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Ask about hackathons..."
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-white/5
                                   border border-white/10 rounded-xl
                                   text-white placeholder-gray-600 text-sm
                                   focus:outline-none focus:border-indigo-500/50
                                   transition-all disabled:opacity-50"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br
                                 from-indigo-600 to-purple-600
                                 flex items-center justify-center
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 flex-shrink-0 cursor-pointer"
                    >
                      {loading ? (
                        <Zap className="w-4 h-4 text-white animate-pulse" />
                      ) : (
                        <Send className="w-4 h-4 text-white" />
                      )}
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-700 mt-1.5 text-center">
                    Powered by Google Gemini AI • Hackathon-focused
                  </p>
                </div>
              </div>
            )}

            {/* ── Minimized Bar ────────────────────────────────── */}
            {isMinimized && (
              <div
                className="bg-[#0f0f1a] px-4 py-2 flex items-center gap-2
                           cursor-pointer border-t border-white/5"
                onClick={() => setIsMinimized(false)}
              >
                <span className="text-gray-400 text-sm flex-1">
                  {messages[messages.length - 1]?.content.slice(0, 40)}...
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 rotate-180" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
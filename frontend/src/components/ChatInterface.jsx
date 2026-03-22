import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Globe, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingIndicator = () => (
  <div className="flex gap-4">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(0,255,135,0.15)', border: '1px solid rgba(0,255,135,0.3)' }}
    >
      <Bot size={14} style={{ color: '#00ff87' }} />
    </div>
    <div
      className="flex items-center gap-1.5 px-5 py-4 rounded-2xl rounded-tl-sm"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span className="w-2 h-2 rounded-full typing-dot" style={{ background: '#00ff87' }} />
      <span className="w-2 h-2 rounded-full typing-dot" style={{ background: '#00ff87' }} />
      <span className="w-2 h-2 rounded-full typing-dot" style={{ background: '#00ff87' }} />
    </div>
  </div>
);

const ChatInterface = ({ onSendMessage, messages, isSending, crawledUrl, onNewChat }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 150)}px`;
    }
  };

  const domain = crawledUrl ? (() => { try { return new URL(crawledUrl).hostname; } catch { return crawledUrl; } })() : null;

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: '#0a0a0f' }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,135,0.2), rgba(96,239,255,0.1))',
              border: '1px solid rgba(0,255,135,0.3)',
            }}
          >
            <Bot size={16} style={{ color: '#00ff87' }} />
          </div>
          <div>
            <h1 className="font-semibold text-white text-sm leading-tight">ThinkAI Assistant</h1>
            {domain && (
              <div className="flex items-center gap-1 mt-0.5">
                <Globe size={10} className="text-slate-500" />
                <span className="text-xs text-slate-500 truncate max-w-[200px]">{domain}</span>
                <span
                  className="ml-1 px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{ background: 'rgba(0,255,135,0.1)', color: '#00ff87' }}
                >
                  Active
                </span>
              </div>
            )}
          </div>
        </div>
        {onNewChat && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
          >
            <Plus size={12} />
            New Chat
          </motion.button>
        )}
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={
                  msg.role === 'user'
                    ? { background: 'rgba(96,239,255,0.15)', border: '1px solid rgba(96,239,255,0.3)' }
                    : { background: 'rgba(0,255,135,0.15)', border: '1px solid rgba(0,255,135,0.3)' }
                }
              >
                {msg.role === 'user' ? (
                  <User size={14} style={{ color: '#60efff' }} />
                ) : (
                  <Bot size={14} style={{ color: '#00ff87' }} />
                )}
              </div>

              {/* Bubble */}
              <div
                className="max-w-[78%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, rgba(96,239,255,0.15), rgba(96,239,255,0.08))',
                        border: '1px solid rgba(96,239,255,0.2)',
                        color: '#e2e8f0',
                        borderTopRightRadius: '4px',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#cbd5e1',
                        borderTopLeftRadius: '4px',
                      }
                }
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm prose-dark max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isSending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-4 pb-5 pt-3 max-w-3xl w-full mx-auto"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div
            className="flex items-end gap-3 p-2 rounded-2xl transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onFocus={() => {}}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about the website..."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-white placeholder-slate-600 text-sm leading-relaxed px-3 py-3"
              style={{ maxHeight: '150px' }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isSending}
              whileHover={input.trim() && !isSending ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isSending ? { scale: 0.95 } : {}}
              className="flex-shrink-0 p-3 rounded-xl transition-all"
              style={{
                background: input.trim() && !isSending
                  ? 'linear-gradient(135deg, #00ff87, #00c97a)'
                  : 'rgba(255,255,255,0.05)',
                color: input.trim() && !isSending ? '#0a0a0f' : '#374151',
                cursor: input.trim() && !isSending ? 'pointer' : 'not-allowed',
              }}
            >
              <Send size={16} />
            </motion.button>
          </div>
          <p className="text-center text-xs text-slate-700 mt-2">
            Press <kbd className="px-1 py-0.5 rounded text-slate-600 font-mono" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded text-slate-600 font-mono" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Shift+Enter</kbd> for newline
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

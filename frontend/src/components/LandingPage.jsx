import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Zap, Brain, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Deep Crawl',
    desc: 'Recursively crawls every page and link up to your specified depth',
    color: '#00ff87',
  },
  {
    icon: Zap,
    title: 'Smart Embed',
    desc: 'Converts content into semantic vector embeddings using Sentence Transformers',
    color: '#60efff',
  },
  {
    icon: Brain,
    title: 'AI Chat',
    desc: 'Ask anything about the crawled site — powered by Gemini 2.0 Flash',
    color: '#a855f7',
  },
];

const useCases = ['Analyze Competitors', 'Extract Knowledge', 'Research Topics', 'Summarize Docs', 'Q&A on Any Site'];

const LandingPage = ({ onStartCrawl }) => {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onStartCrawl(url.trim());
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,135,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(96,239,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #00ff87, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #60efff, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(0, 255, 135, 0.08)',
            border: '1px solid rgba(0, 255, 135, 0.2)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium" style={{ color: '#00ff87' }}>
            AI-Powered Website Intelligence
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 tracking-tight"
        >
          <span className="gradient-text">ThinkAI</span>
          <br />
          <span className="text-white">Crawler</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Drop a URL, let our AI crawl, chunk, and embed it — then chat with the entire website like it's a conversation.
        </motion.p>

        {/* URL Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="relative w-full mb-10"
        >
          <div
            className="flex items-center rounded-2xl p-1.5 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: focused ? '1px solid rgba(0,255,135,0.5)' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: focused ? '0 0 30px rgba(0,255,135,0.12), 0 0 0 3px rgba(0,255,135,0.06)' : 'none',
            }}
          >
            <div className="pl-3 pr-1 flex-shrink-0">
              <Globe size={18} className="text-slate-500" />
            </div>
            <input
              type="url"
              placeholder="https://docs.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              className="flex-1 px-3 py-3.5 bg-transparent outline-none text-white placeholder-slate-600 font-medium text-base"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #00ff87, #00c97a)',
                color: '#0a0a0f',
                boxShadow: '0 0 20px rgba(0,255,135,0.3)',
              }}
            >
              Start Crawl
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.form>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glass-card p-5 text-left cursor-default"
              style={{
                borderColor: `${f.color}18`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
              >
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Use case chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {useCases.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 cursor-default transition-colors hover:text-green-400"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';

const LandingPage = ({ onStartCrawl }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      onStartCrawl(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-b from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-400/30 mx-auto mb-6">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
          ThinkAI Crawler
        </h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Enter a website URL to crawl its content and start chatting with our AI assistant.
        </p>
      </motion.div>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/40 backdrop-blur-md border border-white/60 p-2 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors shadow-md flex items-center gap-2 group"
        >
          <span>Start</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex gap-4 flex-wrap justify-center"
      >
        {['Analyze Competitors', 'Extract Knowledge', 'Research Topics'].map((tag, i) => (
          <span key={i} className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-white/60 cursor-default hover:bg-white/80 transition-colors">
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;

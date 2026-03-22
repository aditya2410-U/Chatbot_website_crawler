import React, { useState } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import ChatInterface from './components/ChatInterface';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'loading' | 'chat'
  const [sessionId, setSessionId] = useState(null);
  const [crawledUrl, setCrawledUrl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleStartCrawl = async (url) => {
    setCrawledUrl(url);
    setCurrentView('loading');
    try {
      const response = await axios.post(`${API_BASE_URL}/crawl`, {
        url,
        max_depth: 2,
      });
      setSessionId(response.data.crawl_session_id);
      setMessages([
        {
          role: 'assistant',
          content: `✅ I've finished crawling **${url}**.\n\nI found and analyzed **${response.data.crawled_urls_count}** pages. Ask me anything about its content!`,
        },
      ]);
      setCurrentView('chat');
    } catch (error) {
      console.error('Crawl failed:', error);
      alert('Failed to crawl the website. Please check the URL and try again.');
      setCurrentView('landing');
    }
  };

  const handleSendMessage = async (text) => {
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsSending(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        session_id: sessionId,
        prompt: text,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setCurrentView('landing');
    setSessionId(null);
    setCrawledUrl(null);
    setMessages([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStartCrawl={handleStartCrawl} />
          </motion.div>
        )}

        {currentView === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScreen />
          </motion.div>
        )}

        {currentView === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100vh' }}
          >
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isSending={isSending}
              crawledUrl={crawledUrl}
              onNewChat={handleNewChat}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

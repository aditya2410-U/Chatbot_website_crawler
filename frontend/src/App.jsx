import React, { useState } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import ChatInterface from './components/ChatInterface';

// Configure Axios base URL
// Assuming backend runs on port 8000
const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'loading', 'chat'
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleStartCrawl = async (url) => {
    setCurrentView('loading');
    try {
      const response = await axios.post(`${API_BASE_URL}/crawl`, {
        url: url,
        max_depth: 2 // You can make this configurable later
      });
      
      setSessionId(response.data.crawl_session_id);
      
      // Add initial greeting
      setMessages([
        { role: 'assistant', content: `I have finished crawling ${url}. Ask me anything about its content!` }
      ]);
      
      setCurrentView('chat');
    } catch (error) {
      console.error("Crawl failed:", error);
      alert("Failed to crawl the website. Please check the URL and try again.");
      setCurrentView('landing');
    }
  };

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        session_id: sessionId,
        prompt: text
      });

      const botMessage = { role: 'assistant', content: response.data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat failed:", error);
      const errorMessage = { role: 'assistant', content: "Sorry, I encountered an error while processing your request." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {currentView === 'landing' && (
        <LandingPage onStartCrawl={handleStartCrawl} />
      )}
      
      {currentView === 'loading' && (
        <LoadingScreen />
      )}
      
      {currentView === 'chat' && (
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      )}
    </div>
  );
}

export default App;

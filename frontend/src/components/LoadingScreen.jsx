import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { label: 'Fetching page HTML', detail: 'Sending request to the URL...' },
  { label: 'Parsing links & structure', detail: 'Discovering internal links...' },
  { label: 'Crawling sub-pages', detail: 'Recursively visiting all pages...' },
  { label: 'Cleaning & chunking text', detail: 'Splitting content into segments...' },
  { label: 'Generating embeddings', detail: 'Running Sentence Transformer model...' },
  { label: 'Storing in database', detail: 'Saving vectors to MongoDB...' },
];

const LoadingScreen = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 dot-bg opacity-40 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,135,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto text-center">
        {/* Animated ring */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2"
              strokeDasharray="80 200"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff87" />
                <stop offset="100%" stopColor="#60efff" />
              </linearGradient>
            </defs>
          </svg>
          {/* Inner ring counter-spin */}
          <svg
            className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)]"
            style={{ animation: 'spin-slow 5s linear infinite reverse' }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="rgba(168,85,247,0.4)"
              strokeWidth="1.5"
              strokeDasharray="40 250"
              strokeLinecap="round"
            />
          </svg>
          {/* Center icon */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'rgba(0,255,135,0.08)',
              borderRadius: '50%',
              margin: '12px',
            }}
          >
            <span className="text-3xl animate-pulse select-none">🕷️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-1">Crawling Website</h2>
        <p className="text-slate-500 text-sm mb-8">Hang tight, this may take a minute...</p>

        {/* Steps */}
        <div className="glass-card p-5 text-left space-y-3">
          {steps.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <AnimatePresence key={i} mode="wait">
                <motion.div
                  className="flex items-start gap-3"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: done ? 0.5 : active ? 1 : 0.3 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: done
                        ? 'rgba(0,255,135,0.2)'
                        : active
                        ? 'rgba(0,255,135,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      border: done
                        ? '1px solid rgba(0,255,135,0.5)'
                        : active
                        ? '1px solid rgba(0,255,135,0.3)'
                        : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {done ? (
                      <span style={{ color: '#00ff87' }}>✓</span>
                    ) : active ? (
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff87' }} />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: done ? '#64748b' : active ? '#f1f5f9' : '#374151' }}
                    >
                      {step.label}
                    </p>
                    {active && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs mt-0.5"
                        style={{ color: '#00ff87' }}
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Tip */}
        <p className="text-xs text-slate-600 mt-4">
          Deeper crawls take longer. Default depth is 2.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;

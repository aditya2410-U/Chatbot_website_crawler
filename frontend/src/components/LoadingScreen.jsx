import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-xl mb-8"
      />
      
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-2">
        Crawling Website
      </h2>
      <p className="text-gray-500 max-w-sm mx-auto">
        Please wait while we analyze the content of the URL. This might take a few moments...
      </p>
    </div>
  );
};

export default LoadingScreen;

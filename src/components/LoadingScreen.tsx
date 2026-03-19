// src/components/LoadingScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative">
          {/* Animated loader */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6"
          >
            <div className="w-full h-full rounded-full border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent"></div>
          </motion.div>
          
          {/* Bird icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl">🐦</div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Loading Game...</h2>
        <p className="text-gray-300">Preparing your adventure</p>
      </motion.div>
    </div>
  );
};
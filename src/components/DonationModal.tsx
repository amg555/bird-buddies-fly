// src/components/DonationModal.tsx
import React, { useEffect } from 'react';
import { X, Heart, Coffee, Star, TrendingUp, Zap, Shield, Gamepad2, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onDonate }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="
                pointer-events-auto
                w-full
                max-w-md 
                bg-white 
                rounded-2xl 
                shadow-2xl 
                overflow-hidden
                flex flex-col
                max-h-[85vh]
                my-auto
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-4 sm:p-5 text-white relative overflow-hidden flex-shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white/80 hover:text-white transition-colors z-10 p-1.5 hover:bg-white/20 rounded-lg"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 sm:w-20 h-16 sm:h-20 bg-white rounded-full animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full animate-pulse animation-delay-1000" />
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 relative z-10 pr-8">
                  <div className="p-2 sm:p-2.5 bg-white/20 rounded-full backdrop-blur-sm animate-bounce-slow flex-shrink-0">
                    <Coffee className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold">Support Bird Buddies</h2>
                    <p className="text-white/90 text-xs sm:text-sm mt-0.5">Your support keeps us flying! 🚀</p>
                  </div>
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                  {/* Developer message */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                    <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                      "Hi! I'm an indie developer who loves creating fun games. Your support helps me dedicate more time to adding new features and keeping the game ad-free!"
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 sm:mt-2 text-right">- The Developer 💜</p>
                  </div>
                  
                  {/* Why donate section */}
                  <div className="space-y-2 sm:space-y-2.5">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-heartbeat flex-shrink-0" fill="currentColor" />
                      What Your Support Enables
                    </h3>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      {/* Ad-Free */}
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="p-1.5 bg-yellow-100 rounded-lg flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">Ad-Free Forever</p>
                          <p className="text-xs text-gray-500">No annoying ads, ever!</p>
                        </div>
                      </div>
                      
                      {/* New Characters */}
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0 mt-0.5">
                          <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">New Characters & Features</p>
                          <p className="text-xs text-gray-500">Monthly updates with cool content</p>
                        </div>
                      </div>
                      
                      {/* Server */}
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0 mt-0.5">
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">Server Maintenance</p>
                          <p className="text-xs text-gray-500">Keep the game running smoothly</p>
                        </div>
                      </div>
                      
                      {/* Performance */}
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0 mt-0.5">
                          <Code className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">Better Performance</p>
                          <p className="text-xs text-gray-500">Continuous optimization & bug fixes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick donation amounts */}
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 sm:p-4 border border-orange-200">
                    <p className="text-center text-gray-700 mb-2 sm:mb-2.5 font-medium text-xs sm:text-sm">
                      Every cookie counts! 🍪
                    </p>
                    <div className="flex justify-center gap-3 sm:gap-4">
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl block">☕</span>
                        <p className="text-xs text-gray-600 mt-0.5">Coffee</p>
                      </div>
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl block">🍪</span>
                        <p className="text-xs text-gray-600 mt-0.5">Cookie</p>
                      </div>
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl block">🍰</span>
                        <p className="text-xs text-gray-600 mt-0.5">Cake</p>
                      </div>
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl block">🎂</span>
                        <p className="text-xs text-gray-600 mt-0.5">Big Cake</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fixed Footer with CTA */}
              <div className="border-t border-gray-200 p-4 sm:p-5 bg-white flex-shrink-0">
                {/* Main donate button */}
                <button
                  onClick={onDonate}
                  className="
                    w-full 
                    py-3 sm:py-3.5 
                    bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 
                    text-white 
                    rounded-xl 
                    font-bold 
                    text-sm sm:text-base
                    shadow-lg hover:shadow-xl 
                    transform hover:scale-[1.02] 
                    transition-all 
                    flex items-center justify-center gap-2 
                    relative overflow-hidden group
                    active:scale-[0.98]
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 animate-heartbeat" fill="currentColor" />
                  <span className="relative z-10">BUY ME A COOKIE</span>
                  <span className="text-lg sm:text-xl relative z-10 animate-cookie-float">🍪</span>
                </button>
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    🔒 Secure Payment
                  </span>
                  <span className="flex items-center gap-1">
                    💝 100% to Development
                  </span>
                </div>
                
                {/* Thank you message */}
                <p className="text-center text-xs text-gray-400 italic mt-2">
                  Thank you for being an amazing supporter! 🙏
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
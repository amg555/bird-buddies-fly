import React, { useState } from 'react';
import { Settings, Key, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { ManualUnlock } from './ManualUnlock';
import { usePaymentStore } from '@/hooks/usePaymentStore';

interface GameSettingsProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ isMuted, onToggleMute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showManualUnlock, setShowManualUnlock] = useState(false);
  const { hasLifetimeAccess } = usePaymentStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-40 bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-16 right-4 z-40 bg-white rounded-lg shadow-lg p-4 min-w-[200px]"
        >
          <h3 className="font-bold text-gray-800 mb-3">Settings</h3>
          
          <button
            onClick={onToggleMute}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-sm text-gray-700">Sound</span>
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {!hasLifetimeAccess() && (
            <button
              onClick={() => {
                setShowManualUnlock(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors mt-2"
            >
              <span className="text-sm text-gray-700">Unlock Characters</span>
              <Key className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </motion.div>
      )}

      <ManualUnlock 
        isOpen={showManualUnlock}
        onClose={() => setShowManualUnlock(false)}
      />
    </>
  );
};
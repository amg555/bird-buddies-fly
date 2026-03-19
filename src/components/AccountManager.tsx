import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Crown } from 'lucide-react';
import { usePaymentStore } from '@/hooks/usePaymentStore';

interface AccountManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { userPurchase } = usePaymentStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Account
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center py-8">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Account System Coming Soon!
            </h3>
            <p className="text-gray-600 mb-4">
              Optional account creation for cloud saves and cross-device sync will be available soon.
            </p>
            
            {userPurchase.hasLifetimeAccess && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-purple-700 font-semibold">
                  Your lifetime access is active!
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  All characters are unlocked
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
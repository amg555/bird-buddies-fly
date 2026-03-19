import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Key, AlertCircle } from 'lucide-react';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { Button } from '@/components/ui/Button';

interface ManualUnlockProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualUnlock: React.FC<ManualUnlockProps> = ({ isOpen, onClose }) => {
  const { grantLifetimeAccess } = usePaymentStore();
  const [transactionId, setTransactionId] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!transactionId || transactionId.length < 10) {
      setError('Please enter a valid transaction ID');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate verification delay
    setTimeout(() => {
      // In a real app, you would verify with backend
      // For now, we'll accept any transaction ID that looks valid
      if (transactionId.length >= 10) {
        grantLifetimeAccess(transactionId, email);
        setSuccess(true);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        setError('Invalid transaction ID. Please check and try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Unlock Premium Characters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!success ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Already made a payment?</p>
                  <p>Enter your PayU transaction ID below to unlock all characters.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter PayU transaction ID"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleVerify}
                disabled={isVerifying || !transactionId}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Key className="w-5 h-5" />
                    Verify & Unlock
                  </span>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Can't find your transaction ID? Check your PayU payment confirmation email.
            </p>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">All characters have been unlocked!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
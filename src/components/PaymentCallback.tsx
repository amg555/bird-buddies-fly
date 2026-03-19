import React, { useEffect } from 'react';
import { usePhonePe } from '@/hooks/usePhonePe';
import { motion } from 'framer-motion';

interface PaymentCallbackProps {
  onComplete?: () => void;
}

export const PaymentCallback: React.FC<PaymentCallbackProps> = ({ onComplete }) => {
  const { verifyPayment } = usePhonePe();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');

    if (transactionId) {
      verifyPayment(
        transactionId,
        () => {
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            } else {
              window.location.href = window.location.origin;
            }
          }, 3000);
        },
        () => {
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            } else {
              window.location.href = window.location.origin;
            }
          }, 3000);
        }
      );
    } else {
      window.location.href = window.location.origin;
    }
  }, [verifyPayment, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 shadow-2xl text-center"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your purchase</p>
      </motion.div>
    </div>
  );
};
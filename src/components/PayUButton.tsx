import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield } from 'lucide-react';

interface PayUButtonProps {
  className?: string;
  onPaymentInitiated?: () => void;
}

export const PayUButton: React.FC<PayUButtonProps> = ({ 
  className = '', 
  onPaymentInitiated 
}) => {
  const handleClick = () => {
    // Store payment initiation time for tracking
    localStorage.setItem('payuPaymentInitiated', Date.now().toString());
    
    if (onPaymentInitiated) {
      onPaymentInitiated();
    }
    
    // Open PayU payment link in same window
    window.location.href = 'https://u.payu.in/erFiIsZFPjty';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-blue-500 to-purple-600 
        text-white font-bold 
        px-6 py-3 rounded-lg 
        shadow-lg hover:shadow-xl 
        transition-all duration-300
        flex items-center justify-center gap-2
        hover:from-blue-600 hover:to-purple-700
        ${className}
      `}
    >
      <CreditCard className="w-5 h-5" />
      <span>Pay ₹4 with PayU</span>
      <Shield className="w-4 h-4" />
      
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 hover:opacity-10"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Zap, Lock } from 'lucide-react';
import { usePayU } from '@/hooks/usePayU';
import { PAYU_CONFIG } from '@/config/payu';

interface PayUPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayUPaymentModal: React.FC<PayUPaymentModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { initiatePayment, isLoading, error } = usePayU();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handlePayment = () => {
    // Basic validation
    if (!userDetails.email || !userDetails.phone) {
      alert('Please enter email and phone number');
      return;
    }

    initiatePayment(userDetails);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white relative">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Unlock All Characters</h2>
                    <p className="text-white/90 text-sm">One-time payment, lifetime access!</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Price Display */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Special Offer Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-sm">₹999</span>
                      <span className="text-3xl font-bold text-green-600">₹4</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Zap className="w-4 h-4" />
                    <span>Save 99.6% - Limited Time Offer!</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {PAYU_CONFIG.package.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* User Details Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={userDetails.name}
                      onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={userDetails.phone}
                      onChange={(e) => setUserDetails({
                        ...userDetails, 
                        phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="9999999999"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Pay Securely with PayU - ₹4
                    </span>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    100% Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    SSL Encrypted
                  </span>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Powered by PayU - India's trusted payment gateway
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
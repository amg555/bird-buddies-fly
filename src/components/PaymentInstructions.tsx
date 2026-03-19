import React from 'react';
import { motion } from 'framer-motion';
import { Info, CreditCard, Key, CheckCircle, X } from 'lucide-react';

interface PaymentInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            How to Unlock Characters
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Step 1: Make Payment</h3>
              <p className="text-sm text-gray-600">
                Click the "Pay ₹4 with PayU" button to make a secure payment
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Step 2: Complete Payment</h3>
              <p className="text-sm text-gray-600">
                Complete the payment on PayU using UPI, Card, or Net Banking
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
              <Key className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Step 3: Save Transaction ID</h3>
              <p className="text-sm text-gray-600">
                After payment, save your transaction ID from the confirmation email or SMS
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
              <Info className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Step 4: Unlock Characters</h3>
              <p className="text-sm text-gray-600">
                Click the settings icon (⚙️) and enter your transaction ID to unlock all characters
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> Keep your transaction ID safe. You'll need it to unlock characters or restore your purchase on a new device.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Got it!
        </button>
      </motion.div>
    </div>
  );
};
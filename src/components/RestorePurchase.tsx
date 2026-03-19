import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { usePurchaseRecovery } from '@/hooks/usePurchaseRecovery';

interface RestorePurchaseProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const RestorePurchase: React.FC<RestorePurchaseProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const { grantLifetimeAccess } = usePaymentStore();
  const { verifyRecoveryCode } = usePurchaseRecovery();

  const handleRestore = async () => {
    if (!recoveryCode) {
      setError('Please enter your recovery code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await verifyRecoveryCode(recoveryCode);
      
      if (isValid) {
        grantLifetimeAccess(recoveryCode);
        alert('✅ Purchase restored successfully!');
        onSuccess();
      } else {
        setError('Invalid recovery code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 flex-1">
            Restore Purchase
          </h2>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">Using Recovery Code</h3>
            </div>
            
            <input
              type="text"
              placeholder="Enter your recovery code (BB-XXXX-XXXX)"
              value={recoveryCode}
              onChange={(e) => {
                setRecoveryCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
            />
            
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}
            
            <Button
              onClick={handleRestore}
              disabled={isVerifying}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isVerifying ? 'Verifying...' : 'Restore Purchase'}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Lost your recovery code? Contact support with your PhonePe transaction ID
          </p>
        </div>
      </div>
    </motion.div>
  );
};
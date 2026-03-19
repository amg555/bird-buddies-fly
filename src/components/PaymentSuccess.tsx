import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Mail, Smartphone, Download, Shield } from 'lucide-react';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { usePurchaseRecovery } from '@/hooks/usePurchaseRecovery';
import { Button } from '@/components/ui/Button';

interface PaymentSuccessProps {
  transactionId: string;
  onContinue: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  transactionId, 
  onContinue 
}) => {
  const { userPurchase } = usePaymentStore();
  const { generateRecoveryCode, recoveryCode } = usePurchaseRecovery();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [saveMethod, setSaveMethod] = useState<'none' | 'email' | 'sms' | 'screenshot'>('none');

  useEffect(() => {
    // Generate recovery code on mount
    if (!recoveryCode) {
      generateRecoveryCode(transactionId);
    }
  }, [transactionId, generateRecoveryCode, recoveryCode]);

  const handleCopyCode = () => {
    if (recoveryCode) {
      navigator.clipboard.writeText(recoveryCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleEmailSave = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    
    // In production, send email via backend
    console.log('Sending recovery code to:', email);
    alert(`Recovery code will be sent to ${email}`);
    setSaveMethod('email');
  };

  const handleSMSSave = async () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }
    
    // In production, send SMS via backend
    console.log('Sending recovery code to:', phone);
    alert(`Recovery code will be sent to ${phone}`);
    setSaveMethod('sms');
  };

  const handleDownloadReceipt = () => {
    const receipt = `
KADAYADI BIRD - PURCHASE RECEIPT
====================================
Date: ${new Date().toLocaleString('en-IN')}
Transaction ID: ${transactionId}
Amount Paid: ₹4.00
Product: Lifetime Character Access

RECOVERY CODE: ${recoveryCode}
====================================
IMPORTANT: Save this code to recover your purchase!

To recover your purchase on a new device:
1. Open KADAYADI BIRD game
2. Go to Settings > Restore Purchase
3. Enter your recovery code

Thank you for your purchase!
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BirdBuddies-Receipt-${Date.now()}.txt`;
    a.click();
    setSaveMethod('screenshot');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Payment Successful! 🎉
        </h2>
        <p className="text-center text-gray-600 mb-6">
          All characters are now unlocked forever!
        </p>

        {/* Recovery Code Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-800">Your Recovery Code</h3>
          </div>
          
          <div className="bg-white p-3 rounded-lg border-2 border-purple-300 mb-3">
            <code className="text-lg font-mono font-bold text-purple-600 block text-center">
              {recoveryCode}
            </code>
          </div>
          
          <Button
            onClick={handleCopyCode}
            variant="secondary"
            className="w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            {codeCopied ? 'Copied!' : 'Copy Code'}
          </Button>
          
          <p className="text-xs text-purple-700 mt-2">
            ⚠️ Save this code to recover your purchase on any device!
          </p>
        </div>

        {/* Save Options */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-700">Save your recovery code:</h4>
          
          {/* Email Option */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={handleEmailSave}
              variant="secondary"
              disabled={!email || saveMethod === 'email'}
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>

          {/* Phone Option */}
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={10}
            />
            <Button
              onClick={handleSMSSave}
              variant="secondary"
              disabled={!phone || saveMethod === 'sms'}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          {/* Download Receipt */}
          <Button
            onClick={handleDownloadReceipt}
            variant="secondary"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Start Playing!
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          No account needed! Just save your recovery code to restore purchases anytime.
        </p>
      </motion.div>
    </div>
  );
};
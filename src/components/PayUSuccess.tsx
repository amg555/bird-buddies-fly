import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePayU } from '@/hooks/usePayU';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export const PayUSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyPayment } = usePayU();
  
  const txnid = searchParams.get('txnid');
  const status = searchParams.get('status');

  useEffect(() => {
    if (txnid && status) {
      const isSuccess = verifyPayment(txnid, status as 'success' | 'failure');
      
      setTimeout(() => {
        if (isSuccess) {
          navigate('/play', { 
            state: { showSuccess: true } 
          });
        } else {
          navigate('/');
        }
      }, 3000);
    }
  }, [txnid, status, verifyPayment, navigate]);

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md"
      >
        {isSuccess ? (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              All characters have been unlocked!
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: {txnid}
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600">
              Please try again or contact support
            </p>
          </>
        )}
        
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
        </div>
      </motion.div>
    </div>
  );
};
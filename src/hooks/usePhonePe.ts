import { useCallback, useState } from 'react';
import { usePaymentStore } from './usePaymentStore';
import { phonePeService } from '@/services/phonepe.service';

export const usePhonePe = () => {
  const { 
    setProcessingPayment, 
    grantLifetimeAccess, 
    setPendingTransaction 
  } = usePaymentStore();
  
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(async (
    phoneNumber?: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    setProcessingPayment(true);
    setError(null);

    try {
      const result = await phonePeService.initiatePayment(phoneNumber);
      
      if (result.success && result.redirectUrl) {
        setPendingTransaction(result.merchantTransactionId || null);
        
        // Redirect to PhonePe payment page
        window.location.href = result.redirectUrl;
      } else {
        const errorMsg = result.error || 'Failed to initiate payment';
        setError(errorMsg);
        setProcessingPayment(false);
        
        if (onError) {
          onError(errorMsg);
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Payment initiation failed';
      setError(errorMsg);
      setProcessingPayment(false);
      
      if (onError) {
        onError(errorMsg);
      }
    }
  }, [setProcessingPayment, setPendingTransaction]);

  const verifyPayment = useCallback(async (
    merchantTransactionId: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      const result = await phonePeService.checkPaymentStatus(merchantTransactionId);
      
      if (result.success) {
        // Grant lifetime access
        grantLifetimeAccess(result.transactionId || merchantTransactionId);
        setProcessingPayment(false);
        
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } else {
        const errorMsg = result.error || 'Payment verification failed';
        setError(errorMsg);
        setProcessingPayment(false);
        
        if (onError) {
          onError(errorMsg);
        }
        
        return false;
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Payment verification failed';
      setError(errorMsg);
      setProcessingPayment(false);
      
      if (onError) {
        onError(errorMsg);
      }
      
      return false;
    }
  }, [grantLifetimeAccess, setProcessingPayment]);

  return {
    initiatePayment,
    verifyPayment,
    error
  };
};
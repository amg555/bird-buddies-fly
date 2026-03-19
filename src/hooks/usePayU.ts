import { useCallback, useState } from 'react';
import { usePaymentStore } from './usePaymentStore';
import { payuService } from '@/services/payu.service';

export const usePayU = () => {
  const { 
    setProcessingPayment, 
    grantLifetimeAccess, 
    setPendingTransaction 
  } = usePaymentStore();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = useCallback(async (
    userDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = payuService.createPaymentForm(userDetails);
      setPendingTransaction(formData.txnid);
      
      // Create and submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.payu.in/_payment';
      
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      const errorMsg = error.message || 'Payment initiation failed';
      setError(errorMsg);
      setIsLoading(false);
    }
  }, [setPendingTransaction]);

  const verifyPayment = useCallback((
    txnid: string,
    status: 'success' | 'failure'
  ) => {
    if (status === 'success' && payuService.verifyTransaction(txnid)) {
      grantLifetimeAccess(txnid);
      localStorage.removeItem('pendingPayUTransaction');
      return true;
    }
    return false;
  }, [grantLifetimeAccess]);

  return {
    initiatePayment,
    verifyPayment,
    error,
    isLoading
  };
};
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { PHONEPE_CONFIG } from '@/config/phonepe';
import { PhonePeResponse } from '@/types';

class PhonePeService {
  private generateChecksum(payload: string): string {
    const saltKey = PHONEPE_CONFIG.saltKey;
    const saltIndex = PHONEPE_CONFIG.saltIndex;
    
    const string = payload + '/pg/v1/pay' + saltKey;
    const sha256 = CryptoJS.SHA256(string).toString();
    return sha256 + '###' + saltIndex;
  }

  private base64Encode(data: object): string {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  }

  async initiatePayment(userPhone?: string): Promise<{ 
    success: boolean; 
    redirectUrl?: string; 
    merchantTransactionId?: string;
    error?: string;
  }> {
    try {
      const merchantTransactionId = 'BB_' + uuidv4().replace(/-/g, '').substring(0, 20);
      const userId = 'USER_' + Date.now();

      const paymentPayload = {
        merchantId: PHONEPE_CONFIG.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId,
        amount: PHONEPE_CONFIG.amount,
        redirectUrl: PHONEPE_CONFIG.redirectUrl + `?id=${merchantTransactionId}`,
        redirectMode: 'REDIRECT',
        callbackUrl: PHONEPE_CONFIG.callbackUrl,
        mobileNumber: userPhone || '',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = this.base64Encode(paymentPayload);
      const checksum = this.generateChecksum(base64Payload);

      const response = await axios.post(
        `${PHONEPE_CONFIG.apiUrl}/pg/v1/pay`,
        {
          request: base64Payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
          }
        }
      );

      const data = response.data as PhonePeResponse;
      
      if (data.success && data.data) {
        localStorage.setItem('pendingTransaction', merchantTransactionId);
        
        // Handle different response formats from PhonePe
        let redirectUrl: string | undefined;
        
        if (data.data.instrumentResponse?.redirectInfo?.url) {
          redirectUrl = data.data.instrumentResponse.redirectInfo.url;
        } else if ((data.data as any).redirectUrl) {
          redirectUrl = (data.data as any).redirectUrl;
        }
        
        return {
          success: true,
          redirectUrl,
          merchantTransactionId
        };
      }

      return {
        success: false,
        error: data.message || 'Payment initiation failed'
      };
    } catch (error: any) {
      console.error('PhonePe payment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Payment failed'
      };
    }
  }

  async checkPaymentStatus(merchantTransactionId: string): Promise<{
    success: boolean;
    status?: string;
    transactionId?: string;
    error?: string;
  }> {
    try {
      const checksum = this.generateStatusChecksum(merchantTransactionId);
      
      const response = await axios.get(
        `${PHONEPE_CONFIG.apiUrl}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId
          }
        }
      );

      const data = response.data as PhonePeResponse;
      
      if (data.success && data.data) {
        return {
          success: data.data.state === 'COMPLETED',
          status: data.data.state,
          transactionId: data.data.transactionId
        };
      }

      return {
        success: false,
        error: data.message || 'Status check failed'
      };
    } catch (error: any) {
      console.error('Payment status check error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private generateStatusChecksum(merchantTransactionId: string): string {
    const saltKey = PHONEPE_CONFIG.saltKey;
    const saltIndex = PHONEPE_CONFIG.saltIndex;
    
    const string = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = CryptoJS.SHA256(string).toString();
    return sha256 + '###' + saltIndex;
  }
}

export const phonePeService = new PhonePeService();
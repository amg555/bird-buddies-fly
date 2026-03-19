// PhonePe Configuration
// For production, use environment variables and handle sensitive data on backend

export const PHONEPE_CONFIG = {
  // Sandbox/UAT credentials for testing
  merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT',
  saltKey: import.meta.env.VITE_PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
  saltIndex: import.meta.env.VITE_PHONEPE_SALT_INDEX || '1',
  
  // URLs
  apiUrl: import.meta.env.VITE_PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  redirectUrl: window.location.origin + '/payment/callback',
  callbackUrl: import.meta.env.VITE_PHONEPE_CALLBACK_URL || window.location.origin + '/api/payment/callback',
  
  // Payment details
  amount: 400, // Amount in paise (₹4 = 400 paise)
  currency: 'INR',
  paymentDescription: 'KADAYADI BIRD - Unlock All Characters (Lifetime Access)',
  
  // Lifetime access package details
  package: {
    name: 'Premium Characters Bundle',
    description: 'Unlock all 7 premium characters forever!',
    features: [
      '🎮 7 Premium Characters',
      '🎵 Unique Sound Effects',
      '⚡ Lifetime Access',
      '🆓 Future Characters Included',
      '💯 One-time Payment'
    ],
    originalPrice: 9999, // Show as discounted from ₹9.99
    offerPrice: 400, // ₹4.00
    savings: 60 // 60% off
  }
};

// PhonePe Payment Methods
export const PAYMENT_METHODS = {
  UPI: 'UPI',
  CARD: 'CARD',
  NET_BANKING: 'NET_BANKING',
  WALLET: 'WALLET'
};
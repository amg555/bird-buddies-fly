// PayU Payment Button Configuration for kadayadibird.vercel.app
export const PAYU_CONFIG = {
  // PayU Payment Button settings
  merchantKey: import.meta.env.VITE_PAYU_MERCHANT_KEY || 'your-merchant-key',
  merchantSalt: import.meta.env.VITE_PAYU_MERCHANT_SALT || 'your-merchant-salt',
  
  // Payment details
  amount: 4.00, // Amount in INR
  currency: 'INR',
  productInfo: 'KADAYADI BIRD - Unlock All Characters',
  firstName: 'Player',
  email: 'player@kadayadibird.com',
  phone: '9999999999',
  
  // URLs for kadayadibird.vercel.app
  urls: {
    successUrl: 'https://kadayadibird.vercel.app/payment/success',
    failureUrl: 'https://kadayadibird.vercel.app/payment/failure',
    cancelUrl: 'https://kadayadibird.vercel.app/payment/failure',
    notifyUrl: 'https://kadayadibird.vercel.app/payment/callback'
  },
  
  // PayU endpoints
  payuEndpoints: {
    test: 'https://test.payu.in/_payment',
    production: 'https://secure.payu.in/_payment'
  },
  
  // Use production mode for live site
  isProduction: import.meta.env.VITE_PAYU_PRODUCTION === 'true',
  
  // Package details
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
    originalPrice: 999,
    offerPrice: 4,
    savings: 99.6
  }
};
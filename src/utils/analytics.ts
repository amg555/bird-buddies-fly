// src/utils/analytics.ts
export const trackPerformance = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    // Send to analytics
    console.log('Connection Type:', connection.effectiveType);
    console.log('Downlink:', connection.downlink);
    
    // Adjust quality based on connection
    if (connection.effectiveType === '2g' || connection.downlink < 1) {
      // Reduce asset quality for slow connections
      console.log('Slow connection detected');
    }
  }
};
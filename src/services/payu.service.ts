import { PAYU_CONFIG } from '@/config/payu';
import { v4 as uuidv4 } from 'uuid';

interface PayUFormData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash?: string;
}

class PayUService {
  private generateTransactionId(): string {
    return 'TXN_' + uuidv4().replace(/-/g, '').substring(0, 20);
  }

  createPaymentForm(userDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  }): PayUFormData {
    const txnid = this.generateTransactionId();
    
    const formData: PayUFormData = {
      key: PAYU_CONFIG.merchantKey,
      txnid: txnid,
      amount: PAYU_CONFIG.amount.toFixed(2),
      productinfo: PAYU_CONFIG.productInfo,
      firstname: userDetails?.name || PAYU_CONFIG.firstName,
      email: userDetails?.email || PAYU_CONFIG.email,
      phone: userDetails?.phone || PAYU_CONFIG.phone,
      surl: PAYU_CONFIG.successUrl,
      furl: PAYU_CONFIG.failureUrl
    };

    // Store transaction ID for verification
    localStorage.setItem('pendingPayUTransaction', txnid);
    
    return formData;
  }

  generatePaymentButton(): string {
    const txnid = this.generateTransactionId();
    
    // PayU Payment Button HTML
    return `
      <form action="https://secure.payu.in/_payment" method="post" id="payu-form">
        <input type="hidden" name="key" value="${PAYU_CONFIG.merchantKey}" />
        <input type="hidden" name="txnid" value="${txnid}" />
        <input type="hidden" name="amount" value="${PAYU_CONFIG.amount}" />
        <input type="hidden" name="productinfo" value="${PAYU_CONFIG.productInfo}" />
        <input type="hidden" name="firstname" value="${PAYU_CONFIG.firstName}" />
        <input type="hidden" name="email" value="${PAYU_CONFIG.email}" />
        <input type="hidden" name="phone" value="${PAYU_CONFIG.phone}" />
        <input type="hidden" name="surl" value="${PAYU_CONFIG.successUrl}" />
        <input type="hidden" name="furl" value="${PAYU_CONFIG.failureUrl}" />
      </form>
    `;
  }

  verifyTransaction(txnid: string): boolean {
    const storedTxnId = localStorage.getItem('pendingPayUTransaction');
    return storedTxnId === txnid;
  }
}

export const payuService = new PayUService();
import React from 'react';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { Crown, Calendar, CreditCard, Smartphone } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { userPurchase } = usePaymentStore();

  if (!userPurchase.hasLifetimeAccess) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Crown className="w-6 h-6 text-yellow-500" />
        Premium Member
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold">
              {userPurchase.purchaseDate 
                ? new Date(userPurchase.purchaseDate).toLocaleDateString('en-IN')
                : 'Lifetime'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-semibold">{userPurchase.paymentMethod || 'PhonePe'}</p>
          </div>
        </div>

        {userPurchase.phoneNumber && (
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Registered Phone</p>
              <p className="font-semibold">
                {userPurchase.phoneNumber.replace(/(\d{2})\d{6}(\d{2})/, '$1****$2')}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-green-600 font-semibold">✓ Lifetime Access Active</p>
          <p className="text-sm text-gray-600 mt-1">
            All current and future characters unlocked forever!
          </p>
        </div>
      </div>
    </div>
  );
};
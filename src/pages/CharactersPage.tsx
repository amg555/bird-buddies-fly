// D:\PROJECTS\GAME\birdy-buddies-fly\src\components\CharacterSelection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles, Gift, ChevronRight } from 'lucide-react';
import { Character } from '@/types';
import { CHARACTERS } from '@/constants/characters';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { usePhonePe } from '@/hooks/usePhonePe';
import { Button } from '@/components/ui/Button';
import { PHONEPE_CONFIG } from '@/config/phonepe';

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onCharacterSelect }) => {
  const { userPurchase, isProcessingPayment } = usePaymentStore();
  const { initiatePayment, verifyPayment } = usePhonePe();
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [selectedLockedCharacter, setSelectedLockedCharacter] = useState<Character | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Check for payment callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    
    if (transactionId) {
      // Verify the payment
      verifyPayment(
        transactionId,
        () => {
          // Success - show success message
          alert('🎉 Payment successful! All characters are now unlocked forever!');
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        },
        (error) => {
          alert(`Payment verification failed: ${error}`);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      );
    }
  }, [verifyPayment]);

  const handleCharacterClick = (character: Character) => {
    const isUnlocked = character.isFree || userPurchase.hasLifetimeAccess;
    
    if (isUnlocked) {
      onCharacterSelect(character);
    } else {
      setSelectedLockedCharacter(character);
      setShowUnlockPrompt(true);
    }
  };

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!number) {
      setPhoneError('Phone number is optional but recommended');
      return true; // Optional field
    }
    if (!phoneRegex.test(number)) {
      setPhoneError('Please enter a valid 10-digit Indian phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleUnlockAll = () => {
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      return;
    }

    initiatePayment(
      phoneNumber || undefined,
      () => {
        // Payment page will redirect back
        console.log('Redirecting to PhonePe...');
      },
      (error) => {
        alert(`Payment failed: ${error}`);
      }
    );
  };

  const freeCharactersCount = CHARACTERS.filter(c => c.isFree).length;
  const lockedCharactersCount = CHARACTERS.filter(c => !c.isFree).length;
  const { package: pkg } = PHONEPE_CONFIG;

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 sm:p-8 overflow-auto">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-4 sm:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
          KADAYADI BIRD!
        </h1>
        <p className="text-lg sm:text-xl text-white/80">Choose your character to start flying</p>
        
        {!userPurchase.hasLifetimeAccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 px-4 py-3 rounded-lg inline-block shadow-lg"
          >
            <p className="font-bold text-lg">
              🎮 {freeCharactersCount} Free | 🔒 {lockedCharactersCount} Premium
            </p>
            <p className="text-sm font-semibold">
              One-time payment ₹{pkg.offerPrice / 100} - Lifetime Access!
            </p>
            <p className="text-xs opacity-75">
              Save {pkg.savings}% (₹{pkg.originalPrice / 100} → ₹{pkg.offerPrice / 100})
            </p>
          </motion.div>
        )}

        {userPurchase.hasLifetimeAccess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg inline-block shadow-lg"
          >
            <p className="font-bold text-lg flex items-center gap-2">
              <Crown className="w-6 h-6" />
              Lifetime Premium Member
            </p>
            <p className="text-sm opacity-90">All characters unlocked forever!</p>
          </motion.div>
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {CHARACTERS.map((character, index) => {
          const isUnlocked = character.isFree || userPurchase.hasLifetimeAccess;
          
          return (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-white/90 rounded-lg p-3 sm:p-4 cursor-pointer shadow-lg hover:shadow-xl transition-all ${
                !isUnlocked ? 'opacity-90' : ''
              }`}
              onClick={() => handleCharacterClick(character)}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
                  <Lock className="w-8 h-8 text-white animate-pulse" />
                </div>
              )}

              {character.isFree ? (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-20 font-bold">
                  FREE
                </span>
              ) : userPurchase.hasLifetimeAccess ? (
                <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full z-20">
                  <Sparkles className="w-3 h-3 inline" />
                </span>
              ) : (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full z-20">
                  <Crown className="w-3 h-3 inline" />
                </span>
              )}

              <img
                src={character.imagePath}
                alt={character.name}
                className={`w-full h-20 sm:h-24 md:h-32 object-contain mb-2 sm:mb-3 ${
                  !isUnlocked ? 'filter grayscale' : ''
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = `w-full h-20 sm:h-24 md:h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded flex items-center justify-center text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3 ${
                      !isUnlocked ? 'filter grayscale' : ''
                    }`;
                    fallback.textContent = character.name[0];
                    parent.insertBefore(fallback, target);
                  }
                }}
              />
              <h3 className="font-bold text-gray-800 text-center text-sm sm:text-base">
                {character.name}
              </h3>
              <p className="text-xs text-gray-600 text-center mt-1 hidden sm:block">
                {character.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {!userPurchase.hasLifetimeAccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button
            onClick={() => setShowUnlockPrompt(true)}
            disabled={isProcessingPayment}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all text-lg"
          >
            <Gift className="w-6 h-6 mr-2 inline" />
            Get Lifetime Access - ₹{pkg.offerPrice / 100} Only!
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4 sm:mt-8 text-white/70 text-xs sm:text-sm"
      >
        <p>🎮 Tap on a character to start playing!</p>
        <p className="mt-1 sm:mt-2">Use Space/Click/Tap to jump and avoid the pipes!</p>
      </motion.div>

      {/* Unlock Prompt Modal with PhonePe */}
      {showUnlockPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center">
              {/* Special Offer Badge */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full inline-block mb-4 animate-pulse">
                <span className="font-bold">LIMITED TIME OFFER!</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                🎮 Unlock Premium Bundle
              </h2>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg mb-4">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-gray-500 line-through text-lg">₹{pkg.originalPrice / 100}</span>
                  <span className="text-3xl font-bold text-purple-600">₹{pkg.offerPrice / 100}</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {pkg.savings}% OFF
                  </span>
                </div>
                <p className="text-purple-700 font-bold">LIFETIME ACCESS</p>
                <p className="text-sm text-gray-600 mt-1">One-time payment, play forever!</p>
                                  </div>

              {/* Features */}
              <div className="text-left mb-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                {pkg.features.map((feature, idx) => (
                  <p key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✓</span> {feature}
                  </p>
                ))}
              </div>

              {/* Phone Number Input (Optional) */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2 text-left">
                  Phone Number (Optional - for order updates)
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                    setPhoneError('');
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    phoneError && phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={10}
                />
                {phoneError && (
                  <p className="text-xs text-red-500 mt-1 text-left">{phoneError}</p>
                )}
              </div>

              {/* PhonePe Badge */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <img 
                  src="https://cdn.phonepe.com/v1/media/phonepe-logo.svg" 
                  alt="PhonePe" 
                  className="h-8"
                />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleUnlockAll}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3"
                >
                  {isProcessingPayment ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      Pay with PhonePe
                      <ChevronRight className="w-4 h-4 ml-1 inline" />
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowUnlockPrompt(false);
                    setPhoneNumber('');
                    setPhoneError('');
                  }}
                  variant="secondary"
                  className="px-6"
                  disabled={isProcessingPayment}
                >
                  Later
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                🔒 100% Secure Payment via PhonePe UPI
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: UPI, Cards, Net Banking & Wallets
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Add default export at the end
export default CharacterSelection;
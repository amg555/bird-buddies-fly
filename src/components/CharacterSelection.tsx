import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles, Gift, CreditCard, HelpCircle, Settings } from 'lucide-react';
import { Character } from '@/types';
import { CHARACTERS } from '@/constants/characters';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { PayUButton } from '@/components/PayUButton';
import { Button } from '@/components/ui/Button';
import { PaymentInstructions } from '@/components/PaymentInstructions';
import { ManualUnlock } from '@/components/ManualUnlock';

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onCharacterSelect }) => {
  const { userPurchase, hasLifetimeAccess } = usePaymentStore();
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [selectedLockedCharacter, setSelectedLockedCharacter] = useState<Character | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showManualUnlock, setShowManualUnlock] = useState(false);

  // Check if returning from payment
  useEffect(() => {
    const paymentInitiated = localStorage.getItem('payuPaymentInitiated');
    if (paymentInitiated) {
      const initiatedTime = parseInt(paymentInitiated);
      const currentTime = Date.now();
      const timeDiff = currentTime - initiatedTime;
      
      // If less than 5 minutes have passed, show payment info
      if (timeDiff < 5 * 60 * 1000) {
        setShowPaymentInfo(true);
        localStorage.removeItem('payuPaymentInitiated');
      }
    }
  }, []);

  const handleCharacterClick = (character: Character) => {
    const isUnlocked = character.isFree || hasLifetimeAccess();
    
    if (isUnlocked) {
      onCharacterSelect(character);
    } else {
      setSelectedLockedCharacter(character);
      setShowUnlockPrompt(true);
    }
  };

  const handlePaymentInitiated = () => {
    // Track payment initiation
    console.log('Payment initiated via PayU');
  };

  const freeCharactersCount = CHARACTERS.filter(c => c.isFree).length;
  const lockedCharactersCount = CHARACTERS.filter(c => !c.isFree).length;

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 sm:p-8 overflow-auto">
      {/* Settings Button */}
      <button
        onClick={() => setShowManualUnlock(true)}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors"
        title="Unlock with Transaction ID"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-4 sm:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
          KADAYADI BIRD!
        </h1>
        <p className="text-lg sm:text-xl text-white/80">Choose your character to start flying</p>
        
        {!hasLifetimeAccess() && (
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
              One-time payment ₹4 - Lifetime Access!
            </p>
            <p className="text-xs opacity-75">
              Save 99.6% (₹999 → ₹4)
            </p>
          </motion.div>
        )}

        {hasLifetimeAccess() && (
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

      {/* Payment Info Banner */}
      {showPaymentInfo && !hasLifetimeAccess() && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4"
        >
          <p className="text-sm text-gray-800">
            <strong>Payment Instructions:</strong> After completing payment on PayU, you'll receive a confirmation email with your transaction ID. 
            Click the settings icon (⚙️) above and enter your transaction ID to unlock all characters.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowManualUnlock(true)}
              className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
            >
              Enter Transaction ID
            </button>
            <button
              onClick={() => setShowPaymentInfo(false)}
              className="text-xs text-gray-600 underline"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {CHARACTERS.map((character, index) => {
          const isUnlocked = character.isFree || hasLifetimeAccess();
          
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
              ) : hasLifetimeAccess() ? (
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

      {!hasLifetimeAccess() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <PayUButton 
            className="text-lg px-8 py-4"
            onPaymentInitiated={handlePaymentInitiated}
          />
          <div className="mt-3 space-y-2">
            <button
              onClick={() => setShowInstructions(true)}
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 mx-auto"
            >
              <HelpCircle className="w-4 h-4" />
              How to unlock characters?
            </button>
            <button
              onClick={() => setShowManualUnlock(true)}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Already paid? Enter transaction ID
            </button>
          </div>
          <p className="text-white/70 text-sm mt-2">
            🔒 100% Secure Payment via PayU
          </p>
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

      {/* Unlock Prompt Modal */}
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

              {selectedLockedCharacter && (
                <p className="text-sm text-gray-600 mb-3">
                  Unlock <strong>{selectedLockedCharacter.name}</strong> and all other premium characters!
                </p>
              )}

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg mb-4">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-gray-500 line-through text-lg">₹999</span>
                  <span className="text-3xl font-bold text-purple-600">₹4</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    99.6% OFF
                  </span>
                </div>
                <p className="text-purple-700 font-bold">LIFETIME ACCESS</p>
                <p className="text-sm text-gray-600 mt-1">One-time payment, play forever!</p>
              </div>

              {/* Features */}
              <div className="text-left mb-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 🎮 7 Premium Characters
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 🎵 Unique Sound Effects
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> ⚡ Lifetime Access
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 🆓 Future Characters Included
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 💯 One-time Payment
                </p>
              </div>

              {/* PayU Payment Section */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Secure Payment via PayU</span>
                </div>
                
                <PayUButton 
                  className="w-full"
                  onPaymentInitiated={() => {
                    handlePaymentInitiated();
                    setShowUnlockPrompt(false);
                  }}
                />
                
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Supports: UPI, Cards, Net Banking & Wallets
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowInstructions(true)}
                  variant="secondary"
                  className="flex-1"
                >
                  How it works?
                </Button>
                <Button
                  onClick={() => {
                    setShowUnlockPrompt(false);
                    setShowManualUnlock(true);
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Already paid?
                </Button>
              </div>

              <Button
                onClick={() => {
                  setShowUnlockPrompt(false);
                }}
                variant="secondary"
                className="w-full mt-2"
              >
                Maybe Later
              </Button>

              <p className="text-xs text-gray-500 mt-3">
                🔒 100% Secure Payment • SSL Encrypted
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Instructions Modal */}
      <PaymentInstructions 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      {/* Manual Unlock Modal */}
      <ManualUnlock 
        isOpen={showManualUnlock}
        onClose={() => setShowManualUnlock(false)}
      />

      {/* Development Test Buttons (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-white/90 p-2 rounded-lg shadow-lg">
          <p className="text-xs text-gray-600 mb-1">Dev Tools:</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const { grantLifetimeAccess } = usePaymentStore.getState();
                grantLifetimeAccess('TEST_TXN_' + Date.now());
                window.location.reload();
              }}
              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              disabled={hasLifetimeAccess()}
            >
              Test Unlock
            </button>
            <button
              onClick={() => {
                const { clearPurchaseData } = usePaymentStore.getState();
                clearPurchaseData();
                window.location.reload();
              }}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              disabled={!hasLifetimeAccess()}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
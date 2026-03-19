// src/components/HeaderMenu.tsx
import React, { useState, useEffect } from 'react';
import { User, Settings, Crown, Coffee, Heart, Sparkles, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { AccountManager } from './AccountManager';
import { GameSettings } from './GameSettings';
import { DonationModal } from './DonationModal';

export const HeaderMenu: React.FC = () => {
  const [showAccount, setShowAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDonationTooltip, setShowDonationTooltip] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { userPurchase } = usePaymentStore();

  // Your actual donation link
  const DONATION_LINK = 'https://razorpay.me/@megafinds618';

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show tooltip after a delay for first-time visitors
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('donation-tooltip-seen');
    if (!hasSeenTooltip && window.innerWidth > 768) { // Only show on desktop
      const timer = setTimeout(() => {
        setShowDonationTooltip(true);
        setTimeout(() => {
          setShowDonationTooltip(false);
          localStorage.setItem('donation-tooltip-seen', 'true');
        }, 5000);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setPulseAnimation(false);
    }
  }, []);

  const handleDonation = () => {
    setShowDonationTooltip(false);
    setPulseAnimation(false);
    setShowDonationModal(true);
    setShowMobileMenu(false);
  };

  const handleDonationConfirm = () => {
    setShowDonationModal(false);
    window.open(DONATION_LINK, '_blank', 'noopener,noreferrer');
  };

  const handleAccountClick = () => {
    setShowAccount(true);
    setShowMobileMenu(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <div className={`
        hidden md:flex 
        fixed top-0 right-0 
        p-4 
        gap-2 
        z-40 
        transition-all duration-300
        ${isScrolled ? 'bg-white/10 backdrop-blur-md' : ''}
      `}>
        {/* Enhanced Buy me a cookie button - Desktop */}
        <div className="relative">
          {/* Tooltip */}
          {showDonationTooltip && (
            <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-white rounded-lg shadow-xl border-2 border-orange-400 animate-fade-in z-50">
              <div className="absolute -top-2 right-8 w-4 h-4 bg-white border-l-2 border-t-2 border-orange-400 transform rotate-45"></div>
              <p className="text-sm text-gray-700 font-medium">
                <span className="text-orange-500 font-bold">Love the game?</span> 
                <br />Support development with a small donation! 
                <span className="inline-block ml-1">☕</span>
              </p>
            </div>
          )}
          
          <button
            onClick={handleDonation}
            onMouseEnter={() => !localStorage.getItem('donation-tooltip-seen') && setShowDonationTooltip(true)}
            onMouseLeave={() => setShowDonationTooltip(false)}
            className={`
              donation-button
              px-5 py-2.5 
              bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400
              text-white 
              rounded-full 
              shadow-lg 
              hover:shadow-xl
              hover:from-orange-500 hover:via-yellow-500 hover:to-orange-500
              transition-all 
              transform hover:scale-105 
              flex items-center gap-2 
              font-bold
              relative
              overflow-hidden
              ${pulseAnimation ? 'animate-pulse-slow' : ''}
              border-2 border-white/30
              backdrop-blur-sm
            `}
            title="Support the developer - Buy me a cookie!"
          >
            <Sparkles className="w-4 h-4 absolute -top-1 -left-1 text-yellow-200 animate-sparkle" />
            <Sparkles className="w-3 h-3 absolute -bottom-1 -right-1 text-yellow-200 animate-sparkle-delay" />
            
            <div className="flex items-center gap-2 relative z-10">
              <Heart className="w-5 h-5 animate-heartbeat" fill="currentColor" />
              <span className="text-sm font-bold tracking-wide">Buy me a cookie</span>
              <span className="text-xl animate-cookie-float">🍪</span>
            </div>

            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>

          {pulseAnimation && (
            <div className="absolute -top-2 -right-2 pointer-events-none">
              <Heart className="w-4 h-4 text-red-400 animate-float-up opacity-0" fill="currentColor" />
            </div>
          )}
        </div>

        <button
          onClick={handleAccountClick}
          className={`
            p-2.5 
            rounded-lg 
            shadow-lg 
            transition-all 
            backdrop-blur-sm
            ${isAuthenticated 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-700'
            }
          `}
          title={isAuthenticated ? 'My Account' : 'Sign In / Sign Up'}
        >
          <User className="w-6 h-6" />
          {isAuthenticated && userPurchase.hasLifetimeAccess && (
            <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
          )}
        </button>

        <button
          onClick={handleSettingsClick}
          className="p-2.5 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-all backdrop-blur-sm"
        >
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Header */}
      <div className={`
        md:hidden 
        fixed top-0 left-0 right-0 
        p-3 
        z-40 
        transition-all duration-300
        ${isScrolled || showMobileMenu ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}
      `}>
        <div className="flex justify-between items-center">


          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="fixed top-[50px] p-2 bg-white/90 rounded-lg shadow-md backdrop-blur-sm"
          >
            {showMobileMenu ? (
              <X className="w-6 h-5 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg mt-2 mx-3 rounded-lg overflow-hidden">
            <button
              onClick={handleAccountClick}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">
                {isAuthenticated ? 'My Account' : 'Sign In / Sign Up'}
              </span>
              {isAuthenticated && userPurchase.hasLifetimeAccess && (
                <Crown className="w-4 h-4 text-yellow-400 ml-auto" />
              )}
            </button>

            <button
              onClick={handleSettingsClick}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Settings</span>
            </button>

            <button
              onClick={handleDonation}
              className="w-full p-4 flex items-center gap-3 hover:bg-orange-50 transition-colors border-t border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50"
            >
              <Coffee className="w-5 h-5 text-orange-600" />
              <span className="text-orange-600 font-bold">Buy me a cookie</span>
              <span className="text-lg ml-auto">🍪</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Mobile CTA - Only show when not in menu */}
      {!showMobileMenu && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
          <button
            onClick={handleDonation}
            className="
              w-full 
              bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400
              text-white 
              py-3 px-4 
              rounded-full 
              shadow-lg 
              flex items-center justify-center gap-2 
              font-bold
              animate-pulse-slow
            "
          >
            <Heart className="w-5 h-5 animate-heartbeat" fill="currentColor" />
            <span className="text-sm">Love the game? Buy me a cookie!</span>
            <span className="text-lg">🍪</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AccountManager 
        isOpen={showAccount} 
        onClose={() => setShowAccount(false)} 
      />

      {showSettings && (
        <GameSettings onClose={() => setShowSettings(false)} />
      )}

      <DonationModal 
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onDonate={handleDonationConfirm}
      />
    </>
  );
};
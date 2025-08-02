import React, { useState, useEffect } from "react";

export default function NFTCard({ nft, onBuyClick }) {
  const [timeLeft, setTimeLeft] = useState(nft.timeLeft);

  // Simple countdown effect for demo purposes
  useEffect(() => {
    if (nft.timeLeft) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (!prevTime) return null;
          
          // Parse time in format "HH:MM"
          const [hours, minutes] = prevTime.split(':').map(Number);
          let totalMinutes = hours * 60 + minutes;
          
          if (totalMinutes <= 1) {
            clearInterval(interval);
            return null;
          }
          
          totalMinutes -= 1;
          const newHours = Math.floor(totalMinutes / 60);
          const newMinutes = totalMinutes % 60;
          
          return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        });
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [nft.timeLeft]);

  return (
    <div className="group bg-white/50 dark:bg-brand-navy/20 rounded-xl overflow-hidden border border-brand-navy/10 dark:border-brand-pale/10 hover:shadow-lg transition-all duration-300 relative">
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out"
        />
        {nft.rarity && (
          <div className="absolute top-1 left-1 flex items-center space-x-1 bg-gradient-to-r from-brand-sky/90 to-brand-navy/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-white/20">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">{nft.rarity}</span>
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <h3 className="font-semibold text-brand-navy dark:text-brand-pale mb-2 truncate">{nft.name}</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-500 dark:text-zinc-300">Price</span>
            <span className="font-bold text-brand-navy dark:text-brand-pale">{nft.price}</span>
          </div>
          {timeLeft && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 dark:text-zinc-300">Starts in</span>
              <span className="text-sm text-red-500 font-medium">{timeLeft}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Button - Slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/50 dark:bg-brand-navy/20 border-t border-brand-navy/10 dark:border-brand-pale/10 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        {timeLeft ? (
          <button 
            onClick={() => onBuyClick && onBuyClick(nft)}
            className="w-full py-2 bg-brand-sky hover:bg-brand-navy text-white font-medium rounded-lg transition-colors"
          >
            Make offer
          </button>
        ) : (
          <button 
            onClick={() => onBuyClick && onBuyClick(nft)}
            className="w-full py-2 bg-brand-sky hover:bg-brand-navy text-white font-medium rounded-lg transition-colors"
          >
            Buy now
          </button>
        )}
      </div>
    </div>
  );
} 
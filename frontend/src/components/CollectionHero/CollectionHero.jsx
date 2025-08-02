import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

export default function CollectionHero({ collection }) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        {/* Image with fallback and loading optimization */}
        <img
          src={collection.heroImage}
          alt={collection.name}
          className="w-full h-full object-cover object-center"
          loading="eager"
          onError={(e) => {
            e.target.src = '/fallback-hero.jpg'; // Fallback image
          }}
        />
        
        {/* Video support (if collection has video) */}
        {collection.heroVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            poster={collection.heroImage} // Fallback image while video loads
          >
            <source src={collection.heroVideo} type="video/mp4" />
            <source src={collection.heroVideo} type="video/webm" />
          </video>
        )}
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Optional: Additional overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* Collection Info Overlay - Bottom Left */}
      <div className="absolute bottom-6 left-6 flex items-end space-x-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
          <img
            src={collection.profileImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            {collection.verified && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span>BY {collection.creator}</span>
            <span className="flex items-center">
              <FontAwesomeIcon icon={faEthereum} className="w-4 h-4 mr-1" />
              {collection.blockchain}
            </span>
            <span>{collection.totalItems}</span>
            <span>{collection.launchDate}</span>
            <span>{collection.category}</span>
          </div>
        </div>
      </div>

      {/* Price Stats Overlay - Bottom Right */}
      <div className="absolute bottom-6 right-6 text-white">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-gray-300">FLOOR PRICE</div>
            <div className="font-bold text-lg">{collection.floorPrice}</div>
            <div className="text-green-400">{collection.floorChange}</div>
          </div>
          <div>
            <div className="text-gray-300">TOP OFFER</div>
            <div className="font-bold text-lg">{collection.topOffer}</div>
          </div>
          <div>
            <div className="text-gray-300">24H VOLUME</div>
            <div className="font-bold text-lg">{collection.volume24h}</div>
          </div>
          <div>
            <div className="text-gray-300">TOTAL VOLUME</div>
            <div className="font-bold text-lg">{collection.totalVolume}</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-300">OWNERS (UNIQUE)</div>
            <div className="font-bold text-lg">{collection.owners} ({collection.uniqueOwners})</div>
          </div>
        </div>
      </div>
    </section>
  );
} 
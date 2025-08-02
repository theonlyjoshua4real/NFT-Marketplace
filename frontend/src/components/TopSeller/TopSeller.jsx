import React from "react";
import { images } from '../../assets/images/images';

// Mock data for top sellers - you can replace with real data later
const topSellers = [
  {
    id: 1,
    name: "CryptoArtist_01",
    avatar: images.thumbnail1,
    sales: "2.4k"
  },
  {
    id: 2,
    name: "DigitalDreamer",
    avatar: images.thumbnail2,
    sales: "1.8k"
  },
  {
    id: 3,
    name: "NFTMaster",
    avatar: images.thumbnail3,
    sales: "3.1k"
  },
  {
    id: 4,
    name: "ArtCollector",
    avatar: images.thumbnail4,
    sales: "1.5k"
  },
  {
    id: 5,
    name: "BlockchainArt",
    avatar: images.thumbnail1,
    sales: "2.7k"
  },
  {
    id: 6,
    name: "MetaCreator",
    avatar: images.thumbnail2,
    sales: "1.9k"
  }
];

export default function TopSeller() {
  return (
    <section className="py-16 bg-brand-pale dark:bg-brand-dark w-full">
      <div className="w-full px-6">
        {/* Section Header */}
        <div className="text-left mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-1">
            Top Authors
          </h2>
          <p className="text-zinc-500 dark:text-zinc-300 text-base">
            Discover the most successful creators and collectors in our NFT marketplace
          </p>
        </div>

        {/* Top Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-none">
          {topSellers.map((seller, index) => (
            <div
              key={seller.id}
              className="flex items-center space-x-4 group cursor-pointer p-4 rounded-xl hover:bg-white/50 dark:hover:bg-zinc-800/20 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                  index < 3 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-400/30' 
                    : 'bg-brand-sky/20 text-brand-sky shadow-brand-sky/30'
                }`}>
                  #{index + 1}
                </div>
              </div>

              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-brand-sky/20 dark:border-brand-pale/20 shadow-xl group-hover:shadow-2xl group-hover:border-brand-sky transition-all duration-300"
                />
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name and Sales */}
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1 group-hover:text-brand-sky transition-colors">
                  {seller.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-300">
                  {seller.sales} sales
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-brand-sky text-brand-sky hover:bg-brand-sky hover:text-white font-semibold rounded-lg transition-all duration-200">
            View All Authors
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

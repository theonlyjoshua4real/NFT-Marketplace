import React, { useState } from "react";
import { images } from '../assets/images/images';
import CollectionHero from '../components/CollectionHero/CollectionHero';
import CollectionTabs from '../components/CollectionTabs/CollectionTabs';
import NFTCard from '../components/NFTCard/NFTCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

// Mock collection data
const collectionData = {
  name: "Moonbirds",
  creator: "80D154",
  blockchain: "Ethereum",
  totalItems: "9,999",
  launchDate: "APR 2022",
  category: "PFPS",
  verified: true,
  floorPrice: "1.62 ETH",
  floorChange: "+1.9%",
  topOffer: "1.60 WETH",
  volume24h: "84.01 ETH",
  totalVolume: "353K ETH",
  owners: "5,746",
  uniqueOwners: "57.5%",
  heroImage: images.thumbnail1, // You can replace with actual collection hero image
  profileImage: images.thumbnail2, // Collection profile image
};

// Mock NFT items
const nftItems = [
  {
    id: 1,
    name: "Moonbirds #5891",
    image: images.thumbnail1,
    price: "1.62 ETH",
    rarity: "#9,757",
    startsSoon: false // Already on sale
  },
  {
    id: 2,
    name: "Moonbirds #2672",
    image: images.thumbnail2,
    price: "1.63 ETH",
    rarity: "#9,651",
    startsSoon: false // Already on sale
  },
  {
    id: 3,
    name: "Moonbirds #4775",
    image: images.thumbnail3,
    price: "1.63 ETH",
    timeLeft: "14:38",
    lastSale: "1.57 WETH",
    rarity: "#9,276",
    startsSoon: true // Starting soon
  },
  {
    id: 4,
    name: "Moonbirds #1487",
    image: images.thumbnail4,
    price: "1.65 ETH",
    timeLeft: "11:48",
    lastSale: "1.54 ETH",
    rarity: "#2,142",
    startsSoon: true // Starting soon
  }
];

export default function Collection() {
  const [activeTab, setActiveTab] = useState("Items");
  const [statusFilter, setStatusFilter] = useState("All");

  const tabs = ["Explore", "Items", "Offers", "Holders", "Traits", "Activity", "About"];

  return (
    <div className="min-h-screen bg-brand-pale dark:bg-brand-dark">
      {/* Collection Hero Section */}
      <CollectionHero collection={collectionData} />

      {/* Navigation Tabs */}
      <CollectionTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Main Content Area */}
      <section className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 p-6 border-r border-brand-navy/10 dark:border-brand-pale/10">
          <div className="space-y-6">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-semibold text-brand-navy dark:text-brand-pale mb-3">Status</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "All"
                      ? "bg-brand-sky text-white"
                      : "bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale hover:bg-white/70 dark:hover:bg-brand-navy/30"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("Listed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "Listed"
                      ? "bg-brand-sky text-white"
                      : "bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale hover:bg-white/70 dark:hover:bg-brand-navy/30"
                  }`}
                >
                  Listed
                </button>
              </div>
            </div>

            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by item or trait"
                className="w-full px-4 py-2 rounded-lg border border-brand-navy/10 dark:border-brand-pale/10 bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              />
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-brand-navy dark:text-brand-pale">Price</h3>
                <svg className="w-4 h-4 text-zinc-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Currency Selection */}
              <div className="mb-3">
                <div className="relative">
                  <select className="w-full px-3 py-2 rounded-lg border border-brand-navy/10 dark:border-brand-pale/10 bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky appearance-none">
                    <option value="ETH">ETH</option>
                    <option value="WETH">WETH</option>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FontAwesomeIcon icon={faEthereum} className="w-4 h-4 text-brand-navy dark:text-brand-pale" />
                  </div>
                </div>
              </div>
              
              {/* Price Range Inputs */}
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 rounded-lg border border-brand-navy/10 dark:border-brand-pale/10 bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 rounded-lg border border-brand-navy/10 dark:border-brand-pale/10 bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                />
                
                {/* Apply Button */}
                <button className="w-full py-2 px-4 bg-brand-sky hover:bg-brand-navy text-white font-medium rounded-lg transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Trait Filters */}
            <div>
              <h3 className="text-sm font-semibold text-brand-navy dark:text-brand-pale mb-3">Traits</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20 cursor-pointer">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Background (10)</span>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20 cursor-pointer">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Beak (3)</span>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20 cursor-pointer">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Body (17)</span>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - NFT Grid */}
        <div className="flex-1 p-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-brand-navy dark:text-brand-pale">{collectionData.totalItems} ITEMS</h2>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 rounded-lg border border-brand-navy/10 dark:border-brand-pale/10 bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky">
                <option>Price low to high</option>
                <option>Price high to low</option>
                <option>Recently listed</option>
              </select>
              <button className="p-2 rounded-lg border border-brand-navy/10 dark:border-brand-pale/10 hover:bg-white/50 dark:hover:bg-brand-navy/20">
                <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nftItems.map((item) => (
              <NFTCard 
                key={item.id} 
                nft={item} 
                onBuyClick={(nft) => console.log('Buy clicked:', nft)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

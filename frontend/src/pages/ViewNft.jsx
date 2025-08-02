import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { images } from '../assets/images/images';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

// Mock data for NFT collection
const mockCollection = {
  id: "off-the-grid",
  name: "Off The Grid",
  logo: images.thumbnail1,
  verified: true,
  nfts: [
    {
      id: 1,
      name: "PARALYZER",
      image: images.thumbnail1,
      description: "A highly advanced cybernetic arm with enhanced combat capabilities. Features integrated weapon systems and neural interface technology.",
      price: "11.00",
      priceUSD: "0.34",
      currency: "ETH",
      category: "Cybernetics",
      timeLeft: "22 HOURS",
      owner: "0x08bf...8e3e",
      topOffer: null,
      lastSale: null,
      traits: [
        { name: "PLATFORM", value: "PC", rarity: "100%", count: "6,790,138" },
        { name: "CLASS", value: "Body Part", rarity: "14%", count: "925,595", highlighted: true },
        { name: "TYPE", value: "RightArm", rarity: "6%", count: "400,683", highlighted: true },
        { name: "RARITY", value: "Uncommon", rarity: "30%", count: "2,042,351" },
        { name: "PART", value: "no", rarity: "100%", count: "6,792,520" },
        { name: "SERIAL NUMBER", value: "43326", rarity: "0.1%", count: "4", highlighted: true, color: "orange" },
        { name: "LOGICAL SLOT", value: "None", rarity: "72%", count: "4,924,137" }
      ]
    },
    {
      id: 2,
      name: "CYBER HELMET",
      image: images.thumbnail2,
      description: "Advanced neural interface helmet with augmented reality capabilities and threat detection systems.",
      price: "8.50",
      priceUSD: "0.26",
      currency: "ETH",
      category: "Head Gear",
      timeLeft: null,
      owner: "0x1a2b...4c5d",
      topOffer: "7.20",
      lastSale: "8.00",
      traits: [
        { name: "PLATFORM", value: "PC", rarity: "100%", count: "6,790,138" },
        { name: "CLASS", value: "Head Gear", rarity: "8%", count: "543,210", highlighted: true },
        { name: "TYPE", value: "Helmet", rarity: "4%", count: "271,605", highlighted: true },
        { name: "RARITY", value: "Rare", rarity: "15%", count: "1,018,520" },
        { name: "PART", value: "yes", rarity: "100%", count: "6,792,520" },
        { name: "SERIAL NUMBER", value: "12345", rarity: "0.05%", count: "2", highlighted: true, color: "orange" },
        { name: "LOGICAL SLOT", value: "Head", rarity: "85%", count: "5,773,342" }
      ]
    },
    {
      id: 3,
      name: "NEURAL CORE",
      image: images.thumbnail3,
      description: "Central processing unit for cybernetic enhancements with quantum computing capabilities.",
      price: "15.75",
      priceUSD: "0.48",
      currency: "ETH",
      category: "Processor",
      timeLeft: "5 HOURS",
      owner: "0x3e4f...6g7h",
      topOffer: "14.00",
      lastSale: "16.20",
      traits: [
        { name: "PLATFORM", value: "PC", rarity: "100%", count: "6,790,138" },
        { name: "CLASS", value: "Core", rarity: "3%", count: "203,704", highlighted: true },
        { name: "TYPE", value: "Processor", rarity: "1%", count: "67,901", highlighted: true },
        { name: "RARITY", value: "Legendary", rarity: "5%", count: "339,506" },
        { name: "PART", value: "yes", rarity: "100%", count: "6,792,520" },
        { name: "SERIAL NUMBER", value: "999", rarity: "0.01%", count: "1", highlighted: true, color: "orange" },
        { name: "LOGICAL SLOT", value: "Core", rarity: "95%", count: "6,450,631" }
      ]
    }
  ]
};

// Mock data for orders and offers
const mockOrders = [
  { author: "0x1a2b...4c5d", qty: "1", date: "2024-01-15 14:30" },
  { author: "0x3e4f...6g7h", qty: "2", date: "2024-01-14 09:15" }
];

const mockOffers = [
  { author: "0x5a6b...7c8d", qty: "1", date: "2024-01-15 16:45", amount: "10.50" },
  { author: "0x9e0f...1a2b", qty: "1", date: "2024-01-15 12:20", amount: "9.75" }
];

export default function ViewNft() {
  const { collectionId, nftId } = useParams();
  const navigate = useNavigate();
  const [currentNftIndex, setCurrentNftIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("About");
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    traits: true,
    moreFromCollection: false
  });

  // Get current NFT data
  const currentNft = mockCollection.nfts[currentNftIndex];
  const totalNfts = mockCollection.nfts.length;

  // Navigation functions
  const goToPrevious = () => {
    if (currentNftIndex > 0) {
      setCurrentNftIndex(currentNftIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentNftIndex < totalNfts - 1) {
      setCurrentNftIndex(currentNftIndex + 1);
    }
  };

  const goToNft = (index) => {
    setCurrentNftIndex(index);
  };

  const handleClose = () => {
    navigate(`/collection/${collectionId}`);
  };

  const handleBuyNow = () => {
    console.log('Buying NFT:', currentNft.name);
    // Implement purchase logic
  };

  const handleMakeOffer = () => {
    console.log('Making offer for NFT:', currentNft.name);
    // Implement offer logic
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-brand-pale dark:bg-brand-dark">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-brand-navy/10 dark:border-brand-pale/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPrevious}
            disabled={currentNftIndex === 0}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-brand-navy dark:text-brand-pale" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* NFT Thumbnails */}
          <div className="flex items-center space-x-2">
            {mockCollection.nfts.map((nft, index) => (
              <button
                key={nft.id}
                onClick={() => goToNft(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentNftIndex
                    ? 'border-white shadow-lg'
                    : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNext}
            disabled={currentNftIndex === totalNfts - 1}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-brand-navy dark:text-brand-pale" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20"
        >
          <svg className="w-5 h-5 text-brand-navy dark:text-brand-pale" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Pane - NFT Visual */}
        <div className="w-1/2 p-8">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900">
            <img
              src={currentNft.image}
              alt={currentNft.name}
              className="w-full h-full object-cover"
            />
            {/* Lightning bolt icons for visual effect */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <svg className="w-8 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Pane - NFT Details */}
        <div className="w-1/2 p-8">
          {/* NFT Name */}
          <h1 className="text-3xl font-bold text-brand-navy dark:text-brand-pale mb-4">
            {currentNft.name}
          </h1>

          {/* Collection and Author Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={mockCollection.logo}
                alt={mockCollection.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex items-center space-x-2">
                <span className="text-brand-navy dark:text-brand-pale font-medium">
                  {mockCollection.name}
                </span>
                {mockCollection.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => navigate(`/author/${currentNft.owner}`)}
              className="text-sm text-brand-sky hover:text-brand-navy dark:hover:text-brand-pale transition-colors"
            >
              By {currentNft.owner}
            </button>
          </div>

          {/* NFT Tags */}
          <div className="flex space-x-2 mb-6">
            <span className="px-3 py-1 bg-white/50 dark:bg-brand-navy/20 text-xs font-medium text-brand-navy dark:text-brand-pale rounded flex items-center space-x-1">
              <FontAwesomeIcon icon={faEthereum} className="w-3 h-3" />
              <span>ETH</span>
            </span>
            <span className="px-3 py-1 bg-white/50 dark:bg-brand-navy/20 text-xs font-medium text-brand-navy dark:text-brand-pale rounded">
              {currentNft.category || "NFT"}
            </span>
          </div>

          {/* Price/Offer Overview */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-300">TOP OFFER</div>
              <div className="font-bold text-brand-navy dark:text-brand-pale">
                {currentNft.topOffer ? `${currentNft.topOffer} ${currentNft.currency}` : '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-300">FLOOR</div>
              <div className="font-bold text-brand-navy dark:text-brand-pale">
                {currentNft.price} ETH
              </div>
            </div>
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-300">RARITY</div>
              <div className="font-bold text-brand-navy dark:text-brand-pale">-</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500 dark:text-zinc-300">LAST SALE</div>
              <div className="font-bold text-brand-navy dark:text-brand-pale">
                {currentNft.lastSale ? `${currentNft.lastSale} ${currentNft.currency}` : '-'}
              </div>
            </div>
          </div>

          {/* Buy Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-300">BUY FOR</div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-brand-navy dark:text-brand-pale">
                    {currentNft.price} {currentNft.currency}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-300">
                    (${currentNft.priceUSD})
                  </span>
                </div>
              </div>
              {currentNft.timeLeft && (
                <span className="text-sm text-red-500 font-medium">
                  STARTING IN {currentNft.timeLeft}
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-brand-sky hover:bg-brand-navy text-white font-medium rounded-lg transition-colors"
              >
                Buy now
              </button>
              <button
                onClick={handleMakeOffer}
                className="flex-1 py-3 bg-transparent border border-brand-sky/30 dark:border-brand-pale/30 text-brand-navy dark:text-brand-pale font-medium rounded-lg hover:bg-brand-sky/10 dark:hover:bg-brand-pale/10 transition-colors"
              >
                Make offer
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-brand-navy/10 dark:border-brand-pale/10 mb-6">
            <div className="flex space-x-8">
              {["About", "Orders", "Offers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === tab
                      ? "border-brand-sky text-brand-sky"
                      : "border-transparent text-zinc-500 dark:text-zinc-300 hover:text-brand-navy dark:hover:text-brand-pale"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "About" && (
              <div>
                {/* About Section */}
                <div className="mb-6">
                  <div 
                    className="flex items-center justify-between p-4 bg-white/50 dark:bg-brand-navy/20 rounded-lg cursor-pointer hover:bg-white/70 dark:hover:bg-brand-navy/30 transition-colors"
                    onClick={() => toggleSection('about')}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium text-brand-navy dark:text-brand-pale">About</span>
                    </div>
                    {expandedSections.about ? (
                      <ChevronUpIcon className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  {expandedSections.about && (
                    <div className="p-4 text-sm text-zinc-600 dark:text-zinc-300 bg-white/30 dark:bg-brand-navy/10 rounded-b-lg">
                      {currentNft.description}
                    </div>
                  )}
                </div>

                {/* Traits Section */}
                <div className="mb-6">
                  <div 
                    className="flex items-center justify-between p-4 bg-white/50 dark:bg-brand-navy/20 rounded-lg cursor-pointer hover:bg-white/70 dark:hover:bg-brand-navy/30 transition-colors"
                    onClick={() => toggleSection('traits')}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-brand-navy dark:text-brand-pale">Traits</span>
                      <span className="text-sm text-zinc-500">TRAITS {currentNft.traits.length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      {expandedSections.traits ? (
                        <ChevronUpIcon className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>
                  
                  {expandedSections.traits && (
                    <div className="p-4 bg-white/30 dark:bg-brand-navy/10 rounded-b-lg">
                      {/* Traits Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {currentNft.traits.map((trait, index) => (
                          <div key={index} className="p-3 bg-white/50 dark:bg-brand-navy/20 rounded-lg">
                            <div className="text-xs text-zinc-500 dark:text-zinc-300 mb-1">
                              {trait.name}
                            </div>
                            <div className="text-sm font-medium text-brand-navy dark:text-brand-pale mb-1">
                              {trait.value}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-300">
                              {trait.count} {trait.rarity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* More from this collection */}
                <div>
                  <div 
                    className="flex items-center justify-between p-4 bg-white/50 dark:bg-brand-navy/20 rounded-lg cursor-pointer hover:bg-white/70 dark:hover:bg-brand-navy/30 transition-colors"
                    onClick={() => toggleSection('moreFromCollection')}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium text-brand-navy dark:text-brand-pale">More from this collection</span>
                    </div>
                    {expandedSections.moreFromCollection ? (
                      <ChevronUpIcon className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  {expandedSections.moreFromCollection && (
                    <div className="p-4 bg-white/30 dark:bg-brand-navy/10 rounded-b-lg">
                      <div className="grid grid-cols-3 gap-4">
                        {mockCollection.nfts.filter(nft => nft.id !== currentNft.id).map((nft) => (
                          <div key={nft.id} className="group cursor-pointer">
                            <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-2">
                              <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="text-sm font-medium text-brand-navy dark:text-brand-pale truncate">
                              {nft.name}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-300">
                              {nft.price} {nft.currency}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Orders" && (
              <div>
                {mockOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-brand-navy/10 dark:border-brand-pale/10">
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Author</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Qty</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOrders.map((order, index) => (
                          <tr key={index} className="border-b border-brand-navy/5 dark:border-brand-pale/5">
                            <td className="py-3 px-4 text-sm text-brand-navy dark:text-brand-pale">{order.author}</td>
                            <td className="py-3 px-4 text-sm text-brand-navy dark:text-brand-pale">{order.qty}</td>
                            <td className="py-3 px-4 text-sm text-zinc-500 dark:text-zinc-300">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-zinc-500 dark:text-zinc-300 mb-2">No orders found</div>
                    <div className="text-sm text-zinc-400 dark:text-zinc-400">Orders will appear here when available</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Offers" && (
              <div>
                {mockOffers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-brand-navy/10 dark:border-brand-pale/10">
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Author</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Qty</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-300">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOffers.map((offer, index) => (
                          <tr key={index} className="border-b border-brand-navy/5 dark:border-brand-pale/5">
                            <td className="py-3 px-4 text-sm text-brand-navy dark:text-brand-pale">{offer.author}</td>
                            <td className="py-3 px-4 text-sm text-brand-navy dark:text-brand-pale">{offer.amount} {currentNft.currency}</td>
                            <td className="py-3 px-4 text-sm text-brand-navy dark:text-brand-pale">{offer.qty}</td>
                            <td className="py-3 px-4 text-sm text-zinc-500 dark:text-zinc-300">{offer.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-zinc-500 dark:text-zinc-300 mb-2">No offers found</div>
                    <div className="text-sm text-zinc-400 dark:text-zinc-400">Offers will appear here when available</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

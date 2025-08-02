import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faUpload, faImage, faTag, faCalendar, faPercentage, faCopy, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { images } from '../assets/images/images';

// Mock collections data
const mockCollections = [
  {
    id: 1,
    name: "Crypto Legend - Sports",
    image: images.thumbnail1,
    verified: true,
    category: "Sports",
    itemCount: 1250,
    timeLeft: null
  },
  {
    id: 2,
    name: "Crypto Legend - Arts",
    image: images.thumbnail2,
    verified: true,
    category: "Arts",
    itemCount: 892,
    timeLeft: "14:38"
  },
  {
    id: 3,
    name: "Crypto Legend - Music",
    image: images.thumbnail3,
    verified: true,
    category: "Music",
    itemCount: 567,
    timeLeft: null
  },
  {
    id: 4,
    name: "Crypto Legend - Digital",
    image: images.thumbnail4,
    verified: true,
    category: "Digital",
    itemCount: 2341,
    timeLeft: "22:15"
  },
  {
    id: 5,
    name: "Cyberpunk Warriors",
    image: images.thumbnail1,
    verified: false,
    category: "Gaming",
    itemCount: 445,
    timeLeft: null
  },
  {
    id: 6,
    name: "Abstract Dreams",
    image: images.thumbnail2,
    verified: true,
    category: "Art",
    itemCount: 123,
    timeLeft: "05:42"
  }
];

export default function UserUpload() {
  // Add custom styles for scrollbar hiding
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricingMethod, setPricingMethod] = useState("fixed"); // "fixed" or "bids"
  const [royalties, setRoyalties] = useState("20");
  const [copies, setCopies] = useState("1");
  const [releaseDate, setReleaseDate] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  
  // Collection states
  const [collections, setCollections] = useState(mockCollections);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Collection form states
  const [collectionName, setCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);
  const [collectionCategory, setCollectionCategory] = useState("");
  
  // Preview states
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Filter collections based on search query
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Countdown timer effect
  useEffect(() => {
    if (isScheduled && releaseDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const releaseTime = new Date(releaseDate).getTime();
        const diff = Math.max(0, releaseTime - now);
        
        if (diff > 0) {
          const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
          const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
          const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
          setCountdown(`${hours}:${minutes}:${seconds}`);
        } else {
          setCountdown("");
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCountdown("");
    }
  }, [isScheduled, releaseDate]);

  // Check if form is valid for preview
  const isFormValid = selectedFile && nftName && price && selectedCollection;

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Create new collection
  const handleCreateCollection = async () => {
    if (!collectionName || !collectionImage) return;
    
    setIsCreatingCollection(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCollection = {
      id: collections.length + 1,
      name: collectionName,
      image: URL.createObjectURL(collectionImage),
      verified: false,
      category: collectionCategory || "Digital"
    };
    
    setCollections([...collections, newCollection]);
    setSelectedCollection(newCollection);
    setShowCollectionForm(false);
    setIsCreatingCollection(false);
    
    // Reset form
    setCollectionName("");
    setCollectionImage(null);
    setCollectionCategory("");
  };

  // Preview NFT data
  const getPreviewData = () => ({
    id: 1,
    name: nftName || "Untitled NFT",
    image: selectedFile ? URL.createObjectURL(selectedFile) : images.thumbnail1,
    price: price ? `${price} ETH` : "0.00 ETH",
    timeLeft: isScheduled && releaseDate ? "24:00:00" : null,
    startsSoon: isScheduled && releaseDate,
    lastSale: null,
    rarity: "#1",
    owner: "0x1234...5678"
  });

  return (
    <div className="min-h-screen bg-brand-pale dark:bg-brand-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-navy dark:text-brand-pale mb-4">
            Create Your NFT
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Transform your digital art into unique NFTs. Upload your masterpiece, set your terms, and share it with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Collection Selection */}
            <div className="bg-white/50 dark:bg-brand-navy/20 rounded-xl p-6 border border-brand-navy/10 dark:border-brand-pale/10">
              <h2 className="text-xl font-semibold text-brand-navy dark:text-brand-pale mb-4">
                Choose Collection
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">
                Choose an existing collection or create a new one.
              </p>
              
              {!showCollectionForm ? (
                <div>
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search collections..."
                        className="w-full pl-10 pr-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Collection Carousel */}
                  <div className="mb-6">
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                      {filteredCollections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => setSelectedCollection(collection)}
                          className={`flex-shrink-0 w-48 bg-white/50 dark:bg-brand-navy/20 rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg ${
                            selectedCollection?.id === collection.id
                              ? 'border-brand-sky shadow-lg'
                              : 'border-brand-navy/10 dark:border-brand-pale/10 hover:border-brand-sky/50'
                          }`}
                        >
                          {/* Collection Image */}
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Timer Badge - Featured Style */}
                            {collection.timeLeft && (
                              <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-mono px-3 py-1 rounded z-10">
                                {collection.timeLeft}
                              </div>
                            )}
                            
                          </div>

                          {/* Collection Info */}
                          <div className="p-3">
                            <h3 className="font-semibold text-brand-navy dark:text-brand-pale text-sm mb-1 truncate">
                              {collection.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-500 dark:text-zinc-300">Items</span>
                              <span className="text-sm font-medium text-brand-navy dark:text-brand-pale">
                                {collection.itemCount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowCollectionForm(true)}
                    className="w-full py-3 border-2 border-dashed border-brand-navy/20 dark:border-brand-pale/20 rounded-lg text-brand-navy dark:text-brand-pale hover:border-brand-sky/50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create New Collection
                  </button>
                </div>
              ) : (
                /* Collection Creation Form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                      Collection Name
                    </label>
                    <input
                      type="text"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      placeholder="Enter collection name"
                      className="w-full px-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                      Collection Image
                    </label>
                    <div className="border-2 border-dashed border-brand-navy/20 dark:border-brand-pale/20 rounded-lg p-6 text-center">
                      <FontAwesomeIcon icon={faImage} className="text-3xl text-zinc-400 mb-2" />
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">
                        Upload collection cover image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCollectionImage(e.target.files[0])}
                        className="hidden"
                        id="collection-image"
                      />
                      <label
                        htmlFor="collection-image"
                        className="inline-block px-4 py-2 bg-brand-sky text-white rounded-lg cursor-pointer hover:bg-brand-navy transition-colors"
                      >
                        Choose Image
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCreateCollection}
                      disabled={isCreatingCollection || !collectionName || !collectionImage}
                      className="flex-1 py-3 bg-brand-sky text-white rounded-lg font-medium hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingCollection ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        "Create Collection"
                      )}
                    </button>
                    <button
                      onClick={() => setShowCollectionForm(false)}
                      className="flex-1 py-3 border border-brand-navy/10 dark:border-brand-pale/10 text-brand-navy dark:text-brand-pale rounded-lg hover:bg-white/50 dark:hover:bg-brand-navy/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="bg-white/50 dark:bg-brand-navy/20 rounded-xl p-6 border border-brand-navy/10 dark:border-brand-pale/10">
              <h2 className="text-xl font-semibold text-brand-navy dark:text-brand-pale mb-4">
                Upload File
              </h2>
              <div
                className="border-2 border-dashed border-brand-navy/20 dark:border-brand-pale/20 rounded-lg p-8 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {selectedFile ? (
                  <div>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-sm text-brand-navy dark:text-brand-pale mb-2">
                      {selectedFile.name}
                    </p>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faUpload} className="text-4xl text-zinc-400 mb-4" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">
                      PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                    </p>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-6 py-3 bg-brand-sky text-white rounded-lg cursor-pointer hover:bg-brand-navy transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* NFT Details Form */}
            <div className="bg-white/50 dark:bg-brand-navy/20 rounded-xl p-6 border border-brand-navy/10 dark:border-brand-pale/10">
              <h2 className="text-xl font-semibold text-brand-navy dark:text-brand-pale mb-4">
                NFT Details
              </h2>
              
              <div className="space-y-4">
                {/* NFT Name */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                    NFT Name *
                  </label>
                  <input
                    type="text"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    placeholder="Enter NFT name"
                    className="w-full px-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your NFT..."
                    rows={4}
                    className="w-full px-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky resize-vertical"
                  />
                </div>

                {/* Pricing Method */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-3">
                    Pricing Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPricingMethod("fixed")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        pricingMethod === "fixed"
                          ? 'border-brand-sky bg-brand-sky/10'
                          : 'border-brand-navy/10 dark:border-brand-pale/10 hover:border-brand-sky/50'
                      }`}
                    >
                      <FontAwesomeIcon icon={faTag} className="text-2xl text-brand-navy dark:text-brand-pale mb-2" />
                      <div className="text-sm font-medium text-brand-navy dark:text-brand-pale">
                        Fixed Price
                      </div>
                    </button>
                    <button
                      onClick={() => setPricingMethod("bids")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        pricingMethod === "bids"
                          ? 'border-brand-sky bg-brand-sky/10'
                          : 'border-brand-navy/10 dark:border-brand-pale/10 hover:border-brand-sky/50'
                      }`}
                    >
                      <svg className="w-6 h-6 text-brand-navy dark:text-brand-pale mb-2 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      <div className="text-sm font-medium text-brand-navy dark:text-brand-pale">
                        Open for Bids
                      </div>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                    Price (ETH) *
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEthereum} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                    />
                  </div>
                </div>

                {/* Royalties */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                    Royalties (%)
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faPercentage} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      value={royalties}
                      onChange={(e) => setRoyalties(e.target.value)}
                      placeholder="20"
                      min="0"
                      max="50"
                      className="w-full pl-10 pr-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                    />
                  </div>
                </div>

                {/* Number of Copies */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
                    Number of Copies
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCopy} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      value={copies}
                      onChange={(e) => setCopies(e.target.value)}
                      placeholder="1"
                      min="1"
                      className="w-full pl-10 pr-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
                    />
                  </div>
                </div>

                {/* Schedule Release */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="rounded border-brand-navy/10 dark:border-brand-pale/10 text-brand-sky focus:ring-brand-sky"
                    />
                    <span className="text-sm font-medium text-brand-navy dark:text-brand-pale">
                      Schedule Release
                    </span>
                  </label>
                  
                  {isScheduled && (
                    <div className="relative">
                      <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                      <input
                        type="datetime-local"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPreview(true)}
                disabled={!isFormValid}
                className="flex-1 py-4 bg-brand-sky text-white rounded-lg font-medium hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Preview
              </button>
              <button
                disabled={!isFormValid}
                className="flex-1 py-4 bg-brand-navy dark:bg-brand-sky text-white rounded-lg font-medium hover:bg-brand-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mint NFT
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1 lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white/50 dark:bg-brand-navy/20 rounded-xl p-6 border border-brand-navy/10 dark:border-brand-pale/10">
              <h2 className="text-xl font-semibold text-brand-navy dark:text-brand-pale mb-4">
                Preview Item
              </h2>
              
              {isFormValid ? (
                <div className="bg-white/50 dark:bg-brand-navy/20 rounded-xl overflow-hidden border border-brand-navy/10 dark:border-brand-pale/10">
                  {/* NFT Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt={nftName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Timer Badge */}
                    {countdown && (
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-mono px-3 py-1 rounded z-10">
                        {countdown}
                      </div>
                    )}
                    
                    {/* Creator Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <img
                          src={images.thumbnail1}
                          alt="Creator"
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NFT Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-navy dark:text-brand-pale mb-2">
                      {nftName}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-500 dark:text-zinc-300">Price</span>
                        <span className="font-bold text-brand-navy dark:text-brand-pale">
                          {price} ETH
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-500 dark:text-zinc-300">Copies</span>
                        <span className="text-sm text-brand-navy dark:text-brand-pale">
                          1/{copies}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-4">
                      <button className="w-full py-2 bg-brand-sky hover:bg-brand-navy text-white font-medium rounded-lg transition-colors">
                        {pricingMethod === "bids" ? "Place a bid" : "Buy now"}
                      </button>
                    </div>
                    
                    {/* Likes */}
                    <div className="flex items-center justify-end mt-3">
                      <svg className="w-4 h-4 text-zinc-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-zinc-400">0</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faEye} className="text-4xl text-zinc-400 mb-4" />
                  <p className="text-zinc-500 dark:text-zinc-300">
                    Fill in the required fields to see a preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

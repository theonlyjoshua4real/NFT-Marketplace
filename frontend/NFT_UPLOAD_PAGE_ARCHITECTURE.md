# NFT Upload Page Architecture & Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Form Structure](#form-structure)
4. [Collection Management](#collection-management)
5. [File Upload System](#file-upload-system)
6. [Preview System](#preview-system)
7. [State Management](#state-management)
8. [Validation Logic](#validation-logic)
9. [Design System Integration](#design-system-integration)
10. [Future Enhancements](#future-enhancements)

## 🎯 Overview

The NFT Upload Page is a comprehensive form that allows users to create and mint NFTs with advanced features including collection management, file upload, pricing options, scheduling, and real-time preview. The page follows the established design system and provides a smooth user experience for NFT creators.

### Key Features Implemented:
- **Collection Management**: Create new collections or select existing ones
- **File Upload**: Drag & drop or browse file upload with preview
- **NFT Details Form**: Complete form with all necessary fields
- **Pricing Options**: Fixed price or open for bids
- **Scheduling**: Optional release date scheduling
- **Real-time Preview**: Live preview of the NFT as it will appear
- **Form Validation**: Smart validation with disabled states
- **Loading States**: Loading animations for async operations

## 🏗 Component Architecture

### Main Component Structure
```
UserUpload
├── Header Section
│   ├── Title & Description
├── Main Content Grid
│   ├── Left Column (Form)
│   │   ├── Collection Selection
│   │   │   ├── Collection Grid
│   │   │   └── Create Collection Form
│   │   ├── File Upload
│   │   │   ├── Drag & Drop Area
│   │   │   └── File Preview
│   │   ├── NFT Details Form
│   │   │   ├── Basic Information
│   │   │   ├── Pricing Method
│   │   │   ├── Advanced Options
│   │   │   └── Scheduling
│   │   └── Action Buttons
│   └── Right Column (Preview)
│       ├── Preview Container
│       └── NFT Card Preview
```

### Component Responsibilities
- **Main Container**: Orchestrates all form states and validation
- **Collection Section**: Manages collection selection and creation
- **File Upload**: Handles file selection and preview
- **Form Fields**: Individual form inputs with validation
- **Preview Panel**: Real-time NFT preview
- **Action Buttons**: Form submission and preview actions

## 📝 Form Structure

### Required Fields
```javascript
const requiredFields = {
  file: selectedFile,           // NFT file (image/video)
  name: nftName,               // NFT name
  price: price,                // Price in ETH
  collection: selectedCollection // Selected collection
};
```

### Optional Fields
```javascript
const optionalFields = {
  description: description,     // NFT description
  royalties: royalties,        // Royalty percentage
  copies: copies,              // Number of copies
  releaseDate: releaseDate,    // Scheduled release date
  pricingMethod: pricingMethod // Fixed price or bids
};
```

### Form Validation Logic
```javascript
// Check if form is valid for preview and minting
const isFormValid = selectedFile && nftName && price && selectedCollection;

// Individual field validation
const isCollectionFormValid = collectionName && collectionImage;
const isFileValid = selectedFile && selectedFile.size <= 200 * 1024 * 1024; // 200MB
const isPriceValid = price && parseFloat(price) > 0;
```

## 🗂 Collection Management

### Collection Selection
```javascript
// Collection grid with selection state
{collections.map((collection) => (
  <button
    key={collection.id}
    onClick={() => setSelectedCollection(collection)}
    className={`p-4 rounded-lg border-2 transition-all ${
      selectedCollection?.id === collection.id
        ? 'border-brand-sky bg-brand-sky/10'
        : 'border-brand-navy/10 dark:border-brand-pale/10 hover:border-brand-sky/50'
    }`}
  >
    {/* Collection display */}
  </button>
))}
```

### Collection Creation
```javascript
// Create new collection with loading state
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
};
```

### Collection Form States
```javascript
const [showCollectionForm, setShowCollectionForm] = useState(false);
const [isCreatingCollection, setIsCreatingCollection] = useState(false);
const [collectionName, setCollectionName] = useState("");
const [collectionImage, setCollectionImage] = useState(null);
const [collectionCategory, setCollectionCategory] = useState("");
```

## 📁 File Upload System

### Drag & Drop Implementation
```javascript
// Handle drag and drop events
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

// File upload area with conditional rendering
<div
  className="border-2 border-dashed border-brand-navy/20 dark:border-brand-pale/20 rounded-lg p-8 text-center"
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  {selectedFile ? (
    // File preview
    <div>
      <img
        src={URL.createObjectURL(selectedFile)}
        alt="Preview"
        className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
      />
      <p className="text-sm text-brand-navy dark:text-brand-pale mb-2">
        {selectedFile.name}
      </p>
      <button onClick={() => setSelectedFile(null)}>
        Remove
      </button>
    </div>
  ) : (
    // Upload prompt
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
      <label htmlFor="file-upload" className="upload-button">
        Browse Files
      </label>
    </div>
  )}
</div>
```

### File Validation
```javascript
// File type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
const isValidFileType = file && allowedTypes.includes(file.type);

// File size validation (200MB limit)
const maxSize = 200 * 1024 * 1024; // 200MB in bytes
const isValidFileSize = file && file.size <= maxSize;
```

## 👁 Preview System

### Real-time Preview Logic
```javascript
// Generate preview data from form inputs
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
```

### Preview Card Implementation
```javascript
{isFormValid ? (
  <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
    {/* NFT Image with overlays */}
    <div className="relative aspect-square overflow-hidden">
      <img
        src={URL.createObjectURL(selectedFile)}
        alt={nftName}
        className="w-full h-full object-cover"
      />
      
      {/* Timer Badge for scheduled releases */}
      {isScheduled && releaseDate && (
        <div className="absolute top-4 right-4 bg-brand-sky text-white px-3 py-1 rounded-full text-sm font-medium">
          24:00:00
        </div>
      )}
      
      {/* Creator Badge */}
      <div className="absolute top-4 left-4">
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

    {/* NFT Information */}
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
    </div>
  </div>
) : (
  // Empty preview state
  <div className="text-center py-12">
    <FontAwesomeIcon icon={faEye} className="text-4xl text-zinc-400 mb-4" />
    <p className="text-zinc-500 dark:text-zinc-300">
      Fill in the required fields to see a preview
    </p>
  </div>
)}
```

## 🔄 State Management

### Form States
```javascript
// NFT form states
const [selectedFile, setSelectedFile] = useState(null);
const [nftName, setNftName] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [pricingMethod, setPricingMethod] = useState("fixed");
const [royalties, setRoyalties] = useState("20");
const [copies, setCopies] = useState("1");
const [releaseDate, setReleaseDate] = useState("");
const [isScheduled, setIsScheduled] = useState(false);

// Collection states
const [collections, setCollections] = useState(mockCollections);
const [selectedCollection, setSelectedCollection] = useState(null);
const [showCollectionForm, setShowCollectionForm] = useState(false);
const [isCreatingCollection, setIsCreatingCollection] = useState(false);

// Collection form states
const [collectionName, setCollectionName] = useState("");
const [collectionImage, setCollectionImage] = useState(null);
const [collectionCategory, setCollectionCategory] = useState("");

// Preview states
const [showPreview, setShowPreview] = useState(false);
```

### Event Handlers
```javascript
// File upload handlers
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);
  }
};

// Collection creation handler
const handleCreateCollection = async () => {
  // Implementation with loading state
};

// Form validation
const isFormValid = selectedFile && nftName && price && selectedCollection;
```

## ✅ Validation Logic

### Required Field Validation
```javascript
// Check if all required fields are filled
const isFormValid = selectedFile && nftName && price && selectedCollection;

// Individual field validation
const isCollectionFormValid = collectionName && collectionImage;
const isFileValid = selectedFile && selectedFile.size <= 200 * 1024 * 1024;
const isPriceValid = price && parseFloat(price) > 0;
const isRoyaltiesValid = royalties && parseFloat(royalties) >= 0 && parseFloat(royalties) <= 50;
const isCopiesValid = copies && parseInt(copies) >= 1;
```

### Button State Management
```javascript
// Preview button - disabled until required fields are filled
<button
  onClick={() => setShowPreview(true)}
  disabled={!isFormValid}
  className="flex-1 py-4 bg-brand-sky text-white rounded-lg font-medium hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  <FontAwesomeIcon icon={faEye} className="mr-2" />
  Preview
</button>

// Mint button - disabled until form is valid
<button
  disabled={!isFormValid}
  className="flex-1 py-4 bg-brand-navy dark:bg-brand-sky text-white rounded-lg font-medium hover:bg-brand-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  Mint NFT
</button>
```

## 🎨 Design System Integration

### Color Scheme
```javascript
// Background colors
bg-brand-pale dark:bg-brand-dark

// Text colors
text-brand-navy dark:text-brand-pale
text-zinc-500 dark:text-zinc-300

// Border colors
border-brand-navy/10 dark:border-brand-pale/10

// Hover states
hover:bg-white/50 dark:hover:bg-brand-navy/20
hover:border-brand-sky/50

// Focus states
focus:ring-2 focus:ring-brand-sky
```

### Component Styling
```javascript
// Form container styling
<div className="bg-white/50 dark:bg-brand-navy/20 rounded-xl p-6 border border-brand-navy/10 dark:border-brand-pale/10">

// Input field styling
<input
  className="w-full px-4 py-3 border border-brand-navy/10 dark:border-brand-pale/10 rounded-lg bg-white/50 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-pale placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-sky"
/>

// Button styling
<button className="px-6 py-3 bg-brand-sky text-white rounded-lg cursor-pointer hover:bg-brand-navy transition-colors">
```

### Responsive Design
```javascript
// Grid layout for different screen sizes
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

// Sticky preview on desktop
<div className="lg:sticky lg:top-8 lg:h-fit">

// Collection grid responsive
<div className="grid grid-cols-2 gap-4">
```

## 🚀 Future Enhancements

### Planned Features
1. **Advanced File Validation**: File type detection, virus scanning
2. **Batch Upload**: Upload multiple NFTs at once
3. **Template System**: Pre-defined NFT templates
4. **Advanced Scheduling**: Multiple release dates, time zones
5. **Royalty Splitting**: Multiple recipient addresses
6. **Metadata Editor**: Advanced trait and property editing
7. **Social Features**: Share drafts, collaborate with others
8. **Analytics**: Upload success rates, popular collections

### Technical Improvements
1. **File Compression**: Automatic image/video optimization
2. **IPFS Integration**: Decentralized file storage
3. **Blockchain Integration**: Direct minting to blockchain
4. **Gas Estimation**: Real-time gas cost calculation
5. **Multi-chain Support**: Support for multiple blockchains
6. **Offline Support**: Draft saving and offline uploads

### UX Enhancements
1. **Progress Indicators**: Upload progress, minting status
2. **Auto-save**: Automatic draft saving
3. **Keyboard Shortcuts**: Power user shortcuts
4. **Bulk Operations**: Select multiple items for batch actions
5. **Advanced Preview**: 3D preview, AR preview
6. **Mobile Optimization**: Touch-friendly interface

## 🔧 Implementation Notes

### File Handling
```javascript
// File size validation
const maxFileSize = 200 * 1024 * 1024; // 200MB
const isValidFileSize = file && file.size <= maxFileSize;

// File type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
const isValidFileType = file && allowedTypes.includes(file.type);

// File preview
const filePreview = selectedFile ? URL.createObjectURL(selectedFile) : null;
```

### Loading States
```javascript
// Collection creation loading
{isCreatingCollection ? (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    Creating...
  </div>
) : (
  "Create Collection"
)}
```

### Error Handling
```javascript
// File upload error handling
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > maxFileSize) {
      alert('File size exceeds 200MB limit');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PNG, JPG, GIF, WEBP or MP4');
      return;
    }
    setSelectedFile(file);
  }
};
```

### Accessibility Features
```javascript
// Proper labels and ARIA attributes
<label htmlFor="nft-name" className="block text-sm font-medium text-brand-navy dark:text-brand-pale mb-2">
  NFT Name *
</label>
<input
  id="nft-name"
  type="text"
  value={nftName}
  onChange={(e) => setNftName(e.target.value)}
  placeholder="Enter NFT name"
  aria-required="true"
  className="..."
/>

// Keyboard navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCreateCollection();
    }
  }}
>
```

This architecture provides a solid foundation for a comprehensive NFT upload system that can be easily extended with additional features while maintaining performance and user experience standards. 
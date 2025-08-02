import { Link } from "react-router-dom";
import { Squares2X2Icon, PaintBrushIcon, MusicalNoteIcon, TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";
import Carousel from "@/components/Carousel/Carousel";
import Featured from "@/components/Featured/Featured";
import Steps from "@/components/Steps";
import TopSeller from "@/components/TopSeller/TopSeller";

const filters = [
  { name: "All", icon: Squares2X2Icon, to: "/explore/all", active: true },
  { name: "Art", icon: PaintBrushIcon, to: "/explore/art", active: false },
  { name: "Music", icon: MusicalNoteIcon, to: "/explore/music", active: false },
  { name: "Sports", icon: TrophyIcon, to: "/explore/sports", active: false },
  { name: "Collectibles", icon: SparklesIcon, to: "/explore/collectibles", active: false },
];

const featuredData = [
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    title: "Azuki",
    creator: "By Azuki",
    floor: "2.42 ETH",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "CryptoPunks",
    creator: "By Larva Labs",
    floor: "47.75 ETH",
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    title: "Moonbirds",
    creator: "By PROOF Collective",
    floor: "1.80 ETH",
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80&sat=100",
    title: "Bored Ape Yacht Club",
    creator: "By Yuga Labs",
    floor: "13.10 ETH",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80&sat=100",
    title: "Doodles",
    creator: "By Doodles",
    floor: "1.50 ETH",
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80&sat=100",
    title: "World of Women",
    creator: "By Yam Karkai",
    floor: "2.00 ETH",
  },
];

const now = Date.now();
const featuredDropsData = [
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80&sat=50",
    title: "Mutant Ape Yacht Club",
    creator: "By Yuga Labs",
    floor: "1.94 ETH",
    priceChange: "+5.2%",
    verified: true,
    releaseTime: now + 1000 * 60 * 10, // 10 minutes from now
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80&sat=50",
    title: "Milady Maker",
    creator: "By Milady",
    floor: "2.84 ETH",
    priceChange: "-2.1%",
    releaseTime: now + 1000 * 60 * 2, // 2 minutes from now
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80&sat=50",
    title: "Azuki Elementals",
    creator: "By Azuki",
    floor: "1.23 ETH",
    priceChange: "+1.3%",
    verified: true,
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80&sat=80",
    title: "DeGods",
    creator: "By DeLabs",
    floor: "8.00 ETH",
    priceChange: "-0.8%",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80&sat=80",
    title: "Pudgy Penguins",
    creator: "By Pudgy Penguins",
    floor: "16.60 ETH",
    priceChange: "+3.7%",
    releaseTime: now + 1000 * 60 * 30, // 30 minutes from now
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80&sat=80",
    title: "Redacted Remilio Babies",
    creator: "By Remilio",
    floor: "0.99 ETH",
    priceChange: "-1.2%",
  },
];

export default function HeroSection() {
  return (
    <section className="flex flex-col justify-center items-start min-h-[60vh] px-8 py-6 w-full">
      {/* <h1 className="text-4xl md:text-5xl font-bold text-brand-sky mb-4">
        Discover, Collect, and Sell Extraordinary NFTs
      </h1>
      <p className="text-lg text-brand-pale mb-8 max-w-xl">
        NFTVerse is the world’s leading NFT marketplace. Explore unique digital assets, connect your wallet, and join the future of ownership.
      </p>
      <button className="bg-brand-sky text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-brand-navy transition mb-8">
        Explore Marketplace
      </button> */}
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-8 w-full items-center min-h-[44px]">
        {filters.map(({ name, icon: Icon, to, active }) => (
          <Link
            key={name}
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition border
              ${active ? "bg-brand-sky text-white border-brand-sky shadow" : "bg-transparent text-brand-sky border-brand-sky hover:bg-brand-sky/10"}`}
            style={{ minHeight: 44 }}
          >
            <Icon className={`w-4 h-4 ${active ? "text-white" : "text-brand-sky"}`} />
            {name}
          </Link>
        ))}
      </div>
      {/* Carousel */}
      <div className="w-full">
        <Carousel />
      </div>
      {/* Featured Collections */}
      <Featured
        heading="Featured Collections"
        description="This week's curated collections"
        data={featuredData}
      />
      {/* Featured Drops */}
      <Featured
        heading="Featured Drops"
        description="Don't miss these hot new drops!"
        data={featuredDropsData}
      />
      {/* Steps Section */}
      <Steps />
      {/* Top Sellers Section */}
      <TopSeller />
    </section>
  );
}

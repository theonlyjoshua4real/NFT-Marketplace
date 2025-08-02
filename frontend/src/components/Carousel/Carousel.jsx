import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";

const items = [
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    title: "XOX",
    creator: "kimasendorf",
    floor: "0.47 ETH",
    volume: "89.93 ETH",
    items: "1,000",
    listed: "1.7%",
    verified: true,
    creatorVerified: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Azuki",
    creator: "Azuki Team",
    floor: "2.42 ETH",
    volume: "26.9K ETH",
    items: "10,000",
    listed: "3.2%",
    verified: true,
    creatorVerified: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "CryptoPunks",
    creator: "Larva Labs",
    floor: "47.75 ETH",
    volume: "100K ETH",
    items: "10,000",
    listed: "0.9%",
    verified: true,
    creatorVerified: false,
    thumbnails: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80&sat=100",
    title: "Moonbirds",
    creator: "PROOF Collective",
    floor: "1.80 ETH",
    volume: "26.7K ETH",
    items: "8,888",
    listed: "2.5%",
    verified: false,
    creatorVerified: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80&sat=100",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    ],
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const item = items[current];

  const goLeft = () => setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const goRight = () => setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full max-w-4xl aspect-[2.2/1] mx-auto rounded-3xl overflow-hidden shadow-lg group">
        {/* Main Image */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay Details */}
        <div className="absolute left-0 bottom-0 m-6">
          <div className="bg-black/80 rounded-xl p-5 flex flex-col gap-2 min-w-[320px] max-w-[90vw]">
            <div className="flex items-center gap-2 text-white text-2xl font-bold">
              {item.title}
              {item.verified && <CheckBadgeIcon className="w-6 h-6 text-blue-400" />}
            </div>
            <div className="flex items-center gap-2 text-zinc-300 text-base">
              By {item.creator}
              {item.creatorVerified && <CheckBadgeIcon className="w-4 h-4 text-zinc-400" />}
            </div>
            <div className="flex gap-6 mt-2 text-xs text-zinc-200">
              <div>
                <div className="font-semibold tracking-wide text-zinc-400">FLOOR PRICE</div>
                <div className="text-lg font-bold">{item.floor}</div>
              </div>
              <div>
                <div className="font-semibold tracking-wide text-zinc-400">ITEMS</div>
                <div className="text-lg font-bold">{item.items}</div>
              </div>
              <div>
                <div className="font-semibold tracking-wide text-zinc-400">TOTAL VOLUME</div>
                <div className="text-lg font-bold">{item.volume}</div>
              </div>
              <div>
                <div className="font-semibold tracking-wide text-zinc-400">LISTED</div>
                <div className="text-lg font-bold">{item.listed}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Mini Thumbnails */}
        <div className="absolute bottom-0 right-0 m-6 flex gap-3">
          {item.thumbnails.map((thumb, i) => (
            <img
              key={i}
              src={thumb}
              alt="thumbnail"
              className="w-14 h-14 rounded-lg object-cover border-2 border-zinc-800"
            />
          ))}
        </div>
        {/* Navigation Buttons (show on hover) */}
        <button
          onClick={goLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition focus:outline-none z-10"
          aria-label="Previous"
        >
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <button
          onClick={goRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition focus:outline-none z-10"
          aria-label="Next"
        >
          <ChevronRightIcon className="w-7 h-7" />
        </button>
      </div>
      {/* Pagination Dots */}
      <div className="flex gap-2 mt-6">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-zinc-300 dark:bg-zinc-100" : "w-4 bg-zinc-700 dark:bg-zinc-800"}`}
          />
        ))}
      </div>
    </div>
  );
}

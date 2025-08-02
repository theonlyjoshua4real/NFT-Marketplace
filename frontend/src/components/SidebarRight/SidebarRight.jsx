import { CheckBadgeIcon, FireIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";

const pills = [
  { label: "Top", icon: FireIcon, active: true },
  { label: "Trending", icon: ArrowTrendingUpIcon, active: false },
];

const collections = [
  {
    name: "Azuki",
    verified: true,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
    floor: "2.42 ETH",
    priceChange: "+5.2%",
  },
  {
    name: "CryptoPunks",
    verified: true,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
    floor: "47.75 ETH",
    priceChange: "-1.1%",
  },
  {
    name: "Moonbirds",
    verified: false,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
    floor: "1.80 ETH",
    priceChange: "+2.3%",
  },
  {
    name: "Bored Ape Yacht Club",
    verified: true,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80&sat=100",
    floor: "13.10 ETH",
    priceChange: "+0.7%",
  },
  {
    name: "Doodles",
    verified: false,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80&sat=100",
    floor: "1.50 ETH",
    priceChange: "-0.4%",
  },
  {
    name: "World of Women",
    verified: true,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80&sat=100",
    floor: "2.00 ETH",
    priceChange: "+1.9%",
  },
];

export default function SidebarRight() {
  return (
    <aside className="w-[350px] lg:w-[30%] h-[calc(100vh-4rem)] bg-brand-pale dark:bg-brand-dark border-l border-brand-navy/30 dark:border-brand-pale/10 overflow-y-auto custom-scrollbar flex flex-col">
      <div className="p-6 pb-2">
        {/* Pills */}
        <div className="flex gap-3 mb-6">
          {pills.map((pill) => (
            <button
              key={pill.label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition border
                ${pill.active ? "bg-brand-sky text-white border-brand-sky shadow" : "bg-transparent text-brand-sky border-brand-sky hover:bg-brand-sky/10"}`}
            >
              <pill.icon className={`w-4 h-4 ${pill.active ? "text-white" : "text-brand-sky"}`} />
              {pill.label}
            </button>
          ))}
        </div>
        {/* Collection and Floor headers */}
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Collection</span>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Floor</span>
        </div>
        {/* Collections List */}
        <div className="space-y-4">
          {collections.map((col, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-brand-navy/40 border border-brand-navy/10 dark:border-brand-pale/10">
              <img
                src={col.image}
                alt={col.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-sky"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 font-semibold text-brand-navy dark:text-brand-pale truncate">
                  {col.name}
                  {col.verified && <CheckBadgeIcon className="w-4 h-4 text-brand-sky" />}
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="font-semibold text-brand-navy/70 dark:text-brand-pale/70">Floor:</span>
                  <span className="font-bold text-brand-navy dark:text-brand-pale">{col.floor}</span>
                  <span className={
                    col.priceChange.startsWith("-")
                      ? "text-red-500 font-semibold"
                      : "text-green-500 font-semibold"
                  }>
                    {col.priceChange}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
} 
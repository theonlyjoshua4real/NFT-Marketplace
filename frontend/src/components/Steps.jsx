import { useRef, useState } from "react";
import { CreditCardIcon, HomeModernIcon, FolderPlusIcon, ChartPieIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const steps = [
  {
    step: "STEP-01",
    icon: CreditCardIcon,
    title: "Set up your wallet",
    desc: "Powerful features and inclusions, which makes Nuron standout, easily customizable and scalable.",
  },
  {
    step: "STEP-02",
    icon: HomeModernIcon,
    title: "Create your collection",
    desc: "A great collection of beautiful website templates for your need. Choose the best suitable template.",
  },
  {
    step: "STEP-03",
    icon: FolderPlusIcon,
    title: "Add your NFT's",
    desc: "We've made the template fully responsive, so it looks great on all devices: desktop, tablets and.",
  },
  {
    step: "STEP-04",
    icon: ChartPieIcon,
    title: "Sell Your NFT's",
    desc: "I throw myself down among the tall grass by the stream as I lie close to the earth NFT's.",
  },
];

export default function Steps() {
  const scrollRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: dir === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-12 text-center">Create and sell your NFTs</h2>
      <div className="relative max-w-7xl mx-auto group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-7 h-7" />
        </button>
        <div ref={scrollRef} className="overflow-x-auto w-full custom-scrollbar">
          <div className="flex gap-6 px-4 pb-2">
            {steps.map(({ step, icon: Icon, title, desc }, idx) => (
              <div
                key={step}
                className="relative bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-lg p-8 pt-20 flex flex-col h-[240px] min-w-[320px] max-w-sm border border-zinc-200 dark:border-zinc-800 flex-shrink-0"
              >
                {/* Icon at top right */}
                <div className="absolute top-6 right-6">
                  <Icon className="w-16 h-16 text-brand-sky dark:text-brand-pale drop-shadow-lg" />
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 font-semibold tracking-widest">{step}</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{title}</div>
                <div className="text-zinc-600 dark:text-zinc-300 text-base flex-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
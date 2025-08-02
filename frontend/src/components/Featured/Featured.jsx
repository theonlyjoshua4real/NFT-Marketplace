import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";

function getCountdown(releaseTime) {
  const now = Date.now();
  const diff = Math.max(0, releaseTime - now);
  const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
  const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function Featured({ heading, description, data }) {
  const scrollRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    // Set up countdown timers for all items with releaseTime
    const interval = setInterval(() => {
      setTimers(
        data.map((col) =>
          col.releaseTime ? getCountdown(col.releaseTime) : null
        )
      );
    }, 1000);
    // Initial set
    setTimers(data.map((col) => (col.releaseTime ? getCountdown(col.releaseTime) : null)));
    return () => clearInterval(interval);
  }, [data]);

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

  // Helper to show tooltip on hover if text is truncated
  const handleMouseEnter = (e, text) => {
    const target = e.target;
    if (target.offsetWidth < target.scrollWidth) {
      const rect = target.getBoundingClientRect();
      setTooltip({
        show: true,
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    }
  };
  const handleMouseLeave = () => setTooltip({ show: false, text: "", x: 0, y: 0 });

  return (
    <section className="w-full my-12">
      <div className="mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-1">{heading}</h2>
        <p className="text-zinc-500 dark:text-zinc-300 text-base">{description}</p>
      </div>
      <div className="relative group">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        <div ref={scrollRef} className="overflow-x-auto w-full custom-scrollbar">
          <div className="flex gap-6 px-4 pb-2">
            {data.map((col, idx) => {
              const isUpcoming = col.releaseTime && Date.now() < col.releaseTime;
              const priceChange = col.priceChange;
              return (
                <div
                  key={idx}
                  className="relative min-w-[340px] max-w-sm h-[220px] bg-[var(--bg-main)] rounded-2xl shadow-md border border-[var(--sidebar-border)] overflow-hidden flex-shrink-0 hover:shadow-lg transition group/card"
                >
                  {/* NFT Image fills the card */}
                  <img
                    src={col.image}
                    alt={col.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Timer overlay for upcoming drops */}
                  {isUpcoming && (
                    <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-1 rounded font-mono z-10">
                      {timers[idx]}
                    </div>
                  )}
                  {/* Overlay Details */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                    <div className="flex items-center gap-1 font-bold text-base text-white mb-1 truncate cursor-pointer">
                      <span
                        onMouseEnter={e => handleMouseEnter(e, col.title)}
                        onMouseLeave={handleMouseLeave}
                        className="truncate"
                      >
                        {col.title}
                      </span>
                      {col.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="text-xs text-zinc-200 mb-1 truncate">{col.creator}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-300 font-semibold">Floor price:</span>
                      <span className="text-white font-bold text-base">{col.floor}</span>
                      <span className={
                        priceChange && priceChange.startsWith("-")
                          ? "text-red-400 font-semibold ml-1"
                          : "text-green-400 font-semibold ml-1"
                      }>
                        {priceChange}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Tooltip for truncated names */}
        {tooltip.show && (
          <div
            className="fixed z-50 px-3 py-1 rounded bg-black text-white text-xs shadow-lg pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </section>
  );
}

Featured.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      creator: PropTypes.string.isRequired,
      floor: PropTypes.string.isRequired,
      priceChange: PropTypes.string,
      verified: PropTypes.bool,
      releaseTime: PropTypes.number,
    })
  ).isRequired,
}; 
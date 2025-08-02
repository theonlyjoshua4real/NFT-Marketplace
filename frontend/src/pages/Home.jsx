import HeroSection from "@/components/HeroSection/HeroSection";
import SidebarRight from "@/components/SidebarRight/SidebarRight";
import "../index.css";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-brand-pale dark:bg-brand-dark">
      {/* Left/Main Section */}
      <div className="w-full lg:w-[70%] overflow-y-auto">
        <HeroSection />
        {/* Add more main content here */}
      </div>
      {/* Right/Sidebar Section (fixed on large screens, below navbar) */}
      <SidebarRight />
    </div>
  );
}

/* Add this to index.css:
.custom-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/

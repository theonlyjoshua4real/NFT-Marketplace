import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { images } from "@/assets/images/images";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-brand-dark border-t border-brand-navy pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-12">
        {/* Logo and description */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* NFTVerse logo/text */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <img
                  src={images.gradientlogo}
                  alt="Logo"
                  className="h-10 max-h-12 max-w-[160px] object-contain hidden dark:block"
                  style={{ width: 'auto' }}
                />
              <img
                  src={images.blacklogo}
                  alt="Logo"
                  className="h-10 max-h-12 max-w-[160px] object-contain block dark:hidden"
                  style={{ width: 'auto' }}
                />
            </Link>
          </div>
          <p className="text-brand-navy dark:text-brand-pale text-base leading-relaxed">
            The world’s first and largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items.
          </p>
          {/* Social icons */}
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-brand-sky text-brand-navy dark:text-brand-pale"><FaFacebookF size={22} /></a>
            <a href="#" className="hover:text-brand-sky text-brand-navy dark:text-brand-pale"><FaLinkedinIn size={22} /></a>
            <a href="#" className="hover:text-brand-sky text-brand-navy dark:text-brand-pale"><FaTwitter size={22} /></a>
            <a href="#" className="hover:text-brand-sky text-brand-navy dark:text-brand-pale"><FaYoutube size={22} /></a>
            <a href="#" className="hover:text-brand-sky text-brand-navy dark:text-brand-pale"><FaInstagram size={22} /></a>
          </div>
        </div>
        {/* Discover */}
        <div className="md:col-span-1">
          <h3 className="font-bold text-lg mb-4 text-brand-sky">Discover</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Collection</a></li>
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Search</a></li>
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Author Profile</a></li>
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Account Setting</a></li>
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Upload NFT</a></li>
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Connect Wallet</a></li>
          </ul>
        </div>
        {/* Help Center */}
        <div className="md:col-span-1">
          <h3 className="font-bold text-lg mb-4 text-brand-sky">Help Center</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Support</a></li>
            <li><Link to="/terms" className="hover:underline text-brand-navy dark:text-brand-pale" >Terms of Service</Link></li>
            {/* <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Terms of Service</a></li> */}
            <li><Link to="/privacy" className="hover:underline text-brand-navy dark:text-brand-pale" >Privacy Policy</Link></li>
            {/* <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Privacy Policy</a></li> */}
            {/* <li><a href="#" className="hover:underline text-brand-navy dark:text-brand-pale">Subscription</a></li> */}
          </ul>
        </div>
        {/* Subscribe */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-brand-sky">Subscribe</h3>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email *"
              className="rounded-full px-6 py-3 bg-brand-pale text-brand-navy placeholder-brand-navy/60 focus:outline-none w-full border border-brand-navy/30"
            />
            <button type="submit" className="bg-brand-sky rounded-full p-3 ml-2 hover:bg-brand-navy transition">
              <PaperAirplaneIcon className="w-6 h-6 text-white" />
            </button>
          </form>
          <p className="text-brand-navy dark:text-brand-pale text-base leading-relaxed">
            Discover, collect, and sell extraordinary NFTs. NFTVerse is the world first and largest NFT marketplace
          </p>
        </div>
      </div>
    </footer>
  );
} 
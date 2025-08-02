import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletIcon, SunIcon, MoonIcon, MagnifyingGlassIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserPlusIcon, RectangleStackIcon, Squares2X2Icon, UserIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import {images} from '../../assets/images/images'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with real auth logic
  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('.profile-menu') && !e.target.closest('.profile-icon-btn')) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-brand-navy/20 bg-white/70 dark:bg-brand-dark/80 backdrop-blur-md shadow-md px-6 py-4 font-sans">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* 🔵 Left Section: Logo */}
        <div className="flex items-center">
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
        {/* 🔗 Center Section: Navigation (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-8 items-center">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="text-base font-medium text-brand-navy dark:text-brand-pale hover:text-brand-sky transition">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/contact" className="text-base font-medium text-brand-navy dark:text-brand-pale hover:text-brand-sky transition">
                    Support
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Expanding Search Bar */}
              <NavigationMenuItem>
                <div className="relative flex items-center">
                  <button
                    className={`p-2 rounded-full hover:bg-brand-sky/10 focus:outline-none focus:ring-2 focus:ring-brand-sky transition ${searchOpen ? 'bg-brand-sky/10' : ''}`}
                    aria-label="Open search"
                    onClick={() => setSearchOpen((o) => !o)}
                  >
                    <MagnifyingGlassIcon className="w-6 h-6 text-brand-sky" />
                  </button>
                  <input
                    type="text"
                    className={`absolute left-12 top-1/2 -translate-y-1/2 w-64 rounded-full px-4 py-2 border border-brand-sky bg-white dark:bg-brand-dark text-brand-navy dark:text-brand-pale shadow transition-all duration-300 ${searchOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
                    placeholder="Search collections, users, NFTs..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    autoFocus={searchOpen}
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* 👤 Right Section: Profile, Wallet, and Dark Mode Toggle (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button
              className="profile-icon-btn p-1 rounded-full hover:bg-brand-sky/10 focus:outline-none focus:ring-2 focus:ring-brand-sky transition"
              aria-label="User menu"
              onClick={() => setProfileMenuOpen((open) => !open)}
            >
              <UserCircleIcon className="w-8 h-8 text-brand-navy dark:text-brand-pale" />
            </button>
            {profileMenuOpen && (
              <div className="profile-menu absolute right-0 mt-2 w-48 bg-white dark:bg-brand-dark rounded-lg shadow-lg z-50 border border-brand-navy/10 dark:border-brand-pale/10 origin-top-right transition-all duration-200 transform scale-95 opacity-0 pointer-events-none data-[open=true]:scale-100 data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
                data-open={profileMenuOpen}
                style={{ transitionProperty: 'transform, opacity' }}
              >
                <div className={`transition-all duration-200 ${profileMenuOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {!isLoggedIn ? (
                  <>
                    <Link to="/register" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                      <UserPlusIcon className="w-5 h-5" /> Register
                    </Link>
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                      <ArrowRightOnRectangleIcon className="w-5 h-5" /> Login
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/my-nfts" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                      <RectangleStackIcon className="w-5 h-5" /> My NFTs
                    </Link>
                    <Link to="/collections" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                      <Squares2X2Icon className="w-5 h-5" /> Collections
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                      <UserIcon className="w-5 h-5" /> Profile
                    </Link>
                    <button
                      onClick={() => { setIsLoggedIn(false); setProfileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                    </button>
                  </>
                )}
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-brand-sky to-brand-navy text-white font-bold px-6 py-2 rounded-full shadow-lg hover:from-brand-navy hover:to-brand-sky transition text-base">
            <WalletIcon className="w-5 h-5" />
            Connect Wallet
          </button>
          {/* Light/Dark Mode Toggle */}
          <button
            className="p-2 rounded-full hover:bg-brand-sky/10 focus:outline-none focus:ring-2 focus:ring-brand-sky transition"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6 text-brand-sky" />
            ) : (
              <MoonIcon className="w-6 h-6 text-brand-navy" />
            )}
          </button>
        </div>
        {/* 🍔 Hamburger Button (mobile only) */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-sky"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {/* Hamburger Icon */}
          <svg className="w-6 h-6 text-brand-navy dark:text-brand-pale" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* 📱 Mobile Drawer/Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-40" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white dark:bg-brand-dark shadow-lg p-6 flex flex-col gap-6"
            onClick={e => e.stopPropagation()}
            role="menu"
            aria-label="Mobile menu"
          >
            <button
              className="self-end mb-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-sky"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              {/* Close Icon */}
              <svg className="w-6 h-6 text-brand-navy dark:text-brand-pale" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link to="/" className="text-lg font-medium text-brand-navy dark:text-brand-pale hover:text-brand-sky transition" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/contact" className="text-lg font-medium text-brand-navy dark:text-brand-pale hover:text-brand-sky transition" onClick={() => setMobileMenuOpen(false)}>
              Support
            </Link>
            <div className="flex flex-col gap-2 mt-4">
              {/* Profile Icon with Dropdown (Mobile) */}
              <div className="relative">
                <button
                  className="profile-icon-btn p-1 rounded-full hover:bg-brand-sky/10 focus:outline-none focus:ring-2 focus:ring-brand-sky transition w-fit self-center"
                  aria-label="User menu"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                >
                  <UserCircleIcon className="w-8 h-8 text-brand-navy dark:text-brand-pale" />
                </button>
                {profileMenuOpen && (
                  <div className="profile-menu absolute left-0 mt-2 w-48 bg-white dark:bg-brand-dark rounded-lg shadow-lg z-50 border border-brand-navy/10 dark:border-brand-pale/10 origin-top-left transition-all duration-200 transform scale-95 opacity-0 pointer-events-none data-[open=true]:scale-100 data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
                    data-open={profileMenuOpen}
                    style={{ transitionProperty: 'transform, opacity' }}
                  >
                    <div className={`transition-all duration-200 ${profileMenuOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}>
                    {!isLoggedIn ? (
                      <>
                        <Link to="/register" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                          <UserPlusIcon className="w-5 h-5" /> Register
                        </Link>
                        <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                          <ArrowRightOnRectangleIcon className="w-5 h-5" /> Login
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/my-nfts" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                          <RectangleStackIcon className="w-5 h-5" /> My NFTs
                        </Link>
                        <Link to="/collections" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                          <Squares2X2Icon className="w-5 h-5" /> Collections
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale">
                          <UserIcon className="w-5 h-5" /> Profile
                        </Link>
                        <button
                          onClick={() => { setIsLoggedIn(false); setProfileMenuOpen(false); }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-brand-pale dark:hover:bg-brand-navy text-brand-navy dark:text-brand-pale"
                        >
                          <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                        </button>
                      </>
                    )}
                    </div>
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-brand-sky to-brand-navy text-white font-bold px-6 py-2 rounded-full shadow-lg hover:from-brand-navy hover:to-brand-sky transition text-base w-full justify-center">
                <WalletIcon className="w-5 h-5" />
                Connect Wallet
              </button>
              {/* Light/Dark Mode Toggle (Mobile) */}
              <button
                className="p-2 rounded-full hover:bg-brand-sky/10 focus:outline-none focus:ring-2 focus:ring-brand-sky transition w-fit self-center"
                aria-label="Toggle dark mode"
                onClick={() => setDarkMode((d) => !d)}
              >
                {darkMode ? (
                  <SunIcon className="w-6 h-6 text-brand-sky" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-brand-navy" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {images} from '../assets/images/images'

const carouselImages = [
  // Replace with your NFT or brand images
  images.thumbnail1,
  images.thumbnail2,
  images.thumbnail3,
  images.thumbnail4
];

export default function Register() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Form state
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % carouselImages.length);
        setFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: Handle registration logic
    alert("Registered successfully! (Demo)");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-pale dark:bg-brand-dark font-sans">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:py-0 bg-white dark:bg-brand-dark border-b lg:border-b-0 border-brand-navy/10 dark:border-brand-pale/10">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 text-center">
            <Link to="/" className="block mx-auto w-fit">
              <img
                src={images.gradientlogo}
                alt="Logo"
                className="h-10 max-h-12 max-w-[160px] object-contain hidden dark:block mx-auto"
                style={{ width: 'auto' }}
              />
              <img
                src={images.blacklogo}
                alt="Logo"
                className="h-10 max-h-12 max-w-[160px] object-contain block dark:hidden mx-auto"
                style={{ width: 'auto' }}
              />
            </Link>
            <div className="mt-2 text-lg text-brand-navy dark:text-brand-pale font-medium">Create your account</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-brand-navy dark:text-brand-pale mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-brand-sky bg-brand-pale dark:bg-brand-dark text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky transition"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-navy dark:text-brand-pale mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-brand-sky bg-brand-pale dark:bg-brand-dark text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky transition"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-brand-navy dark:text-brand-pale mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-brand-sky bg-brand-pale dark:bg-brand-dark text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky transition pr-10"
                placeholder="Password"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-8 text-brand-sky focus:outline-none">
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-brand-navy dark:text-brand-pale mb-1">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-brand-sky bg-brand-pale dark:bg-brand-dark text-brand-navy dark:text-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-sky transition pr-10"
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-8 text-brand-sky focus:outline-none">
                {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            <button type="submit" className="w-full py-3 rounded-lg bg-brand-sky hover:bg-brand-navy text-white font-bold text-lg shadow transition">Register</button>
          </form>
          <div className="mt-6 text-center text-sm text-brand-navy dark:text-brand-pale">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-sky hover:underline font-semibold">Login</Link>
          </div>
        </div>
      </div>
      {/* Right: Carousel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-brand-pale dark:bg-brand-dark relative overflow-hidden">
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <div className="relative flex items-center justify-center w-full h-full min-h-[450px] min-w-[450px] max-w-[480px] max-h-[480px] aspect-square mx-auto rounded-3xl shadow-2xl overflow-hidden bg-white/80 dark:bg-brand-dark/80">
            {carouselImages.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt="NFT showcase"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out rounded-3xl ${idx === current && fade ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{ pointerEvents: idx === current ? 'auto' : 'none' }}
              />
            ))}
            {/* Overlay for branding or effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/60 via-brand-navy/40 to-brand-sky/20 rounded-3xl" />
          </div>
          {/* Pagination Dots */}
          <div className="flex gap-2 mt-6">
            {carouselImages.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-brand-sky' : 'w-4 bg-brand-navy/40 dark:bg-brand-pale/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

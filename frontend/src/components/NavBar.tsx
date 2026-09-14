import { useState } from "react";
import WalletBanner from "./WalletBanner";
import { Shield, Menu, X, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full pt-3 px-4 sm:px-6">
        <nav className="max-w-6xl mx-auto h-16 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between px-5 transition-all">
          
          {/* Logo & Network Badge */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Shield size={20} />
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                ScholarShield
              </span>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Preprod</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/50 text-xs font-semibold">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive("/") 
                    ? "bg-white text-emerald-700 font-bold shadow-2xs" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/verify"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive("/verify") 
                    ? "bg-white text-emerald-700 font-bold shadow-2xs" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Verify
              </Link>
              <Link
                to="/dashboard"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive("/dashboard") 
                    ? "bg-white text-emerald-700 font-bold shadow-2xs" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive("/about") 
                    ? "bg-white text-emerald-700 font-bold shadow-2xs" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                About
              </Link>
            </div>
            
            <WalletBanner />
            
            {/* Mobile Menu Toggle */}
            <button 
              aria-label="Toggle mobile menu"
              className="md:hidden flex items-center justify-center w-10 h-10 text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-4 top-24 z-40 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl md:hidden overflow-hidden p-4"
          >
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-800 hover:text-emerald-600 hover:bg-emerald-50/70 transition-colors px-4 py-3 rounded-xl"
              >
                Home
              </Link>
              <Link
                to="/verify"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-800 hover:text-emerald-600 hover:bg-emerald-50/70 transition-colors px-4 py-3 rounded-xl"
              >
                Verify Eligibility
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-800 hover:text-emerald-600 hover:bg-emerald-50/70 transition-colors px-4 py-3 rounded-xl"
              >
                Proof History Dashboard
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-800 hover:text-emerald-600 hover:bg-emerald-50/70 transition-colors px-4 py-3 rounded-xl"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

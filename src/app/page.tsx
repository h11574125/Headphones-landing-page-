"use client";

import HeadphoneScroll from "@/components/HeadphoneScroll";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="bg-[#050505] selection:bg-white selection:text-black">
      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#050505]/30 backdrop-blur-md border-b border-white/[0.03] transition-all duration-500 hover:bg-[#050505]/50 group">
        <div className="max-w-[1200px] mx-auto h-14 flex items-center justify-between px-6 md:px-12 text-white/90">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="text-lg font-bold tracking-tighter flex items-center gap-2"
          >
            ZENITH X
          </motion.a>

          <div className="flex items-center gap-4 md:gap-8">
            <button className="bg-white text-black text-[11px] md:text-[12px] px-4 md:px-5 py-1.5 rounded-full font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5">
              Order Now
            </button>
          </div>
        </div>
      </nav>

      <div className="">
        <HeadphoneScroll />
      </div>

      {/* Footer */}
      <footer className="bg-[#050505] pt-16 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold">Shop and Learn</h3>
              <ul className="text-white/50 text-[12px] space-y-2">
                <li><a href="#" className="hover:underline">Store</a></li>
                <li><a href="#" className="hover:underline">Zenith X</a></li>
                <li><a href="#" className="hover:underline">Aura Pro</a></li>
                <li><a href="#" className="hover:underline">Echo Buds</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold">Zenith Wallet</h3>
              <ul className="text-white/50 text-[12px] space-y-2">
                <li><a href="#" className="hover:underline">Wallet</a></li>
                <li><a href="#" className="hover:underline">Zenith Card</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold">Account</h3>
              <ul className="text-white/50 text-[12px] space-y-2">
                <li><a href="#" className="hover:underline">Manage Your ID</a></li>
                <li><a href="#" className="hover:underline">Zenith Store Account</a></li>
                <li><a href="#" className="hover:underline">iCloud.com</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold">Business</h3>
              <ul className="text-white/50 text-[12px] space-y-2">
                <li><a href="#" className="hover:underline">Zenith and Business</a></li>
                <li><a href="#" className="hover:underline">Shop for Business</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-6 text-[12px] text-white/40">
            <p>Copyright © 2026 Zenith Acoustic Labs. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <a href="#" className="hover:underline hover:text-white/60">Privacy Policy</a>
              <a href="#" className="hover:underline hover:text-white/60">Terms of Use</a>
              <a href="#" className="hover:underline hover:text-white/60">Sales and Refunds</a>
              <a href="#" className="hover:underline hover:text-white/60">Site Map</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

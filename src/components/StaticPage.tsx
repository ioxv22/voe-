"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function StaticPage({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#020202]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-4xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">
                {title}
            </h1>
            <div className="h-1 w-20 bg-primary-600" />
            
            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed space-y-6">
                {children}
            </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

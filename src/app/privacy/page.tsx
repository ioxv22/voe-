"use client";

import StaticPage from "@/components/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
        <p className="text-xl text-white font-medium">Your privacy is safe in the hands of VOZ STREAM.</p>
        
        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest">1. Data Encryption</h3>
            <p>At VOZ STREAM, we use advanced 256-bit encryption to ensure that your profile data, PINs, and watch history are never accessible to third parties. We value your digital security above all else.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest">2. Ad Protocols</h3>
            <p>While we use external video sources, our platform limits tracking. We do not sell your email or personal information to advertising networks. Your identity stays your business.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest">3. Cookie Protection</h3>
            <p>We only use essential cookies to keep you logged in and remember your profile settings. No cross-site tracking, no prying eyes.</p>
        </div>

        <div className="pt-8 border-t border-white/5">
            <p className="text-xs italic">Last updated: April 2026 | Managed by Hamad Al-Abdouli</p>
        </div>
    </StaticPage>
  );
}

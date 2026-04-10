"use client";

import StaticPage from "@/components/StaticPage";
import { MessageCircle, HelpCircle, Shield, CreditCard } from "lucide-react";

export default function HelpPage() {
  return (
    <StaticPage title="Help Center">
        <p className="text-xl text-white font-medium mb-12">How can we assist you today?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-600/50 transition cursor-default">
                <Shield className="text-primary-600 mb-4" size={32} />
                <h3 className="text-white font-bold mb-2">Account Recovery</h3>
                <p className="text-sm">Lost your PIN? Forgot your login method? Our team can help you recover your profiles manually.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-600/50 transition cursor-default">
                <CreditCard className="text-primary-600 mb-4" size={32} />
                <h3 className="text-white font-bold mb-2">VIP Payment Issues</h3>
                <p className="text-sm">Activated a subscription but don't see the crown? Send your proof of payment to @iivoz instantly.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-600/50 transition cursor-default">
                <HelpCircle className="text-primary-600 mb-4" size={32} />
                <h3 className="text-white font-bold mb-2">Request Movie</h3>
                <p className="text-sm">Can't find your favorite anime or series? We update our database daily upon request.</p>
            </div>

            <a href="https://t.me/iivoz" target="_blank" className="p-6 rounded-2xl bg-primary-600 text-black hover:bg-primary-700 transition flex flex-col items-center justify-center text-center gap-4">
                <MessageCircle size={40} />
                <h3 className="font-black uppercase tracking-widest">LIVE CHAT ON TELEGRAM</h3>
            </a>
        </div>

        <div className="pt-12 text-center text-sm text-gray-600">
            Current Server Status: <span className="text-green-500 font-bold">ALL SYSTEMS OPERATIONAL (Dubai-DXB)</span>
        </div>
    </StaticPage>
  );
}

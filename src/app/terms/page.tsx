"use client";

import StaticPage from "@/components/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service">
        <p className="text-xl text-white font-medium">Welcome to the future of streaming. By using VOZ STREAM, you agree to the following terms:</p>
        
        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest">1. Global Access</h3>
            <p>VOZ STREAM is a discovery platform. We provide links to external content servers. Users are responsible for ensuring they comply with local regulations while consuming media.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest">2. Fair Usage</h3>
            <p>Our bandwidth and resources are for human viewers. Botting, scraping, or attempting to duplicate the platform's infrastructure is strictly prohibited and protected by our security protocols.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest">3. VIP Subscriptions</h3>
            <p>VIP status is a support contribution to help maintain the site's servers and development. All payments (25 AED) are handled via our Telegram @iivoz and are non-refundable once activated.</p>
        </div>

        <div className="pt-8 border-t border-white/5">
            <p className="text-xs italic">By entering this domain, you accept the full Terms of VOZ Protocol.</p>
        </div>
    </StaticPage>
  );
}

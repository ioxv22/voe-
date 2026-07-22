"use client";

import { useState } from "react";
import { 
  Crown, 
  Apple, 
  Smartphone, 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight,
  Copy,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 lg:p-6"
      >
        <div className="relative max-w-4xl w-full bg-[#050505] border border-white/5 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(20,184,166,0.1)] flex flex-col lg:flex-row min-h-[600px]">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[120] p-2 bg-white/5 rounded-full text-gray-500 hover:text-white transition"
          >
            <ChevronRight className="rotate-90 lg:rotate-0" />
          </button>

          {/* Left Side: The Hook */}
          <div className="lg:w-2/5 p-10 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent border-r border-white/5 flex flex-col justify-between">
            <div>
              <div className="h-16 w-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mb-8 border border-primary-600/30">
                <Crown size={32} className="text-primary-500" />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
                VOZ <span className="text-primary-500">ULTIMATE</span> PROTOCOL
              </h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed italic">
                Unlock 4K streaming nodes, Zero Advertisements, and priority support.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-primary-500 mb-1">Monthly Plan</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black italic tracking-tighter text-white">10</span>
                  <span className="text-sm font-black text-gray-400 uppercase italic">AED / MONTH</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Benefit text="Pure Experience (No Ads)" />
                <Benefit text="4K Ultra HD Source Nodes" />
                <Benefit text="Priority Request Handling" />
                <Benefit text="Exclusive Discord/TG Role" />
              </div>
            </div>
          </div>

          {/* Right Side: Payment Methods */}
          <div className="lg:w-3/5 p-10 flex flex-col justify-center">
            {!selectedMethod ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Select Payment Method</h3>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">Fast & Encrypted Transaction Protocol</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <PaymentCard 
                    icon={<Apple size={24} />} 
                    title="Apple Pay / Card" 
                    desc="Instant Activation via Ziina"
                    color="bg-white text-black"
                    onClick={() => setSelectedMethod('ziina')}
                  />
                  <PaymentCard 
                    icon={<Smartphone size={24} />} 
                    title="Etisalat Credit" 
                    desc="+971 54 401 266"
                    color="bg-green-600/20 text-green-500 border-green-600/30"
                    onClick={() => setSelectedMethod('etisalat')}
                  />
                  <PaymentCard 
                    icon={<Smartphone size={24} />} 
                    title="Du Credit" 
                    desc="+971 55 803 4801"
                    color="bg-blue-600/20 text-blue-500 border-blue-600/30"
                    onClick={() => setSelectedMethod('du')}
                  />
                  <PaymentCard 
                    icon={<CreditCard size={24} />} 
                    title="LikeCard / Others" 
                    desc="Manual Verification Required"
                    color="bg-white/5 text-gray-400 border-white/10"
                    onClick={() => setSelectedMethod('manual')}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <button 
                  onClick={() => setSelectedMethod(null)}
                  className="text-primary-500 text-[10px] font-black uppercase flex items-center gap-2 hover:translate-x-[-4px] transition"
                >
                  ← Back to methods
                </button>

                {selectedMethod === 'ziina' && (
                  <div className="text-center space-y-6">
                    <Apple size={48} className="mx-auto text-white" />
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Apple Pay Checkout</h3>
                    <p className="text-gray-400 text-sm font-medium">Click the button below to pay 10 AED via Ziina. Send a screenshot to @VOZSTREAM after payment.</p>
                    <a 
                      href="https://pay.ziina.com/uae7stor/m0kbO0-MN9" 
                      target="_blank"
                      className="block w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:scale-105 transition shadow-2xl"
                    >
                      Pay via Ziina <ExternalLink size={18} />
                    </a>
                  </div>
                )}

                {(selectedMethod === 'etisalat' || selectedMethod === 'du') && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Smartphone className="text-primary-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase italic">{selectedMethod.toUpperCase()} RECHARGE</h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase italic">Send 10 AED Credit to the number below</p>
                      </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 relative group">
                      <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Target Number</p>
                      <p className="text-2xl font-black tracking-widest text-white">
                        {selectedMethod === 'etisalat' ? '+971 54 401 266' : '+971 55 803 4801'}
                      </p>
                      <button 
                        onClick={() => handleCopy(selectedMethod === 'etisalat' ? '+97154401266' : '+971558034801', 'num')}
                        className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-primary-600/10 text-primary-500 rounded-xl hover:bg-primary-600 hover:text-black transition"
                      >
                        {copied === 'num' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-3xl">
                      <p className="text-xs font-bold text-yellow-500 flex items-start gap-3 italic">
                        <Zap size={16} className="mt-1 flex-shrink-0" />
                        <span>After sending the credit, please contact @VOZSTREAM on Telegram with your email to activate your account.</span>
                      </p>
                    </div>

                    <a 
                      href="https://t.me/iivoz" 
                      target="_blank"
                      className="block w-full bg-primary-600 text-black py-5 rounded-2xl font-black uppercase text-sm text-center hover:bg-primary-500 transition shadow-xl"
                    >
                      Message @iivoz
                    </a>
                  </div>
                )}

                {selectedMethod === 'manual' && (
                  <div className="text-center space-y-8 py-10">
                    <CreditCard size={48} className="mx-auto text-gray-500" />
                    <div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Manual Verification</h3>
                      <p className="text-gray-400 text-sm font-medium italic">We accept LikeCard, Binance, and other methods via manual chat.</p>
                    </div>
                    <a 
                      href="https://t.me/iivoz" 
                      target="_blank"
                      className="block w-full bg-white/10 text-white py-5 rounded-2xl font-black uppercase text-sm border border-white/10 hover:bg-white/20 transition"
                    >
                      Chat with Support (@iivoz)
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-white/60">
      <CheckCircle2 size={14} className="text-primary-500" />
      <span className="text-[10px] font-black uppercase tracking-tight">{text}</span>
    </div>
  );
}

function PaymentCard({ icon, title, desc, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-[2rem] border border-transparent flex items-center justify-between text-left transition hover:scale-[1.02] active:scale-95 group ${color || 'bg-white/5 border-white/5 text-white'}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-black/10 rounded-2xl">{icon}</div>
        <div>
          <h4 className="font-black uppercase italic tracking-tighter text-sm">{title}</h4>
          <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{desc}</p>
        </div>
      </div>
      <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

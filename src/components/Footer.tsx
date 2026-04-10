import { Send, Terminal } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-30 border-t border-white/10 bg-[#020202] py-20 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                <img 
                    src="/logo.png" 
                    alt="VOZ Stream" 
                    className="h-10 w-auto object-contain" 
                />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium cinematic experience delivered directly to your screens. Built for the next generation of streamers by Hamad Al-Abdouli.
            </p>
            <div className="flex items-center gap-4">
                <a href="https://t.me/iivoz" target="_blank" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition">
                    <Send size={18} />
                </a>
                <Link href="/admin" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-800 hover:text-primary-600 hover:bg-white/10 transition group">
                    <Terminal size={18} className="group-hover:scale-110 transition" />
                </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-500">
                <Link href="/browse"><li className="hover:text-white cursor-pointer transition">Browse All</li></Link>
                <Link href="/"><li className="hover:text-white cursor-pointer transition">Trending Now</li></Link>
                <Link href="/"><li className="hover:text-white cursor-pointer transition">New Releases</li></Link>
                <Link href="/"><li className="hover:text-white cursor-pointer transition">Top Rated</li></Link>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Legal & Help</h4>
            <ul className="space-y-4 text-sm text-gray-500">
                <Link href="/help"><li className="hover:text-white cursor-pointer transition">Help Center</li></Link>
                <a href="https://t.me/iivoz" target="_blank"><li className="hover:text-white cursor-pointer transition">Contact Us</li></a>
                <Link href="/privacy"><li className="hover:text-white cursor-pointer transition">Privacy Policy</li></Link>
                <Link href="/terms"><li className="hover:text-white cursor-pointer transition">Terms of Service</li></Link>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-primary uppercase text-xs tracking-widest">Copyrights</h4>
            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary-600/10 border border-primary-600/20">
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Developer</p>
                    <p className="text-white font-black text-lg">حمد العبدولي</p>
                    <p className="text-[10px] text-gray-500 mt-2 hover:text-white transition">Telegram: @iivoz</p>
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">&copy; 2026 VOZ STREAM. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

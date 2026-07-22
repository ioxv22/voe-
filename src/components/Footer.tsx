import { Send, Terminal, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveCounter from "./LiveCounter";
import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-30 border-t border-[#333333] bg-[#0B0B0B] py-16 px-6 lg:px-12 text-right" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo variant="full" size="md" showTagline={true} />
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              منصة VistaFlix الأولى لمشاهدة أحدث الأفلام، المسلسلات، الأنمي البث المباشر للمباريات بجودة عالية وبدون إعلانات.
            </p>
            <div className="flex items-center gap-3 pt-2">
                <a 
                  href="https://t.me/VOZSTREAM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#171717] border border-[#333333] text-[#B3B3B3] hover:text-[#229ED9] hover:border-[#229ED9]/50 transition"
                  aria-label="Telegram"
                >
                    <Send size={18} />
                </a>
                <Link 
                  href="/admin" 
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#171717] border border-[#333333] text-[#333333] hover:text-[#E50914] hover:border-[#E50914]/50 transition group"
                  aria-label="Admin"
                >
                    <Terminal size={18} className="group-hover:scale-110 transition" />
                </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">تصفح المحتوى</h4>
            <ul className="space-y-2.5 text-xs text-[#B3B3B3]">
                <li><Link href="/browse?type=movie" className="hover:text-white transition">الأفلام السينمائية</Link></li>
                <li><Link href="/browse?type=tv" className="hover:text-white transition">المسلسلات التلفزيونية</Link></li>
                <li><Link href="/matches" className="hover:text-white transition">جدول المباريات المباشر</Link></li>
                <li><Link href="/browse?genre=premium_arabic" className="hover:text-white transition">حصريات VistaFlix</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">المساعدة والشروط</h4>
            <ul className="space-y-2.5 text-xs text-[#B3B3B3]">
                <li><Link href="/help" className="hover:text-white transition">مركز المساعدة</Link></li>
                <li><a href="https://t.me/VOZSTREAM" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">الدعم الفني المباشر</a></li>
                <li><Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">شروط الاستخدام</Link></li>
            </ul>
          </div>

          {/* Live Stats & Rights */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} className="text-[#E50914] fill-[#E50914]" />
                <span>حالة الشبكة الحية</span>
            </h4>
            <LiveCounter />
            <div className="mt-6 pt-4 border-t border-[#333333]">
                <p className="text-[11px] font-bold text-white">VistaFlix Platform</p>
                <p className="text-[10px] text-[#B3B3B3] mt-1">&copy; 2026 VistaFlix Inc. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

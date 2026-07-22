import { Send, Terminal, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveCounter from "./LiveCounter";
import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-30 border-t border-[#25252B] bg-[#050505] py-16 px-6 lg:px-12 text-right font-['Tajawal']" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo variant="full" size="md" showTagline={true} />
            <p className="text-xs text-[#B6B6BD] leading-relaxed">
              منصة VistaFlix — عالمك، أفلامك. مشاهدة أحدث الأفلام والمسلسلات والأنمي والبث المباشر للمباريات بجودة عالية HD/4K.
            </p>
            <div className="flex items-center gap-3 pt-2">
                <a 
                  href="https://t.me/VOZSTREAM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#111114] border border-[#25252B] text-[#B6B6BD] hover:text-[#229ED9] hover:border-[#229ED9]/50 transition"
                  aria-label="Telegram"
                >
                    <Send size={18} />
                </a>
                <Link 
                  href="/admin" 
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#111114] border border-[#25252B] text-[#25252B] hover:text-[#E50924] hover:border-[#E50924]/50 transition group"
                  aria-label="Admin"
                >
                    <Terminal size={18} className="group-hover:scale-110 transition" />
                </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">تصفح المحتوى</h4>
            <ul className="space-y-2.5 text-xs text-[#B6B6BD]">
                <li><Link href="/browse?type=movie" className="hover:text-white transition">الأفلام السينمائية</Link></li>
                <li><Link href="/browse?type=tv" className="hover:text-white transition">المسلسلات التلفزيونية</Link></li>
                <li><Link href="/matches" className="hover:text-white transition">جدول المباريات المباشر</Link></li>
                <li><Link href="/browse?genre=premium_arabic" className="hover:text-white transition">حصريات VistaFlix</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">المساعدة والشروط</h4>
            <ul className="space-y-2.5 text-xs text-[#B6B6BD]">
                <li><Link href="/help" className="hover:text-white transition">مركز المساعدة</Link></li>
                <li><a href="https://t.me/VOZSTREAM" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">الدعم الفني المباشر</a></li>
                <li><Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">شروط الاستخدام</Link></li>
            </ul>
          </div>

          {/* Live Stats & Rights */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} className="text-[#E50924] fill-[#E50924]" />
                <span>حالة الشبكة الحية</span>
            </h4>
            <LiveCounter />
            <div className="mt-6 pt-4 border-t border-[#25252B]">
                <p className="text-[11px] font-bold text-white">VistaFlix Platform</p>
                <p className="text-[10px] text-[#B6B6BD] mt-1">&copy; 2026 VistaFlix. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

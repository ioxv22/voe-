'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function SmartRedirect() {
    const router = useRouter();
    const { platform } = useParams();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. تتبع المصدر وتخزينه
            const source = Array.isArray(platform) ? platform[0] : platform;
            localStorage.setItem('referral_source', source || 'social');
            
            // 2. تعيين ملف تعريف الارتباط (Cookie) ليدوم أطول
            document.cookie = `visit_source=${source}; path=/; max-age=86400`; // لمدة يوم واحد

            // 3. تأخير بسيط لإعطاء شعور بالاحترافية أو عرض لوادر
            const timer = setTimeout(() => {
                // يمكنك توجيههم لصفحة الأفلام مباشرة أو الصفحة الرئيسية
                router.push('/?welcome=true');
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [platform, router]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <div className="loader"></div>
            <h2 style={{ marginTop: '20px', fontWeight: '300' }}>
                {platform === 'tiktok' ? 'اهلا بك يا بطل تيك توك...' : 
                 platform === 'insta' ? 'مرحباً بزوار إنستقرام...' : 
                 'جاري تحويلك إلى VOZ Stream...'}
            </h2>
            <p style={{ color: '#666', fontSize: '14px' }}>استعد لتجربة سينمائية فريدة</p>

            <style jsx>{`
                .loader {
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid #E50914;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

"use client";

export default function NativeAd() {
  return (
    <div className="w-full flex justify-center my-8 px-4 overflow-hidden rounded-xl">
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[120px] flex items-center justify-center relative">
        <iframe 
            title="Ad"
            srcDoc={`
                <!DOCTYPE html>
                <html>
                    <body style="margin:0;padding:0;background:transparent;display:flex;justify-content:center;align-items:center;min-height:100px;">
                        <script async="async" data-cfasync="false" src="https://pl29118998.profitablecpmratenetwork.com/a279fcd0ccd0a0b5b0dcace3052c9bcf/invoke.js"></script>
                        <div id="container-a279fcd0ccd0a0b5b0dcace3052c9bcf"></div>
                    </body>
                </html>
            `}
            style={{ width: '100%', minHeight: '120px', border: 'none', overflow: 'hidden' }}
            scrolling="no"
        />
        <div className="absolute top-1 right-2 text-[8px] text-gray-600 font-bold uppercase tracking-widest pointer-events-none">Advertisement</div>
      </div>
    </div>
  );
}

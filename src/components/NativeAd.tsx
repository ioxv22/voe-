"use client";

import { useEffect } from "react";

export default function NativeAd() {
  useEffect(() => {
    const containerId = "container-a279fcd0ccd0a0b5b0dcace3052c9bcf";
    const container = document.getElementById(containerId);
    
    if (container && !document.getElementById("adsterra-native-banner-script")) {
      const script = document.createElement("script");
      script.id = "adsterra-native-banner-script";
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = "https://pl29118998.profitablecpmratenetwork.com/a279fcd0ccd0a0b5b0dcace3052c9bcf/invoke.js";
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-8 px-4 overflow-hidden">
      <div id="container-a279fcd0ccd0a0b5b0dcace3052c9bcf" className="max-w-full overflow-hidden"></div>
    </div>
  );
}

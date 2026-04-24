const WORKERS = [
  "https://pixelstream.pixelstream1.workers.dev",
  "https://iplt20-5c89.lahaye9139.workers.dev",
  "https://nebula.stigma.workers.dev",
  "https://nebula.autos",
  "https://pixelstream3.niburoqi.workers.dev"
];
const STREAM_TOKEN = "px-2C1y80YMN";

export const SERVER_MAP = {
  nebula: "nebula",
  vidlink: "vidlink",
  multi: "multi",
  beta: "fast",
  alpha: "primary",
  vidsrc: "vidsrc",
  vidsrcme: "vidsrcme",
  auto: "auto",
  school: "school",
  vpn: "vpn",
  akwam: "akwam",
  fasel: "faselhd",
  alooy: "alooy"
};

// Security Protocol: Universal Link Obfuscation
const obs = (url: string) => {
    try {
        const b64 = typeof window !== 'undefined' ? btoa(url) : Buffer.from(url).toString('base64');
        return b64.split("").reverse().join("");
    } catch {
        return url;
    }
};

export const decodeObs = (str: string) => {
    try {
        return atob(str.split("").reverse().join(""));
    } catch {
        return "";
    }
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false, lang: string = "en", isVIP: boolean = false) => {
  const targetServer = isRoom ? "auto" : server;
  
  // Refined Parameter Set for Maximum Compatibility
  const adParam = "&ads=0&adblock=1&autoplay=false&primaryColor=14b8a6";
  const vidlinkAr = "&subs=ar&multi_lang=true&ads=0";

  let finalUrl = "";

  // Dynamic Worker Selection for Nebula
  const getNebulaWorker = () => {
    // Return a random worker from the pool
    return WORKERS[Math.floor(Math.random() * WORKERS.length)];
  };

  // Original Nebula Proxy Engine
  if (targetServer === "nebula" || targetServer === "multi") {
      const worker = getNebulaWorker();
      const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
      // Note: Removed &mime=true as it causes 503/403 on some workers
      finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }
  else if (targetServer === "auto" || targetServer === "vidlink") {
      finalUrl = `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6${adParam}`;
  }
  else if (targetServer === "vidsrc") finalUrl = `https://vidsrc.pm/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  else if (targetServer === "vidsrcme") finalUrl = type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}${adParam}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}${adParam}`;
  
  else if (targetServer === "school" || targetServer === "vpn" || targetServer === "tunnel") {
    // School Bypass uses randomized pool
    const worker = WORKERS[Math.floor(Math.random() * WORKERS.length)];
    const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
    finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }

  // Content Specialists
  else if (targetServer === "akwam") finalUrl = `https://vidsrc.rip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  else if (targetServer === "fasel") finalUrl = `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6${vidlinkAr}`;
  else if (targetServer === "alooy") finalUrl = `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;

  else {
    // Default Fallback
    const worker = WORKERS[0];
    const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
    finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }

  return obs(finalUrl);
};

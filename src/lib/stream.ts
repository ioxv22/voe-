const WORKERS = [
  "https://pixelstream.pixelstream1.workers.dev",
  "https://iplt20-5c89.lahaye9139.workers.dev",
  "https://pixelstream3.niburoqi.workers.dev",
  "https://vidlink.pro"
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
  // Smart Load Balancer for Nebula Workers
  const nebulaWorkers = WORKERS.filter(w => w.includes("workers.dev"));
  const getRandomWorker = () => nebulaWorkers[Math.floor(Math.random() * nebulaWorkers.length)];
  
  // Forced Ad-Free Protocol 2026 - Maximum Aggression
  const adParam = "&ads=0&adblock=1&iv_load_policy=3&mime=true&autoplay=false&primaryColor=14b8a6";
  const vidlinkAr = "&subs=ar&multi_lang=true&ads=0";

  let finalUrl = "";

  // Original Nebula Proxy Engine with Smart Rotation
  if (targetServer === "nebula" || targetServer === "multi") {
      const worker = getRandomWorker();
      const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
      finalUrl = `${worker}${path}?&server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }
  else if (targetServer === "auto" || targetServer === "vidlink") {
      finalUrl = `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6${adParam}`;
  }
  else if (targetServer === "vidsrc") finalUrl = `https://vidsrc.pm/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  else if (targetServer === "vidsrcme") finalUrl = type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}${adParam}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}${adParam}`;
  
  else if (targetServer === "school" || targetServer === "vpn" || targetServer === "tunnel") {
    const isTurbo = typeof window !== "undefined" && localStorage ? localStorage.getItem("voz_turbo_mode") === "true" : false;
    const worker = isTurbo ? WORKERS[0] : getRandomWorker();
    const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
    finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }

  // Content Specialists
  else if (targetServer === "akwam") finalUrl = `https://vidsrc.rip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  else if (targetServer === "fasel") finalUrl = `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6${vidlinkAr}`;
  else if (targetServer === "alooy") finalUrl = `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;

  else {
    const worker = getRandomWorker();
    const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
    finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }

  return obs(finalUrl);
};

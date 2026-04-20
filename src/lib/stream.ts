const WORKERS = [
  "https://lucky-pond-0426.xhx1997.workers.dev",
  "https://voz-bypass.worker.stream",
  "https://metadata-proxy.workers.dev"
];
const STREAM_TOKEN = "px-2C1y80YMN";

export const SERVER_MAP = {
  nebula: "nebula",
  beta: "fast",
  alpha: "primary",
  nova: "nova",
  helix: "helix",
  lunar: "lunar",
  galactus: "galactus",
  vidsrc: "vidsrc",
  vpro: "vpro", 
  super: "super", 
  zero: "zero",
  embedsu: "embedsu",
  vidsrcme: "vidsrcme",
  auto: "auto",
  xyz: "xyz",
  vip: "vip",
  pm: "pm",
  direct: "direct",
  net: "net",
  two: "two",
  lucid: "lucid",
  school: "school",
  vpn: "vpn",
  tunnel: "tunnel",
  arabic1: "al-primary",
  arabic2: "al-mirror",
  akwam: "akwam",
  egybest: "egybest",
  wecima: "wecima",
  fasel: "faselhd",
  alooy: "alooy"
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false, lang: string = "en", isVIP: boolean = false) => {
  const targetServer = isRoom ? "auto" : server;
  // Forced Ad-Free Protocol 2026
  const adParam = "&ads=0&adblock=1&iv_load_policy=3&mime=true&autoplay=false";
  const vidlinkAr = "&subs=ar&multi_lang=true&ads=0";

  // Unified Anti-Ad Mirror Strategy
  if (targetServer === "auto" || targetServer === "nebula") return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914${adParam}`;
  if (targetServer === "vpro") return `https://vidsrc.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}${adParam}`;
  if (targetServer === "embedsu") return `https://embed.su/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "vidsrcme") return type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}${adParam}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}${adParam}`;
  if (targetServer === "vidsrc") return `https://vidsrc.to/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "xyz") return `https://vidsrc.xyz/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}${adParam}`;
  if (targetServer === "vip") return `https://vidsrc.vip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "pm" || targetServer === "alooy") return `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "direct") return `https://vidsrc.io/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "net") return `https://vidsrc.net/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "super") return `https://multiembed.mov/directstream.php/?video_id=${id}&tmdb=1${type === 'tv' ? `&s=${season}&e=${episode}` : ''}${adParam}`;
  
  if (targetServer === "school" || targetServer === "vpn" || targetServer === "tunnel") {
    const isTurbo = typeof window !== "undefined" && localStorage.getItem("voz_turbo_mode") === "true";
    const worker = isTurbo ? WORKERS[1] : WORKERS[Math.floor(Math.random() * WORKERS.length)];
    const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
    return `${worker}${path}?server=nebula&token=${STREAM_TOKEN}${adParam}`;
  }

  // Arabic Content Specialists
  if (targetServer === "arabic1" || targetServer === "egybest") return `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}${adParam}`;
  if (targetServer === "akwam") return `https://vidsrc.rip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  if (targetServer === "fasel") return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914${vidlinkAr}`;

  const worker = WORKERS[0];
  const serverParam = SERVER_MAP[targetServer as keyof typeof SERVER_MAP] || "nebula";
  const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
  return `${worker}${path}?server=${serverParam}&token=${STREAM_TOKEN}${adParam}`;
};

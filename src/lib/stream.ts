const WORKERS = [
  "https://lucky-pond-0426.xhx1997.workers.dev",
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
  fasel: "faselhd"
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false, lang: string = "en", isVIP: boolean = false) => {
  const targetServer = isRoom ? "auto" : server;
  // Forced Ad-Free for Recording
  const adParam = isVIP ? "&adblock=1&ads=0" : "";
  const vidlinkAr = isVIP ? "&adblock=1&ads=0&subs=ar&multi_lang=true" : "&subs=ar&multi_lang=true";

  // Primary Reliable Mirrors (No Worker needed)
  if (targetServer === "auto") return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914&autoplay=false${adParam}`;
  if (targetServer === "vpro") return `https://vidsrc.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}${isVIP ? '?ads=0' : ''}`;
  if (targetServer === "embedsu") return `https://embed.su/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "vidsrcme") return type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}${adParam}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}${adParam}`;
  if (targetServer === "vidsrc") return `https://vidsrc.to/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "xyz") return `https://vidsrc.xyz/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "vip") return `https://vidsrc.vip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "pm" || targetServer === "alooy") return `https://vidsrc.stream/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "direct") return `https://vidsrc.io/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "net") return `https://vidsrc.net/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "two") return `https://www.2embed.cc/embed/${type === 'movie' ? 'movie' : 'series'}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "gomo") return `https://gomo.to/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "super") return `https://multiembed.mov/directstream.php/?video_id=${id}&tmdb=1${type === 'tv' ? `&s=${season}&e=${episode}` : ''}${adParam}`;
  if (targetServer === "school" || targetServer === "vpn" || targetServer === "tunnel") {
    return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914&autoplay=true${adParam}`;
  }

  // Arabic Content Specialists (Reliable 2026 Mirrors)
  if (targetServer === "arabic1" || targetServer === "egybest") return `https://vidsrc.stream/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}${adParam}`;
  if (targetServer === "arabic2" || targetServer === "wecima") return `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "akwam") return `https://vidsrc.rip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "fasel") return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914&autoplay=false${vidlinkAr}`;

  const worker = WORKERS[0];
  const serverParam = SERVER_MAP[targetServer as keyof typeof SERVER_MAP] || "nebula";

  const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
  const extraParams = adParam + (isRoom ? "&autoplay=1" : "");
  return `${worker}${path}?server=${serverParam}&token=${STREAM_TOKEN}${extraParams}`;
};

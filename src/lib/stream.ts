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
  vip: "vip"
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false, lang: string = "en") => {
  const targetServer = (isRoom || lang === 'ar') ? "auto" : server;

  // Primary Reliable Mirrors (No Worker needed)
  if (targetServer === "auto") return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914&autoplay=false`;
  if (targetServer === "vpro") return `https://vidsrc.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "embedsu") return `https://embed.su/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "vidsrcme") return type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}`;
  if (targetServer === "vidsrc") return `https://vidsrc.to/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "xyz") return `https://vidsrc.xyz/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "vip") return `https://vidsrc.vip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
  if (targetServer === "super") return `https://multiembed.mov/directstream.php/?video_id=${id}&tmdb=1${type === 'tv' ? `&s=${season}&e=${episode}` : ''}`;

  // Worker Fallback (Nebula, Fast, etc.)
  const worker = WORKERS[0];
  const serverParam = SERVER_MAP[targetServer as keyof typeof SERVER_MAP] || "nebula";
  const path = type === "movie" ? `/embed/movie/${id}` : `/embed/tv/${id}/${season}/${episode}`;
  const extraParams = isRoom ? "&adblock=1&autoplay=1" : "";
  return `${worker}${path}?server=${serverParam}&token=${STREAM_TOKEN}${extraParams}`;
};

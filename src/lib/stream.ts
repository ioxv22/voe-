export const WORKERS = [
  "https://pixelstream.pixelstream1.workers.dev",
  "https://iplt20-5c89.lahaye9139.workers.dev",
  "https://pixelstream3.niburoqi.workers.dev"
];

const STREAM_TOKEN = "px-2C1y80YMN";

export const SERVER_MAP = {
  nebula: "nebula",
  nebula_classic: "nebula_classic",
  vidlink: "vidlink",
  multi: "multi",
  vidsrc: "vidsrc",
  vidsrcme: "vidsrcme",
  auto: "auto",
  akwam: "akwam",
  fasel: "faselhd",
  alooy: "alooy",
  quantum: "quantum",
  super: "super",
  autoembed: "autoembed"
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false, lang: string = "en", isVIP: boolean = false) => {
  const targetServer = isRoom ? "auto" : server;
  // AGGRESSIVE AD-BLOCKING & PREMIUM UI PROTOCOL (NATIVE BYPASS)
  // ENHANCED AD-BYPASS & SUBTITLE ENGINE (STEALTH MODE)
  const adParam = "&ads=0&noads=1&subtitles=1&sub_lang=all&sub=all&all_subs=1&clean_subs=1&primaryColor=E50914&iv_load_policy=3&modestbranding=1&rel=0&player_ads=0&popups=0&adblock=1&v=4&autoplay=1&bypass=true";

  let finalUrl = "";

  if (targetServer === "nebula" || targetServer === "nebula_classic" || targetServer === "quantum") {
    // PIXEL-STREAM ENGINE (PRIMARY)
    const nebulaWorkers = WORKERS.filter(w => w.includes("workers.dev"));
    const workerIndex = (parseInt(id) || 0) % (nebulaWorkers.length || 1);
    const worker = nebulaWorkers[workerIndex] || "https://pixelstream.pixelstream1.workers.dev";
    
    const path = type === "movie" ? `/embed/${type}/${id}` : `/embed/${type}/${id}/${season}/${episode}`;
    const serverParam = targetServer === "quantum" ? "alpha" : (targetServer === "nebula" ? "nebula" : "classic");
    
    finalUrl = `${worker}${path}?server=${serverParam}&token=${STREAM_TOKEN}&lang=${lang}${adParam}`;
  }

  else if (targetServer === "multi" || targetServer === "super") {
    finalUrl = type === "movie" ? `https://embed.su/embed/movie/${id}` : `https://embed.su/embed/tv/${id}/${season}/${episode}`;
    if (!finalUrl.includes('?')) finalUrl += `?${adParam.slice(1)}`;
  }

  else if (targetServer === "autoembed") {
    finalUrl = type === "movie" ? `https://autoembed.co/movie/tmdb/${id}?${adParam.slice(1)}` : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}?${adParam.slice(1)}`;
  }

  else if (targetServer === "auto" || targetServer === "vidlink") {
      finalUrl = `https://vidlink.pro/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?lang=${lang}${adParam}`;
  }
  else if (targetServer === "vidsrc") finalUrl = `https://vidsrc.net/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?lang=${lang}${adParam}`;
  else if (targetServer === "vidsrcme") finalUrl = type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}&lang=${lang}${adParam}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}&lang=${lang}${adParam}`;
  
  else if (targetServer === "akwam") finalUrl = `https://vidsrc.rip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?lang=${lang}${adParam}`;
  else if (targetServer === "fasel") finalUrl = `https://vidlink.pro/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?lang=${lang}${adParam}`;
  else if (targetServer === "alooy") finalUrl = `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?lang=${lang}${adParam}`;

  else {
    finalUrl = type === "movie" ? `https://embed.su/embed/movie/${id}` : `https://embed.su/embed/tv/${id}/${season}/${episode}`;
    if (!finalUrl.includes('?')) finalUrl += `?${adParam.slice(1)}`;
  }

  return finalUrl;
};

export const decodeObs = (str: string) => str;
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
  auto: "auto"
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false) => {
  // If it's a room, we force a cleaner server (vidlink or primary) to avoid popups
  const targetServer = isRoom ? "auto" : server;
  
  // Direct vidsrc implementation if selected
  if (targetServer === "vidsrc") {
      const baseUrl = "https://vidsrc.to/embed";
      return type === "movie" 
        ? `${baseUrl}/movie/${id}` 
        : `${baseUrl}/tv/${id}/${season}/${episode}`;
  }

  if (server === "vpro") {
    const baseUrl = "https://vidsrc.pro/embed";
    return type === "movie" 
      ? `${baseUrl}/movie/${id}` 
      : `${baseUrl}/tv/${id}/${season}/${episode}`;
  }

  if (server === "super") {
    const baseUrl = "https://multiembed.mov/directstream.php";
    return type === "movie" 
      ? `${baseUrl}/?video_id=${id}&tmdb=1` 
      : `${baseUrl}/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
  }

  if (server === "embedsu") {
    const baseUrl = "https://embed.su/embed";
    return type === "movie"
      ? `${baseUrl}/movie/${id}`
      : `${baseUrl}/tv/${id}/${season}/${episode}`;
  }

  if (server === "vidsrcme") {
    const baseUrl = "https://vidsrc.me/embed";
    return type === "movie"
      ? `${baseUrl}/movie?tmdb=${id}`
      : `${baseUrl}/tv?tmdb=${id}&s=${season}&e=${episode}`;
  }

  if (server === "auto") {
    return `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=e50914`;
  }

  const worker = WORKERS[0];
  const serverParam = SERVER_MAP[server as keyof typeof SERVER_MAP] || "nebula";
  
  let path = "";
  if (type === "movie") {
    path = `/embed/movie/${id}`;
  } else if (type === "anime") {
    path = `/embed/anime/${id}/${season}/${episode}/sub`;
  } else {
    path = `/embed/tv/${id}/${season}/${episode}`;
  }

  // Add adblock/clean params if it's a room
  const extraParams = isRoom ? "&adblock=1&autoplay=1" : "";
  return `${worker}${path}?server=${serverParam}&token=${STREAM_TOKEN}${extraParams}`;
};

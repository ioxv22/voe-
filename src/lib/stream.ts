const WORKERS = [
  "https://green-wave-aa88.hamadalabdolly777.workers.dev",
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
  vidsrc: "vidsrc",
  vidsrcme: "vidsrcme",
  auto: "auto",
  akwam: "akwam",
  fasel: "faselhd",
  alooy: "alooy"
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula", isRoom: boolean = false, lang: string = "en", isVIP: boolean = false) => {
  const targetServer = isRoom ? "auto" : server;
  const adParam = "&ads=0&adblock=1";

  let finalUrl = "";

  if (targetServer === "nebula" || targetServer === "multi") {
    // FORCED: Using your custom worker exclusively to verify it's working
    const worker = "https://green-wave-aa88.hamadalabdolly777.workers.dev";
    
    // CLASSIC STABLE PATH: /embed/type/id
    const path = type === "movie" ? `/embed/${type}/${id}` : `/embed/${type}/${id}/${season}/${episode}`;
    
    if (worker.includes("workers.dev")) {
      finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}&lang=ar${adParam}`;
    } else {
      finalUrl = `${worker}/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6&lang=ar${adParam}`;
    }
  }

  else if (targetServer === "auto" || targetServer === "vidlink") {
      finalUrl = `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6${adParam}`;
  }
  else if (targetServer === "vidsrc") finalUrl = `https://vidsrc.pm/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  else if (targetServer === "vidsrcme") finalUrl = type === "movie" ? `https://vidsrc.me/embed/movie?tmdb=${id}${adParam}` : `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}${adParam}`;
  
  else if (targetServer === "akwam") finalUrl = `https://vidsrc.rip/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;
  else if (targetServer === "fasel") finalUrl = `https://vidlink.pro/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?primaryColor=14b8a6`;
  else if (targetServer === "alooy") finalUrl = `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}?ads=0`;

  else {
    const nebulaWorkers = WORKERS.filter(w => w.includes("workers.dev"));
    const workerIndex = (parseInt(id) || 0) % nebulaWorkers.length;
    const worker = nebulaWorkers[workerIndex];
    const path = type === "movie" ? `/embed/${type}/${id}` : `/embed/${type}/${id}/${season}/${episode}`;
    finalUrl = `${worker}${path}?server=nebula&token=${STREAM_TOKEN}&lang=ar${adParam}`;
  }

  return finalUrl;
};

export const decodeObs = (str: string) => str;


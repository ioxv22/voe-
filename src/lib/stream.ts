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
  zero: "zero",
  lucid: "lucid",
};

export const getStreamUrl = (type: string, id: string, season: number = 1, episode: number = 1, server: string = "nebula") => {
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

  return `${worker}${path}?server=${serverParam}&token=${STREAM_TOKEN}`;
};

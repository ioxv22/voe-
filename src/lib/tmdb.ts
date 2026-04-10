const TMDB_KEYS = [
  "4d8a341b16e8d0427445100613dd7ba2",
  "8a230ab00d92ac9e679ed9982a9243a1",
  "926c7874b762b0bd548a96e5e5a7531e",
  "e681546f5f913f165f58928d6b50d308",
];

const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const fetchTMDB = async (endpoint: string, params: string = "") => {
  const isServer = typeof window === "undefined";
  
  if (isServer) {
    const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_KEY}&${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch TMDB data");
    return res.json();
  } 
  
  try {
    const res = await fetch(`/api/tmdb${endpoint}?${params}`);
    if (!res.ok) throw new Error("Proxy error");
    return await res.json();
  } catch (error) {
    console.warn("Proxy Failed - Falling back to direct secure fetch", error);
    const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
    const fallbackRes = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_KEY}&${params}`);
    if (!fallbackRes.ok) throw new Error("Complete TMDB Failure");
    return fallbackRes.json();
  }
};

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const endpoints = {
  trending: "/trending/all/day",
  movies: "/trending/movie/week",
  series: "/trending/tv/week",
  anime: "/discover/tv", // will add genre 16
  search: "/search/multi",
  topRated: "/movie/top_rated",
  details: (type: string, id: string) => `/${type}/${id}`,
  similar: (type: string, id: string) => `/${type}/${id}/similar`,
};

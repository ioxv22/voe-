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
  const safetyParams = `include_adult=false&${params}`;
  
  if (isServer) {
    const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_KEY}&${safetyParams}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch TMDB data");
    return res.json();
  } 
  
  try {
    const res = await fetch(`/api/tmdb${endpoint}?${safetyParams}`);
    if (!res.ok) throw new Error("Proxy error");
    return await res.json();
  } catch (error) {
    console.warn("Proxy Failed - Falling back to direct secure fetch", error);
    const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
    const fallbackRes = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_KEY}&${safetyParams}`);
    if (!fallbackRes.ok) throw new Error("Complete TMDB Failure");
    return fallbackRes.json();
  }
};

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const BLACKLIST_KEYWORDS = [
  "sex", "porn", "erotic", "nude", "explicit", "adult content", 
  "xxx", "sexual", "vulgar", "dirty", "وصخ", "جنس", "اباحي", "أفلام للكبار"
];

export const filterSafeContent = (items: any[]) => {
  if (!items) return [];
  return items.filter(item => {
    if (item.adult === true) return false;
    
    const text = `${item.title || item.name || ''} ${item.overview || ''}`.toLowerCase();
    const isDirty = BLACKLIST_KEYWORDS.some(word => text.includes(word));
    
    // Also block based on genre IDs if known (e.g. 10749 is Romance, but usually safe unless combined)
    // For now keyword and adult flag are most effective
    return !isDirty;
  });
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

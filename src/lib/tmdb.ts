const TMDB_KEYS = [
  "4d8a341b16e8d0427445100613dd7ba2",
  "8a230ab00d92ac9e679ed9982a9243a1",
  "926c7874b762b0bd548a96e5e5a7531e",
  "e681546f5f913f165f58928d6b50d308",
];

const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
const BASE_URL = "https://api.tmdb.org/3";
const IMAGE_BASE_URL = "https://images.tmdb.org/t/p";

const fallbackMovies = [
  { id: 550, title: "Fight Club", backdrop_path: "/hZk9YgbiEJKvYp2vubvI5GIXsSC.jpg", poster_path: "/pB8BM7pdv9ovvyySMR7S37vS8S6.jpg", overview: "A ticking-time bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.", vote_average: 8.4, media_type: "movie" },
  { id: 1396, name: "Breaking Bad", backdrop_path: "/9fa9LpL7nAFh8vUv9pU8vD0YGoB.jpg", poster_path: "/zt896kwp7UM7p99K9pSy90U6YpU.jpg", overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.", vote_average: 8.9, media_type: "tv" },
  { id: 82856, name: "The Mandalorian", backdrop_path: "/9ijMGlSoczv3qyW9crYp79pvcno.jpg", poster_path: "/eU1i6eHXlzhHH7qmPVMfsSE7OTp.jpg", overview: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.", vote_average: 8.5, media_type: "tv" }
];

export const fetchTMDB = async (endpoint: string, params: string = "") => {
  const isServer = typeof window === "undefined";
  const safetyParams = `include_adult=false&${params}`;
  
  if (isServer) {
    for (const baseUrl of [ "https://api-themoviedb-org.translate.goog/3", "https://api.tmdb.org/3" ]) {
      try {
        const TMDB_KEY = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
        const res = await fetch(`${baseUrl}${endpoint}?api_key=${TMDB_KEY}&${safetyParams}`, { next: { revalidate: 3600 } });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
  } 
  
  try {
    const isTurbo = typeof window !== "undefined" && localStorage.getItem("voz_turbo_mode") === "true";
    
    try {
      // If Turbo is ON, prioritize the Google Stealth Tunnel
      const primaryPath = isTurbo ? "https://api-tmdb-org.translate.goog/3" : `/api/metadata`;
      const res = await fetch(isTurbo ? `${primaryPath}${endpoint}?api_key=${TMDB_KEY}&${safetyParams}` : `${primaryPath}${endpoint}?${safetyParams}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    console.warn("Proxy Failed - Falling back to local discovery mode");
    return { results: fallbackMovies, total_pages: 1, total_results: fallbackMovies.length };
  } catch (error) {
    return { results: fallbackMovies, total_pages: 1, total_results: fallbackMovies.length };
  }
};

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  if (!path) return "";
  const originalUrl = `image.tmdb.org/t/p/${size}${path}`;
  return `https://images.weserv.nl/?url=${originalUrl}&default=https://i.ibb.co/wrCgwgzt/Chat-GPT-Image-Apr-22-2026-09-29-48-PM.png`;
};

const BLACKLIST_KEYWORDS = [
  "porn", "xxx", "pornographic", "full nude", "hardcore porn", "وصخ", "اباحي", "أفلام للكبار فقط",
  "hentai", "ecchi", "softcore porn", "بورن", "فلم وصخ", "انمي وصخ", "انمي للكبار", "افلام للكبار فقط 18+"
];

const WHITELIST_IDS = [76479, 360431, 114472, 130392, 157336, 671, 1399, 1431]; 
const WHITELIST_NAMES = ["The Boys", "Gen V", "Diabolical", "Game of Thrones", "Suicide Squad"];

export const filterSafeContent = (items: any[]) => {
  if (!items) return [];
  return items.filter(item => {
    const itemName = (item.title || item.name || '').toLowerCase();
    
    // Always allow whitelisted content by ID or Name
    if (WHITELIST_IDS.includes(item.id)) return true;
    if (WHITELIST_NAMES.some(name => itemName.includes(name.toLowerCase()))) return true;
    
    // Check if TMDB explicitly flags it as adult
    if (item.adult === true) return false;

    // Check genres (some adult genres exist but might not be flagged 'adult')
    // We already use include_adult=false in API calls, but this is an extra layer.
    
    const text = `${itemName} ${item.overview || ''}`.toLowerCase();
    const isDirty = BLACKLIST_KEYWORDS.some(word => text.includes(word));
    
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

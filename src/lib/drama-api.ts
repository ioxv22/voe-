
const BASE_URL = "https://admin.dramaramadan.net/api";
const DEFAULT_HEADERS = {
    'User-Agent': 'okhttp/4.12.0',
    'Accept-Encoding': 'gzip',
};

export async function fetchDrama(endpoint: string, params: Record<string, string | number> = {}) {
    const isServer = typeof window === "undefined";
    
    let url: string;
    let headers: HeadersInit = {};
    
    if (isServer) {
        const targetUrl = new URL(`${BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => targetUrl.searchParams.append(key, params[key].toString()));
        url = targetUrl.toString();
        headers = DEFAULT_HEADERS;
    } else {
        const proxyUrl = new URL(`/api/drama`, window.location.origin);
        proxyUrl.searchParams.append("endpoint", endpoint);
        Object.keys(params).forEach(key => proxyUrl.searchParams.append(key, params[key].toString()));
        url = proxyUrl.toString();
    }
    
    try {
        const response = await fetch(url, {
            headers,
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!response.ok) return null;
        const data = await response.json();
        return data.status === "success" ? data.data : null;
    } catch (error) {
        console.error(`Drama API Error (${endpoint}):`, error);
        return null;
    }
}

export const dramaEndpoints = {
    series: "/series/",
    seasons: "/seasons/",
    episodes: "/episodes/",
    show: "/episodes/show.php",
};

export async function searchSeries(query: string) {
    return fetchDrama(dramaEndpoints.series, {
        page: 1,
        limit: 20,
        search: query,
        app_version: 9
    });
}

export async function getSeriesSeasons(seriesId: string | number) {
    return fetchDrama(dramaEndpoints.seasons, {
        series_id: seriesId,
        app_version: 9
    });
}

export async function getSeasonEpisodes(seasonId: string | number) {
    return fetchDrama(dramaEndpoints.episodes, {
        season_id: seasonId,
        app_version: 9
    });
}

export async function getEpisodeDetails(episodeId: string | number) {
    return fetchDrama(dramaEndpoints.show, {
        id: episodeId
    });
}

export async function getFilteredSeries(filter: string, limit: number = 20, country?: string) {
    const params: any = {
        page: 1,
        limit,
        app_version: 9,
        sort_by: filter
    };
    if (country) params.country = country;
    
    return fetchDrama(dramaEndpoints.series, params);
}

export function getFullImageUrl(path: string) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://admin.dramaramadan.net${path}`;
}

/**
 * VOZ Stream Offline Storage Utility
 * Manages caching of video metadata and blobs for offline viewing.
 */

const VIDEO_CACHE_NAME = "voz-video-cache-v1";
const METADATA_CACHE_NAME = "voz-metadata-cache-v1";

export async function saveMovieForOffline(id: string, type: string, title: string, videoUrl: string, posterUrl: string) {
  try {
    const cache = await caches.open(VIDEO_CACHE_NAME);
    const metaCache = await caches.open(METADATA_CACHE_NAME);

    // Save metadata
    const metadata = { id, type, title, posterUrl, videoUrl, timestamp: Date.now() };
    await metaCache.put(
      new Request(`/api/offline-meta/${type}/${id}`),
      new Response(JSON.stringify(metadata), {
        headers: { "Content-Type": "application/json" }
      })
    );

    // Fetch and cache poster
    await cache.add(posterUrl);

    // Note: Caching the actual video file can be very large.
    // We try to fetch the video as a blob if CORS allows.
    console.log(`Starting download for: ${title}`);
    
    // In a real scenario, we might use background fetch here.
    // For now, we'll try a direct fetch to the cache.
    // WARNING: This will fail if the videoUrl doesn't support CORS.
    await cache.add(videoUrl);

    return true;
  } catch (error) {
    console.error("Failed to save movie for offline:", error);
    return false;
  }
}

export async function getOfflineMovies() {
  try {
    const metaCache = await caches.open(METADATA_CACHE_NAME);
    const keys = await metaCache.keys();
    const movies = [];

    for (const key of keys) {
      const response = await metaCache.match(key);
      if (response) {
        movies.push(await response.json());
      }
    }
    return movies;
  } catch (error) {
    console.error("Failed to get offline movies:", error);
    return [];
  }
}

export async function isMovieOffline(id: string, type: string) {
    const cache = await caches.open(METADATA_CACHE_NAME);
    const match = await cache.match(new Request(`/api/offline-meta/${type}/${id}`));
    return !!match;
}

export async function removeOfflineMovie(id: string, type: string) {
    const metaCache = await caches.open(METADATA_CACHE_NAME);
    await metaCache.delete(new Request(`/api/offline-meta/${type}/${id}`));
    // Ideally we also remove the video from VIDEO_CACHE_NAME, 
    // but we need the exact URL used.
}

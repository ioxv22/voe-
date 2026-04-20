import { NextRequest, NextResponse } from "next/server";

const TMDB_KEYS = [
  "4d8a341b16e8d0427445100613dd7ba2",
  "8a230ab00d92ac9e679ed9982a9243a1",
  "926c7874b762b0bd548a96e5e5a7531e",
  "e681546f5f913f165f58928d6b50d308",
];

const BASE_URLS = [
  "https://api-themoviedb-org.translate.goog/3",
  "https://api-tmdb-org.translate.goog/3",
  "https://api.tmdb.org/3",
  "https://api.themoviedb.org/3"
];

// In a real scenario, we'd pick the best one, but let's try a better primary for schools
const BASE_URL = "https://api.tmdb.org/3"; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  // Select a random key on the server (Hidden from Client)
  const apiKey = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
  
  const endpoint = `/${path.join("/")}`;
  
  let lastError = null;
  for (const baseUrl of BASE_URLS) {
    try {
      const targetUrl = new URL(`${baseUrl}${endpoint}`);
      targetUrl.searchParams.set("api_key", apiKey);
      searchParams.forEach((value, key) => {
        if (key !== "api_key") targetUrl.searchParams.set(key, value);
      });

      const res = await fetch(targetUrl.toString(), { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error) {
      lastError = error;
      console.warn(`Fetch failed for ${baseUrl}, trying next...`);
    }
  }

  return NextResponse.json({ error: "Failed to fetch from all TMDB Proxies", details: String(lastError) }, { status: 500 });
}

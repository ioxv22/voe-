import { NextRequest, NextResponse } from "next/server";

const TMDB_KEYS = [
  "4d8a341b16e8d0427445100613dd7ba2",
  "8a230ab00d92ac9e679ed9982a9243a1",
  "926c7874b762b0bd548a96e5e5a7531e",
  "e681546f5f913f165f58928d6b50d308",
];

const BASE_URLS = [
  "https://api.tmdb.org/3",
  "https://api.themoviedb.org/3",
  "https://api-tmdb-org.translate.goog/3",
  "https://api-themoviedb-org.translate.goog/3",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const searchParams = request.nextUrl.searchParams;
  
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

      const res = await fetch(targetUrl.toString(), { 
        // Increase timeout to 10s for slower proxies
        signal: AbortSignal.timeout(10000),
        next: { revalidate: 3600 } 
      });
      
      if (!res.ok) continue;
      
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    { error: "UPSTREAM_TIMEOUT", details: String(lastError) }, 
    { status: 503, headers: { 'Retry-After': '30' } }
  );
}

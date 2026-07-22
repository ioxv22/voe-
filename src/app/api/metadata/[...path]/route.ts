import { NextRequest, NextResponse } from "next/server";

const TMDB_KEYS = [
  "4d8a341b16e8d0427445100613dd7ba2",
  "8a230ab00d92ac9e679ed9982a9243a1",
  "926c7874b762b0bd548a96e5e5a7531e",
  "e681546f5f913f165f58928d6b50d308",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const searchParams = request.nextUrl.searchParams;
    const apiKey = TMDB_KEYS[Math.floor(Math.random() * TMDB_KEYS.length)];
    const endpoint = `/${path.join("/")}`;
    
    const targetUrl = new URL(`https://api.tmdb.org/3${endpoint}`);
    targetUrl.searchParams.set("api_key", apiKey);
    searchParams.forEach((value, key) => {
        if (key !== "api_key") targetUrl.searchParams.set(key, value);
    });

    const res = await fetch(targetUrl.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({ error: "UPSTREAM_ERROR" }, { status: res.status });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

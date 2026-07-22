import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://admin.dramaramadan.net/api";
const DEFAULT_HEADERS = {
    'User-Agent': 'okhttp/4.12.0',
    'Accept-Encoding': 'gzip',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const targetUrl = new URL(`${BASE_URL}${endpoint}`);
    searchParams.forEach((value, key) => {
        if (key !== "endpoint") {
            targetUrl.searchParams.set(key, value);
        }
    });

    const res = await fetch(targetUrl.toString(), {
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
        return NextResponse.json({ error: "UPSTREAM_ERROR" }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Drama Proxy Error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

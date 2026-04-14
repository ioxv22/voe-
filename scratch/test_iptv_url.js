const url = "http://hlaamart.site:80/playlist/hamad201011@2727/hamad201011@2727/m3u?output=hls&key=live";

async function test() {
    try {
        console.log("Fetching playlist...");
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Length:", text.length);
        console.log("Snippet:", text.substring(0, 200));
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

test();

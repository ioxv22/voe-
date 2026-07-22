
const BASE_URL = "https://helm-api.vercel.app/api/move/api/movie";

export async function fetchMovieDownload(name: string, quality?: string | number) {
    const url = new URL(BASE_URL);
    url.searchParams.append("name", name);
    if (quality) {
        url.searchParams.append("quality", quality.toString());
    }

    try {
        const response = await fetch(url.toString(), {
            headers: {
                'accept': 'application/json'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.status === "success" ? data : null;
    } catch (error) {
        console.error("Helm API Error:", error);
        return null;
    }
}

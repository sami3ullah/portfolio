export interface SanityProject {
  _id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  posterImage: string;
  videoUrl: string;
}

// Fetch published content at build time. Sanity remains the source of truth;
// a failed request must fail the build instead of silently dropping the gallery.
export async function getSanityProjects(): Promise<SanityProject[]> {
  const endpoint = new URL(
    'https://vssn751z.api.sanity.io/v2023-08-01/data/query/production'
  );
  endpoint.searchParams.set(
    'query',
    `*[_type == "projects"] | order(sortOrder asc) {
      _id, name, category, description, url,
      "posterImage": posterImage.asset->url,
      "videoUrl": video.asset->url
    }`
  );
  const response = await fetch(endpoint, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`Sanity project request failed: ${response.status}`);
  }
  const { result } = await response.json();
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('Sanity returned no published projects');
  }
  return result;
}

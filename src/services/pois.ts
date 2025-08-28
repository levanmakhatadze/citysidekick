import type { FeatureCollection, Feature, Point } from 'geojson';

export type POI = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
};

export async function fetchOverpassPOIs(lat: number, lon: number, radiusMeters = 1500): Promise<FeatureCollection<Point>> {
  const around = `${radiusMeters},${lat.toFixed(4)},${lon.toFixed(4)}`;
  const query = `
    [out:json][timeout:15];
    (
      node(around:${around})["amenity"~"cafe|restaurant|bar|fast_food"];
      node(around:${around})["leisure"~"park|garden"];
      node(around:${around})["tourism"~"attraction|museum|gallery|zoo|viewpoint"];
    );
    out center 100;
  `.trim();

  const { cacheKey, getCached, setCached } = await import('./cache');
  const key = cacheKey(['pois', lat.toFixed(3), lon.toFixed(3), radiusMeters]);
  const cached = await getCached<FeatureCollection<Point>>(key);
  if (cached) return cached;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ data: query }).toString(),
  });
  const data = await res.json();

  const features: Feature<Point>[] = (data.elements || [])
    .filter((e: any) => e.type === 'node' && typeof e.lat === 'number' && typeof e.lon === 'number')
    .map((e: any) => ({
      type: 'Feature',
      id: String(e.id),
      properties: {
        name: e.tags?.name || 'Unknown',
        category: e.tags?.amenity || e.tags?.leisure || e.tags?.tourism || 'poi',
      },
      geometry: {
        type: 'Point',
        coordinates: [e.lon, e.lat],
      },
    }));

  const fc: FeatureCollection<Point> = { type: 'FeatureCollection', features };
  try {
    await setCached(key, fc, 30 * 60 * 1000);
  } catch {}
  return fc;
}

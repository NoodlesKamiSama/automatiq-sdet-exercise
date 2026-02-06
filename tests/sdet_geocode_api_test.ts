import http from 'k6/http';
import { check, fail } from 'k6';
import type { Options } from 'k6/options';

type GeocodeResponse = {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  error_message?: string;
};

export const options: Options = {
  scenarios: {
    geocode_once: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '30s',
    },
  },
};

function requiredEnv(name: string): string {
  const value = __ENV[name];
  if (value && value.trim()) return value.trim();
  fail(`Required env var ${name} is missing`);
}

export default function () {
  const apiKey = requiredEnv('GOOGLE_GEOCODE_API_KEY');

  const rawCity = (__ENV.CITY ?? '').trim();
  const city = rawCity || 'Los Angeles';

  const url =
    'https://maps.googleapis.com/maps/api/geocode/json' +
    `?address=${encodeURIComponent(city)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  const res = http.get(url, { tags: { name: 'geocode' } });

  const okHttp = check(res, {
    'status is 200': (r) => r.status === 200,
  });

  if (!okHttp) {
    fail(`Unexpected HTTP status: ${res.status}`);
  }

  const data = res.json() as GeocodeResponse;

  const okGeocode = check(data, {
    'Geocode status is OK': (d) => d.status === 'OK',
  });

  if (data.status !== 'OK' || !data.results?.length) {
    const details = data.error_message ? ` (${data.error_message})` : '';
    if (!okGeocode) {
      fail(`Geocode API response status: ${data.status}${details}`);
    }
    fail(`No geocode results returned for city: "${city}"`);
  }

  const { lng, lat } = data.results[0].geometry.location;
  console.log(`City: ${city} Longitude: ${lng} Latitude: ${lat}`);
}


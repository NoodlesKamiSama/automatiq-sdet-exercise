# automatiq-sdet-exercise

Small k6 API test, written in TypeScript, that calls the Google geocoding API and prints the long/lat for a given city.

## Prereqs

- Node.js (18+ recommended)
- k6 installed locally
- A Google geocoding API key enabled

## Install

```bash
npm ci
```

## Run locally

Set the required API key env var and optionally the city:

```bash
export GOOGLE_GEOCODE_API_KEY="your_api_key"
export CITY="Los Angeles"

npm run k6
```

Expected output example:

```text
City: Los Angeles Longitude: -118.2436849 Latitude: 34.0522342
```

## Running via GH Actions

In GitHub: **Actions** → **Run k6 geocode test** → **Run workflow**

- Provide:
  - `city` (example: `Los Angeles`)
  - `google_api_key`
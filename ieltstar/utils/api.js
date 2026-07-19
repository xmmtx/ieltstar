let _apiUrl = null;

export function getApiUrl() {
  if (_apiUrl) return _apiUrl;

  // 1. Runtime: injected by docker-entrypoint.sh via __env.js (separate-container mode)
  if (typeof window !== "undefined" && window.__API_URL) {
    _apiUrl = window.__API_URL;
    return _apiUrl;
  }

  // 2. Server-side: explicitly set via compose env API_URL (separate-container mode)
  if (typeof window === "undefined" && typeof process !== "undefined" && process.env["API_URL"]) {
    _apiUrl = process.env["API_URL"];
    return _apiUrl;
  }

  // 3. Single-container mode (no API_URL set):
  //    Client → relative /api/* path → Next.js rewrites → internal Express
  //    Server → direct internal Express URL for SSR fetch
  _apiUrl = typeof window !== "undefined" ? "/api" : "http://localhost:8080";
  return _apiUrl;
}

export default getApiUrl;

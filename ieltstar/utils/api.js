let _apiUrl = null;

export function getApiUrl() {
  if (_apiUrl) return _apiUrl;

  // 1. Runtime: injected by _document.tsx via Docker compose env var
  if (typeof window !== "undefined" && window.__API_URL) {
    _apiUrl = window.__API_URL;
    return _apiUrl;
  }

  // 2. Server-side: read directly from process.env
  if (typeof window === "undefined" && process.env.API_URL) {
    _apiUrl = process.env.API_URL;
    return _apiUrl;
  }

  // 3. Fallback
  _apiUrl = "http://localhost:8080";
  return _apiUrl;
}

export default getApiUrl;

import getConfig from "next/config";

let _apiUrl = null;

export function getApiUrl() {
  if (_apiUrl) return _apiUrl;
  try {
    const { publicRuntimeConfig } = getConfig();
    _apiUrl = publicRuntimeConfig.API_URL || "http://localhost:8080";
  } catch {
    _apiUrl = process.env.API_URL || "http://localhost:8080";
  }
  return _apiUrl;
}

export default getApiUrl;

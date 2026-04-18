const API_BASE_URL =
  typeof __API_URL__ !== "undefined" && __API_URL__
    ? __API_URL__
    : `${window.location.protocol}//${window.location.hostname}:3000/api`;

export default API_BASE_URL;

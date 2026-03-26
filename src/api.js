// ============================================================
// CAPA API – CineScope conectada a TMDB
// ============================================================
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_LANG } from "./config";

// Helper interno para construir URLs de TMDB
const buildUrl = (path, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", TMDB_LANG);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
};

// GET: Películas populares (página principal)
export async function getPopularMovies(page = 1) {
  const res = await fetch(buildUrl("/movie/popular", { page }));
  if (!res.ok) throw new Error("Error al obtener películas populares");
  const data = await res.json();
  return data.results;
}

// GET: Buscar películas por título
export async function searchMovies(query, page = 1) {
  // Si la búsqueda está vacía, devolvemos populares
  if (!query.trim()) return getPopularMovies(page);
  const res = await fetch(
    buildUrl("/search/movie", { query: encodeURIComponent(query), page })
  );
  if (!res.ok) throw new Error("Error al buscar películas");
  const data = await res.json();
  return data.results;
}

// GET: Detalle completo de una película por ID
export async function getMovieDetail(id) {
  const res = await fetch(buildUrl(`/movie/${id}`));
  if (!res.ok) throw new Error("Error al obtener el detalle de la película");
  return res.json();
}

// GET: Elenco y equipo técnico de una película
export async function getMovieCredits(id) {
  const res = await fetch(buildUrl(`/movie/${id}/credits`));
  if (!res.ok) throw new Error("Error al obtener los créditos");
  return res.json();
}

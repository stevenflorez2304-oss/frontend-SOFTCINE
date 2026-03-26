import { useState, useCallback } from "react";
import { getPopularMovies, searchMovies } from "../api";
import { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // Carga películas según la búsqueda actual
  const loadMovies = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      setError("");
      const results = searchQuery.trim()
        ? await searchMovies(searchQuery)
        : await getPopularMovies();
      setMovies(results);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con la API. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial con películas populares
  useEffect(() => {
    loadMovies("");
  }, [loadMovies]);

  // Se ejecuta cada vez que cambia la búsqueda (viene del SearchBar con debounce)
  const handleSearch = useCallback(
    (newQuery) => {
      setQuery(newQuery);
      loadMovies(newQuery);
    },
    [loadMovies]
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero / Encabezado */}
        <section className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Descubre tu próxima{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              película favorita
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Catálogo en tiempo real con datos de TMDB. Guarda tus favoritas y descúbrelas cuándo quieras.
          </p>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por título (ej: Avengers, Batman...)"
          />
        </section>

        {/* Indicador de sección */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            {query ? `Resultados para "${query}"` : "🔥 Películas Populares"}
          </h3>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-2xl aspect-[2/3] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">😕</p>
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => loadMovies(query)}
              className="mt-4 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg">
              No encontramos resultados para{" "}
              <span className="text-white font-semibold">"{query}"</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Intenta con otro título o revisa la ortografía
            </p>
          </div>
        )}

        {/* Grid de películas */}
        {!loading && !error && movies.length > 0 && (
          <>
            <p className="text-xs text-gray-600 mb-4">{movies.length} película{movies.length !== 1 && "s"} encontrada{movies.length !== 1 && "s"}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

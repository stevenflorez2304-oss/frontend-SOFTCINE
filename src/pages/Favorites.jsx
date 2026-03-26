import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Encabezado */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">❤️</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Mis Favoritas
            </h2>
          </div>
          <p className="text-gray-400 text-sm ml-12">
            {favorites.length > 0
              ? `Tienes ${favorites.length} película${favorites.length > 1 ? "s" : ""} guardada${favorites.length > 1 ? "s" : ""}`
              : "Aún no tienes películas guardadas"}
          </p>
        </section>

        {/* Estado vacío */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="text-8xl mb-6 opacity-20">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Tu lista está vacía
            </h3>
            <p className="text-gray-500 max-w-xs mb-8">
              Explora el catálogo y presiona el corazón ❤️ en las películas que
              más te gusten para guardarlas aquí.
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30"
            >
              Explorar catálogo →
            </Link>
          </div>
        ) : (
          <>
            <div className="h-px bg-white/5 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Enlace para seguir explorando */}
            <div className="mt-12 text-center">
              <Link
                to="/"
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4"
              >
                ← Seguir explorando el catálogo
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

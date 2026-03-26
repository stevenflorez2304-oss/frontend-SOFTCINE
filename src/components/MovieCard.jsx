import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { TMDB_IMAGE_BASE } from "../config";

// Componente reutilizable que representa una tarjeta de película
export default function MovieCard({ movie }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  // Construir URL del póster o mostrar placeholder
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  // Obtener año de estreno
  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  // Puntuación de 0-10 a color semafórico
  const scoreColor =
    movie.vote_average >= 7
      ? "text-green-400"
      : movie.vote_average >= 5
      ? "text-amber-400"
      : "text-red-400";

  return (
    <article className="group relative flex flex-col bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Póster */}
      <Link to={`/movie/${movie.id}`} className="block overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`Póster de ${movie.title}`}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-800 flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">🎬</span>
            <span className="text-xs text-gray-500 text-center px-2">Sin imagen disponible</span>
          </div>
        )}
      </Link>

      {/* Botón de favorito (flotante) */}
      <button
        onClick={() => toggleFavorite(movie)}
        aria-label={favorite ? "Quitar de favoritas" : "Agregar a favoritas"}
        className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center text-base backdrop-blur-sm border transition-all duration-200 ${
          favorite
            ? "bg-rose-500/90 border-rose-400 text-white scale-110"
            : "bg-gray-900/70 border-white/10 text-gray-300 hover:bg-rose-500/80 hover:text-white hover:border-rose-400"
        }`}
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      {/* Info inferior */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <Link
          to={`/movie/${movie.id}`}
          className="text-sm font-semibold text-white hover:text-amber-400 transition-colors line-clamp-2 leading-snug"
        >
          {movie.title}
        </Link>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xs text-gray-500">{year}</span>
          <span className={`text-xs font-bold ${scoreColor}`}>
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </article>
  );
}

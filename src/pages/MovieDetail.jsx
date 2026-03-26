import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMovieDetail, getMovieCredits } from "../api";
import { useFavorites } from "../context/FavoritesContext";
import { TMDB_IMAGE_BASE, TMDB_BACKDROP_BASE, BACKEND_URL } from "../config";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";

// ─── Helpers de API para comentarios ────────────────────────────────────────
const COMENTARIOS_URL = `${BACKEND_URL}/api/comentarios`;

async function fetchComentarios(movieId) {
  const res = await fetch(`${COMENTARIOS_URL}?movieId=${movieId}`);
  if (!res.ok) throw new Error("Error al cargar comentarios");
  return res.json();
}

async function postComentario(data) {
  const res = await fetch(COMENTARIOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al publicar comentario");
  return res.json();
}

async function deleteComentario(id) {
  const res = await fetch(`${COMENTARIOS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar comentario");
}

// ─── Formulario de Reseña con Validación ───────────────────────────────────
function ReviewForm({ movieId }) {
  const { user } = useAuth();

  // Estado del formulario (controlado)
  const [form, setForm] = useState({ nombre: "", calificacion: 0, comentario: "" });
  // Errores de validación por campo
  const [errors, setErrors] = useState({});
  // Reseñas obtenidas del backend
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Cargar comentarios desde el backend al montar ─────────────────────────
  useEffect(() => {
    fetchComentarios(movieId)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoadingReviews(false));
  }, [movieId]);

  // ── Validación de cada campo ──────────────────────────────────────────────
  const validate = (data) => {
    const errs = {};
    if (!data.nombre.trim()) {
      errs.nombre = "El nombre es obligatorio.";
    } else if (data.nombre.trim().length < 2) {
      errs.nombre = "El nombre debe tener al menos 2 caracteres.";
    } else if (data.nombre.trim().length > 50) {
      errs.nombre = "El nombre no puede superar los 50 caracteres.";
    }
    if (!data.calificacion || data.calificacion < 1) {
      errs.calificacion = "Selecciona una calificación del 1 al 5.";
    }
    if (!data.comentario.trim()) {
      errs.comentario = "El comentario es obligatorio.";
    } else if (data.comentario.trim().length < 10) {
      errs.comentario = "El comentario debe tener al menos 10 caracteres.";
    } else if (data.comentario.trim().length > 300) {
      errs.comentario = "El comentario no puede superar los 300 caracteres.";
    }
    return errs;
  };

  // ── Manejadores de cambio (formulario controlado) ─────────────────────────
  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (submitted) setErrors(validate(updated));
  };

  // ── Validación al perder el foco (blur) ───────────────────────────────────
  const handleBlur = (field) => {
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  // ── Envío del formulario → POST al backend ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newReview = {
      movieId: String(movieId),
      nombre: form.nombre.trim(),
      calificacion: form.calificacion,
      comentario: form.comentario.trim(),
      fecha: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const saved = await postComentario(newReview);
      setReviews((prev) => [saved, ...prev]);
      setForm({ nombre: "", calificacion: 0, comentario: "" });
      setErrors({});
      setSubmitted(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar comentario → DELETE al backend ───────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteComentario(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatFecha = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("es-CO", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>📝</span> Deja tu reseña
      </h3>

      {/* Formulario controlado con validación */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-gray-900 rounded-2xl p-6 border border-white/5 space-y-5"
      >
        {/* Campo: Nombre */}
        <div>
          <label
            htmlFor="review-nombre"
            className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
          >
            Tu nombre *
          </label>
          <input
            id="review-nombre"
            type="text"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            onBlur={() => handleBlur("nombre")}
            placeholder="Ej: María García"
            maxLength={50}
            className={`w-full bg-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none border transition-all ${
              errors.nombre
                ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                : "border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            }`}
          />
          {errors.nombre && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.nombre}
            </p>
          )}
          <p className="text-gray-600 text-xs mt-1 text-right">{form.nombre.length}/50</p>
        </div>

        {/* Campo: Calificación */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Calificación *
          </label>
          <StarRating
            value={form.calificacion}
            onChange={(v) => handleChange("calificacion", v)}
          />
          {errors.calificacion && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.calificacion}
            </p>
          )}
        </div>

        {/* Campo: Comentario */}
        <div>
          <label
            htmlFor="review-comentario"
            className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
          >
            Comentario *
          </label>
          <textarea
            id="review-comentario"
            value={form.comentario}
            onChange={(e) => handleChange("comentario", e.target.value)}
            onBlur={() => handleBlur("comentario")}
            placeholder="¿Qué te pareció la película? (mín. 10 caracteres)"
            maxLength={300}
            rows={4}
            className={`w-full bg-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none border resize-none transition-all ${
              errors.comentario
                ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                : "border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            }`}
          />
          {errors.comentario && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.comentario}
            </p>
          )}
          <p className="text-gray-600 text-xs mt-1 text-right">{form.comentario.length}/300</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          {saving ? "Publicando..." : "Publicar reseña ✓"}
        </button>
      </form>

      {/* Lista de reseñas */}
      {loadingReviews ? (
        <p className="text-gray-500 text-sm mt-6">Cargando reseñas...</p>
      ) : reviews.length > 0 ? (
        <div className="mt-8 space-y-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            💬 Reseñas ({reviews.length})
          </h4>
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-gray-900/60 border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold text-white text-sm">{r.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs flex-shrink-0">{formatFecha(r.fecha)}</span>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 text-xs hover:text-red-300 border border-red-500/30 px-2 py-1 rounded bg-red-500/10 transition-colors"
                      title="Eliminar Reseña (Admin)"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
              <StarRating value={r.calificacion} readonly />
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">{r.comentario}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

// ─── Página principal de Detalle ────────────────────────────────────────────
export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const favorite = movie ? isFavorite(movie.id) : false;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [detail, cred] = await Promise.all([
          getMovieDetail(id),
          getMovieCredits(id),
        ]);
        setMovie(detail);
        setCredits(cred);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la película.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const backdrop = movie?.backdrop_path
    ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}`
    : null;
  const poster = movie?.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  const cast = credits?.cast?.slice(0, 8) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-72 bg-gray-900 rounded-3xl mb-6" />
          <div className="flex gap-6">
            <div className="w-40 h-60 bg-gray-900 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-900 rounded-xl w-2/3" />
              <div className="h-4 bg-gray-900 rounded-lg w-full" />
              <div className="h-4 bg-gray-900 rounded-lg w-5/6" />
              <div className="h-4 bg-gray-900 rounded-lg w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-red-400 font-medium mb-4">{error || "Película no encontrada."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden">
        {backdrop ? (
          <img
            src={backdrop}
            alt={`Fondo de ${movie.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 pb-20">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Póster */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            {poster ? (
              <img
                src={poster}
                alt={`Póster de ${movie.title}`}
                className="w-36 sm:w-48 rounded-2xl shadow-2xl border border-white/10"
              />
            ) : (
              <div className="w-36 sm:w-48 aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center text-4xl">
                🎬
              </div>
            )}
          </div>

          {/* Info principal */}
          <div className="flex-1 pt-6 sm:pt-12">
            {/* Volver */}
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-gray-500 hover:text-amber-400 transition-colors mb-3 flex items-center gap-1"
            >
              ← Volver al catálogo
            </button>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-1">
              {movie.title}
            </h2>
            {movie.tagline && (
              <p className="text-amber-400/80 italic text-sm mb-3">"{movie.tagline}"</p>
            )}

            {/* Métricas */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                ⭐ {movie.vote_average?.toFixed(1)} / 10
              </span>
              {movie.release_date && (
                <span className="text-gray-400">
                  📅 {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span className="text-gray-400">⏱ {movie.runtime} min</span>
              )}
            </div>

            {/* Géneros */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs bg-gray-800 text-gray-300 border border-white/10 px-3 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Sinopsis */}
            <p className="text-gray-300 text-sm leading-relaxed mb-5">
              {movie.overview || "Sin sinopsis disponible."}
            </p>

            {/* Botón Favorito */}
            <button
              onClick={() => toggleFavorite(movie)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                favorite
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
                  : "bg-gray-800 text-gray-300 border border-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30"
              }`}
            >
              {favorite ? "❤️ En favoritas" : "🤍 Agregar a favoritas"}
            </button>
          </div>
        </div>

        {/* Elenco */}
        {cast.length > 0 && (
          <section className="mt-10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🎭</span> Elenco principal
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-800 mb-1">
                    {actor.profile_path ? (
                      <img
                        src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🎬
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-tight font-medium line-clamp-2">
                    {actor.name}
                  </p>
                  <p className="text-[10px] text-gray-600 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formulario de Reseña */}
        <ReviewForm movieId={id} />
      </main>
    </div>
  );
}

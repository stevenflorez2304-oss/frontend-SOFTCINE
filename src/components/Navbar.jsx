import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { APP_INFO } from "../config";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            🎬
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
              SENA ADSO · Ficha {APP_INFO.ficha}
            </p>
            <h1 className="text-sm font-bold text-white leading-none">
              {APP_INFO.nombre}
            </h1>
          </div>
        </Link>

        {/* Navegación central */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            🏠 <span className="hidden sm:inline">Inicio</span>
          </Link>
          <Link
            to="/favorites"
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/favorites")
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            ❤️ <span className="hidden sm:inline">Favoritas</span>
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {favorites.length > 9 ? "9+" : favorites.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-3">
          {user && (
            <span className={`hidden sm:inline text-xs font-semibold px-2 py-1 rounded border ${user.role === "admin" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-gray-800 text-gray-400 border-white/10"}`}>
              {user.role === "admin" ? "⭐ Admin" : "👤 Usuario"}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            title="Cerrar sesión"
          >
            <span className="hidden sm:inline">Salir </span>🚪
          </button>
        </div>
      </div>
    </header>
  );
}

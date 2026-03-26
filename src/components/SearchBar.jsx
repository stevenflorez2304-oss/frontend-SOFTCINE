import { useState, useEffect } from "react";

// Componente reutilizable de barra de búsqueda con debounce
// Props:
//   onSearch(query: string) – callback llamado tras el debounce
//   placeholder – texto del placeholder
//   delay – ms de debounce (default: 450)
export default function SearchBar({ onSearch, placeholder = "Buscar película...", delay = 450 }) {
  const [value, setValue] = useState("");

  // Debounce: sólo llama a onSearch después de que el usuario dejó de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);

    // Limpia el timer anterior cada vez que cambia el valor
    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Icono de lupa */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
        🔍
      </span>
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-gray-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm"
      />
      {/* Botón para limpiar */}
      {value && (
        <button
          onClick={() => setValue("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}

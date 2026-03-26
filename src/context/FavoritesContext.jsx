/*eslint-disable react-refresh/only-export-components*/
import { createContext, useContext, useState } from "react";

// Clave usada para persistir los favoritos en localStorage
const STORAGE_KEY = "cinescope_favorites";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Inicializamos el estado desde localStorage (si existe)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Helper para guardar en localStorage y actualizar el estado
  const persist = (updated) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFavorites(updated);
  };

  // Agrega una película a favoritos
  const addFavorite = (movie) => {
    persist([...favorites, movie]);
  };

  // Elimina una película de favoritos por su ID
  const removeFavorite = (id) => {
    persist(favorites.filter((m) => m.id !== id));
  };

  // Alterna el estado de favorito de una película
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  // Verifica si una película ya está en favoritos
  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

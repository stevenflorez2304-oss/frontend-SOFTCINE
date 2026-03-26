// Componente reutilizable de selección de calificación con estrellas
// Props:
//   value (number)    – valor actual (0-5)
//   onChange(n)       – callback cuando cambia la selección
//   readonly (bool)   – sólo lectura (para mostrar puntuación, no editar)
export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Calificación con estrellas">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          disabled={readonly}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          className={`text-2xl transition-transform duration-100 ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-125"
          } ${star <= value ? "opacity-100" : "opacity-30 grayscale"}`}
        >
          ⭐
        </button>
      ))}
      {value > 0 && !readonly && (
        <span className="text-xs text-gray-400 ml-1">({value}/5)</span>
      )}
    </div>
  );
}

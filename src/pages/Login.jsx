import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { APP_INFO } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validación del formulario de login
  const validate = ({ email, password }) => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Ingresa un correo válido.";
    }
    if (!password) {
      errs.password = "La contraseña es obligatoria.";
    } else if (password.length < 4) {
      errs.password = "La contraseña debe tener al menos 4 caracteres.";
    }
    return errs;
  };

  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    else setPassword(value);
    if (submitted) {
      const updated = field === "email" ? { email: value, password } : { email, password: value };
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field) => {
    const errs = validate({ email, password });
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate({ email, password });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const success = await login(email, password);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Acceso concedido a CineScope",
        timer: 1400,
        showConfirmButton: false,
        background: "#111827",
        color: "#fff",
      });
      navigate("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Credenciales incorrectas o error en el servidor. Intenta de nuevo.",
        confirmButtonColor: "#f59e0b",
        background: "#111827",
        color: "#fff",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-950 to-gray-950 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Icono */}
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-2xl shadow-orange-500/30">
            🎬
          </div>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-3xl shadow-2xl p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {APP_INFO.nombre}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Inicia sesión para explorar el catálogo
            </p>
            <p className="text-amber-500/80 text-xs mt-1">
              Admin: admin@sena.com | Usuario: user@sena.com
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="admin@sena.com / user@sena.com"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white text-sm placeholder:text-gray-600 outline-none transition-all ${
                  errors.email
                    ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    : "border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
              >
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white text-sm placeholder:text-gray-600 outline-none transition-all ${
                  errors.password
                    ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    : "border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold rounded-2xl shadow-lg shadow-orange-500/30 hover:opacity-90 active:scale-[0.98] transition-all mt-2"
            >
              Entrar al catálogo →
            </button>
          </form>

          <footer className="mt-6 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest">
              SENA CTMA · Proyecto ADSO · Ficha {APP_INFO.ficha}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
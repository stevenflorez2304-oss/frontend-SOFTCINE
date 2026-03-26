/*eslint-disable react-refresh/only-export-components*/
import { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/me`, { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true)
          return res.json()
        } else {
          setIsAuthenticated(false)
          setUser(null)
          return null
        }
      })
      .then(data => {
        if (data && data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        setIsAuthenticated(false)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        const data = await res.json()
        setIsAuthenticated(true)
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error(error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
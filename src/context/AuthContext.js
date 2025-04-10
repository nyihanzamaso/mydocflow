"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (storedUser && isAuthenticated === "true") {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      // In a real app, this would be an API call to your Spring Boot backend
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: 1,
        name: "John Doe",
        email: username,
        role: "admin",
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("isAuthenticated", "true")

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Authentication failed",
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


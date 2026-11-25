import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('hirehub_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('hirehub_user')
    const savedToken = localStorage.getItem('hirehub_token')
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      } catch (e) {
        localStorage.removeItem('hirehub_user')
        localStorage.removeItem('hirehub_token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password })
      if (res.data.success) {
        const authData = res.data.data
        setUser(authData)
        setToken(authData.token)
        localStorage.setItem('hirehub_token', authData.token)
        localStorage.setItem('hirehub_user', JSON.stringify(authData))
        toast.success(`Welcome back, ${authData.fullName}!`)
        return authData
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(msg)
      throw err
    }
  }

  const register = async (registerData) => {
    try {
      const res = await authApi.register(registerData)
      if (res.data.success) {
        const authData = res.data.data
        setUser(authData)
        setToken(authData.token)
        localStorage.setItem('hirehub_token', authData.token)
        localStorage.setItem('hirehub_user', JSON.stringify(authData))
        toast.success('Account created successfully! Welcome to HireHub.')
        return authData
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      toast.error(msg)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('hirehub_token')
    localStorage.removeItem('hirehub_user')
    toast.success('Logged out successfully')
  }

  // 1-Click Role Switcher for instant evaluator/interviewer testing
  const switchRoleDemo = async (targetRole) => {
    let email = 'seeker@hirehub.com'
    if (targetRole === 'ROLE_RECRUITER') email = 'recruiter@stripe.com'
    if (targetRole === 'ROLE_ADMIN') email = 'admin@hirehub.com'

    try {
      toast.loading(`Switching to ${targetRole.replace('ROLE_', '')} demo mode...`, { id: 'switch-role' })
      const res = await authApi.login({ email, password: 'password123' })
      if (res.data.success) {
        const authData = res.data.data
        setUser(authData)
        setToken(authData.token)
        localStorage.setItem('hirehub_token', authData.token)
        localStorage.setItem('hirehub_user', JSON.stringify(authData))
        toast.success(`Switched to ${authData.role.replace('ROLE_', '')} (${authData.fullName})`, { id: 'switch-role' })
        return authData
      }
    } catch (err) {
      toast.error('Failed to switch demo account', { id: 'switch-role' })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isJobSeeker: user?.role === 'ROLE_JOB_SEEKER',
        isRecruiter: user?.role === 'ROLE_RECRUITER',
        isAdmin: user?.role === 'ROLE_ADMIN',
        login,
        register,
        logout,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

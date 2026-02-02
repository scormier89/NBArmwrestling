import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUser } from '@/services/eventsApi'

// Simple auth store with hardcoded credentials for quick admin access
// Not secure; intended for internal use only.
export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const email = ref(localStorage.getItem('admin_email') || '')
  const mode = (import.meta?.env?.VITE_AUTH_MODE || 'local').toLowerCase()
  const localOnly = (import.meta?.env?.VITE_ADMIN_LOCAL_ONLY === 'true') || mode === 'local'

  // Hardcoded admin credentials to share internally
  const defaultCreds = {
    email: import.meta?.env?.VITE_ADMIN_EMAIL || 'admin@nbarm.ca',
    password: import.meta?.env?.VITE_ADMIN_PASSWORD || 'letmein',
  }

  function makeLocalToken(sub) {
    const payload = { sub, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 3600*24 }
    try {
      return `local.${btoa(JSON.stringify(payload))}`
    } catch {
      return `local.${sub}`
    }
  }

  async function login(creds = defaultCreds) {
    // Local-only hardcoded login: no backend call
    if (localOnly) {
      if (creds.email !== defaultCreds.email || creds.password !== defaultCreds.password) {
        throw new Error('Invalid local admin credentials')
      }
      token.value = makeLocalToken(creds.email)
      email.value = creds.email
      localStorage.setItem('admin_token', token.value)
      localStorage.setItem('admin_email', email.value)
      return token.value
    }

    // API mode: call backend
    const resp = await loginUser(creds.email, creds.password)
    token.value = resp?.token || ''
    email.value = creds.email
    localStorage.setItem('admin_token', token.value)
    localStorage.setItem('admin_email', email.value)
    return token.value
  }

  function logout() {
    token.value = ''
    email.value = ''
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_email')
  }

  const isLocal = computed(() => localOnly)
  return { token, email, login, logout, defaultCreds, isLocal }
})

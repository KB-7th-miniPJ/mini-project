import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'auth-user'

function loadSavedUser() {
  const savedValue = localStorage.getItem(STORAGE_KEY)

  if (!savedValue) {
    return null
  }

  try {
    return JSON.parse(savedValue)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadSavedUser())
  const isLoggedIn = computed(() => !!user.value)

  function setUser(nextUser) {
    user.value = nextUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  function login(nextUser) {
    setUser(nextUser)
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    user,
    isLoggedIn,
    setUser,
    login,
    logout,
  }
})
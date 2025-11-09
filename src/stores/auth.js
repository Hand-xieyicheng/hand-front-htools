import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const refreshToken = ref('')
  const menuValue = ref('dashboard')

  function setToken(newToken) {
    token.value = newToken
  }
  function setRefreshToken(newRefreshToken) {
    refreshToken.value = newRefreshToken
  }
  function setMenuValue(newMenuValue) {
    menuValue.value = newMenuValue
  }

  // 退出登陆
  function logout() {
    token.value = ''
    refreshToken.value = ''
    window.location.href = 'http://10.211.109.100:8080/login?redirect=' + location.href
  }
  return { token, setToken, refreshToken, setRefreshToken, logout, menuValue, setMenuValue }
}, {
  persist: true,
})

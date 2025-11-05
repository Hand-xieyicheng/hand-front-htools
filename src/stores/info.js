import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', () => {
  const info = ref({})

  function setInfo(newInfo) {
    info.value = newInfo
  }
  return { info, setInfo }  
}, {
  persist: true,
})

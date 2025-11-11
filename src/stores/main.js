import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getBalance } from '@/services/deepseek'
export const useMainStore = defineStore('main', () => {
  const showDoubao = ref(true)
  const balanceInfos = ref(null)

  function setShowDoubao(newShowDoubao) {
    showDoubao.value = newShowDoubao
  }
  function setBalanceInfos(newBalanceInfos) {
    balanceInfos.value = newBalanceInfos
  }
  // 获取当前余额
  async function getCurrentBalance() {
    try {
      if(balanceInfos.value) {
        return
      }
      const response = await getBalance();
      if (response.status === 200) {
        setBalanceInfos({
            is_available: response.data.is_available,
            ...response.data.balance_infos[0]
        });
        console.log('Deepseek 用量:', balanceInfos.value);
      }
    } catch (error) {
      console.error('获取余额失败:', error)
    }
  }
  return { showDoubao, setShowDoubao, balanceInfos, setBalanceInfos, getCurrentBalance }
}, {
  persist: true,
})

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getBalance } from '@/services/deepseek'
import { NotifyPlugin } from 'tdesign-vue-next';
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
  async function getCurrentBalance(refresh = false, successMsg = "刷新成功") {
    try {
      if (balanceInfos.value && !refresh) {
        return
      }
      const response = await getBalance();
      if (response.status === 200) {
        setBalanceInfos({
          is_available: response.data.is_available,
          ...response.data.balance_infos[0]
        });
        console.log('Deepseek 用量:', balanceInfos.value);
        NotifyPlugin('success', {
          title: '刷新成功',
          content: successMsg,
          duration: 3000,
          closeBtn: true
        });
      }
    } catch (error) {
      console.error('获取余额失败:', error)
    }
  }
  return { showDoubao, setShowDoubao, balanceInfos, setBalanceInfos, getCurrentBalance }
}, {
  persist: true,
})

import { defineStore } from 'pinia'
import { MessagePlugin } from 'tdesign-vue-next';
export const useMultiLanStore = defineStore('multiLan', {
  state: () => ({
    name: 'multiLan',
    dataStructure: [],
    languageToParse: "111"
  }),
  getters: {
    // access_token: (state) => state.handAuth.access_token,
  },
  actions: {
    // 设置dataStructure
    setDataStructure(dataStructure) {
      this.dataStructure = dataStructure;
    },
    // 设置languageToParse
    setLanguageToParse(languageToParse) {
      this.languageToParse = languageToParse;
    },
  },
  persist: true,
})
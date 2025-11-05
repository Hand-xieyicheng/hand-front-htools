import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import TDesign from 'tdesign-vue-next';
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
app.use(pinia)
app.use(router)
app.use(TDesign);
app.mount('#app')

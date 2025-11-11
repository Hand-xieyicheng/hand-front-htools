import { createRouter, createWebHistory } from 'vue-router'
import dashboardView from '../views/dashboardView/dashboardView.vue'
// import loginView from '../views/loginView/loginView.vue'
import { useAuthStore } from '../stores/auth.js'
import { useHandAuthStore } from '../stores/handLogin.js'
import { useInfoStore } from '../stores/info.js'
import { getUserInfo } from '../services/info.js'
import { MessagePlugin } from 'tdesign-vue-next'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: dashboardView,
    },
    {
      path: '/multiLanguage',
      name: 'multiLanguage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/multiLanguage/multiLanguage.vue'),
    },
    {
      path: '/responseMessage',
      name: 'responseMessage',
      component: () => import('../views/responseMessage/responseMessage.vue'),
    },
    {
      path: '/projectMaintenance',
      name: 'projectMaintenance',
      component: () => import('../views/projectMaintenance/projectMaintenance.vue'),
    },
    {
      path: '/moduleMaintenance',
      name: 'moduleMaintenance',
      component: () => import('../views/moduleMaintenance/moduleMaintenance.vue'),
    },
    {
      path: '/handPage',
      name: 'handPage',
      component: () => import('../views/handPage/handPage.vue'),
    },
    {
      path: '/listOfView',
      name: 'listOfView',
      component: () => import('../views/listOfView/listOfView.vue'),
    },
    {
      path: '/log',
      name: 'log',
      component: () => import('../views/log/log.vue'),
    },
    {
      path: '/systemInfo',
      name: 'systemInfo',
      component: () => import('../views/systemInfo/systemInfo.vue'),
    },
  ],
})

function parseHashParams(hash) {
  // 处理空值情况
  if (!hash || typeof hash !== 'string') {
    return {};
  }

  // 移除 hash 开头的 #（如果存在）
  const hashStr = hash.startsWith('#') ? hash.slice(1) : hash;

  // 没有参数时返回空对象
  if (!hashStr) {
    return {};
  }

  // 分割参数对（如 a=1&b=2 → ['a=1', 'b=2']）
  const paramPairs = hashStr.split('&');

  const params = {};

  paramPairs.forEach(pair => {
    // 分割键和值（兼容没有 = 的情况，如 "key" 会解析为 { key: '' }）
    const [key, ...valueParts] = pair.split('=');
    // 处理值中可能包含 = 的情况（如 "a=b=c" → key为a，值为b=c）
    const value = valueParts.join('=');

    // 解码 URL 编码（处理特殊字符）
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    params[decodedKey] = decodedValue;
  });

  return params;
}
// 路由前置守卫
router.beforeEach((to, from, next) => {
  console.log(to, from)
  // 如果是工作台或门户首页，从hash获取参数
  if(to.path === "/handPage") {
    const { hash } = to;
    // 从hash获取参数
    const hashParams = parseHashParams(hash);
    console.log(hashParams);
    if(hashParams.access_token){
      const handAuthStore = useHandAuthStore();
      handAuthStore.setHandAuth({
        ...hashParams,
        getDateTime: new Date()
      });
      next({ name: 'handPage' });
    } else {
      console.warn("不存在access_token");
    }
  }
  // 检查链接上是否存在token
  const { token, refresh_token } = to.query
  if (token) {
    useAuthStore().setToken(token);
    localStorage.setItem('token', token);
    // 获取个人信息
    getUserInfo({ token }).then(res => {
      useInfoStore().setInfo(res.data)
    })
  }
  // 检查链接上是否存在refreshToken
  if (refresh_token) {
    useAuthStore().setRefreshToken(refresh_token)
    localStorage.setItem('refresh_token', refresh_token);
  }
  // 如果不存在token，且访问的不是登录页，则跳转到登录页
  console.log('useAuthStore().token', useAuthStore().token)
  if (useAuthStore().token) {
    useAuthStore().setMenuValue(to.name)
    next()
  } else {
    location.href = 'http://localhost:8080/login?redirect=' + location.href
  }
})
export default router

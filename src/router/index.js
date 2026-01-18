import { createRouter, createWebHistory } from 'vue-router'
import dashboardView from '../views/dashboardView/dashboardView.vue'
// import loginView from '../views/loginView/loginView.vue'
import { useAuthStore } from '../stores/auth.js'
import { useHandAuthStoreNew } from '@/stores/handLoginNew';
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
    }, {
      path: '/handPageNew',
      name: 'handPageNew',
      component: () => import('../views/handPage/handPageNew.vue'),
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
    {
      path: '/translate',
      name: 'translate',
      component: () => import('../views/translate/translateView.vue'),
    },
    {
      path: '/envManagement',
      name: 'envManagement',
      component: () => import('../views/envManagement/envManagement.vue'),
    }, {
      path: '/basicInfo',
      name: 'basicInfo',
      component: () => import('../views/basicPages/basicInfo.vue'),
    }
  ],
})

/**
 * 解析 URL 中的查询参数和哈希参数，合并为一个对象
 * @param {string} url - 要解析的 URL
 * @returns {Object} 合并后的参数对象
 */
function parseUrlParams(url) {
  // 创建 URL 对象，方便解析
  const urlObj = new URL(url, window.location.origin);

  // 解析查询参数（? 后面的部分）
  const queryParams = {};
  urlObj.searchParams.forEach((value, key) => {
    queryParams[key] = decodeURIComponent(value);
  });

  // 解析哈希参数（# 后面的部分）
  const hashParams = {};
  const hash = urlObj.hash.slice(1); // 去掉 # 符号
  if (hash) {
    const hashParts = hash.split('&');
    hashParts.forEach(part => {
      const [key, value] = part.split('=');
      if (key) {
        hashParams[key] = decodeURIComponent(value || '');
      }
    });
  }

  // 合并查询参数和哈希参数，哈希参数会覆盖同名的查询参数
  return { ...queryParams, ...hashParams };
}
// 路由前置守卫
router.beforeEach((to, from, next) => {
  console.log(to, from)
  // 如果是工作台或门户首页，从hash获取参数
  if (to.path === "/handPageNew") {
    const { href } = to;
    // 从hash获取参数
    const hashParams = parseUrlParams(href);
    console.log(hashParams);
    if (hashParams.env && hashParams.access_token) {
      const handAuthStoreNew = useHandAuthStoreNew();
      handAuthStoreNew.setHandEnvData({
        ...hashParams,
        getDateTime: new Date()
      });
      next({ name: 'handPageNew' });
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
    location.href = import.meta.env.VITE_APP_AUTH_SYSTEM_BASE_URL + '/login?redirect=' + location.href
  }
})
export default router

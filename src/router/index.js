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
    {
      path: '/translate',
      name: 'translate',
      component: () => import('../views/translate/translateView.vue'),
    },
    {
      path: '/envManagement',
      name: 'envManagement',
      component: () => import('../views/envManagement/envManagement.vue'),
    },{
      path: '/basicInfo',
      name: 'basicInfo',
      component: () => import('../views/basicPages/basicInfo.vue'),
    }
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
  
  // ------------------------- Hand Admin 账户维护逻辑 -------------------------
  // 如果是 Hand Admin 页面，且 URL 中包含 Hash 参数 (oauth 认证返回)
  if(to.path === "/handPage") {
    const { hash, query } = to;
    
    // 1. 从 URL 查询参数中获取环境标识符
    // 假设在跳转前，我们通过 redirect_uri 将 env 参数带回来了
    const currentEnv = query.env || '113'; // 默认使用 '113'
    
    // 2. 从hash获取参数
    const hashParams = parseHashParams(hash);
    console.log(`[${currentEnv}] 接收到 Hash 参数:`, hashParams);

    if(hashParams.access_token){
      const handAuthStore = useHandAuthStore();
      
      // 3. 核心修改：调用 setHandAuth 时，传入环境标识符
      handAuthStore.setHandAuth(currentEnv, {
        ...hashParams
        // Store 的 setHandAuth 方法内部会设置 getDateTime
      });

      // 登录成功，跳转到 Hand 页面，并替换 URL，清除 Hash 和 Query 参数
      // 保持页面干净，避免二次触发守卫
      next({ path: '/handPage', replace: true });
      return;
      
    } else if (hash.includes('error')) {
      // 授权失败处理
      console.warn(`[${currentEnv}] 登录授权失败或取消:`, hashParams);
      // 清除 Hash 和 Query 参数，并给出提示
      MessagePlugin.error(`[${currentEnv}] 登录失败，请重新尝试。`);
      next({ path: '/handPage', replace: true }); 
      return;

    } else {
      console.warn("不存在access_token 或未完成授权");
    }
  }
  
  // ------------------------- 其他应用的认证逻辑 (保持原样) -------------------------
  
  // 检查链接上是否存在token (此部分逻辑与 Hand Admin 分离，保留原样)
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
    // 确保这里的 URL 协议和域名正确
    location.href = 'http://localhost:8080/login?redirect=' + location.href
  }
})
export default router

<template>
  <div :class="{ 'color-bg': useAuthStore().menuValue === 'dashboard' }">
    <t-affix ref="affix" :offset-top="useAuthStore().menuValue === 'dashboard' ? -1 : 0" :onFixedChange="handleFixedChange">
      <header>
        <div class="menu-box" :style="{ width: '100%' }">
          <t-head-menu v-model="useAuthStore().menuValue" expand-type="popup" @change="changeHandler"
            :class="{ 'menu-top-transparent': useAuthStore().menuValue === 'dashboard', 'menu': true }">
            <template #logo>
              <img height="20" src="@/assets/logo.png" alt="logo" />
            </template>
            <t-menu-item value="dashboard"> 首页 </t-menu-item>
            <t-menu-item value="handPage"> Hand账户 </t-menu-item>
            <t-menu-item value="handPageNew"> Hand账户（new） </t-menu-item>
            <t-submenu value="language" title="多语言">
              <t-menu-item value="multiLanguage"> 页面字段 </t-menu-item>
              <t-menu-item value="multiLanguageQuery"> 多语言查询 </t-menu-item>
              <!-- <t-menu-item value="responseMessage"> 返回消息 </t-menu-item> -->
            </t-submenu>
            <t-submenu value="listOfView" title="独立值集">
              <t-menu-item value="listOfView"> 新增编辑 </t-menu-item>
              <!-- <t-menu-item value="listOfView"> 数据同步 </t-menu-item> -->
            </t-submenu>
            <t-menu-item value="translate"> 快翻译 </t-menu-item>
            <!-- <t-menu-item value="dashboard"> 文档操作 </t-menu-item> -->
            <t-submenu value="dataManagement" title="数据管理">
              <t-menu-item value="envManagement"> 环境管理 </t-menu-item>
              <t-menu-item value="projectMaintenance"> 多语言项目维护 </t-menu-item>
              <t-menu-item value="moduleMaintenance"> 多语言模块维护 </t-menu-item>
            </t-submenu>
            <template #operations>
              <div class="colorful-btn" style="margin-right: 20px;" @click="handleToggleDoubao">
                <img src="https://files.codelife.cc/icons/doubao.com.webp" width="24" height="24" alt="" srcset="">
                <!-- <span class="text-gradient">豆包</span> -->
              </div>
              <!-- <t-tooltip content="Github" placement="bottom" show-arrow theme="light">
                <t-button variant="text" shape="square" @click="handleClickGithub">
                  <template #icon><t-icon name="logo-github" /></template>
                </t-button>
              </t-tooltip> -->
              <t-tooltip content="日志" placement="bottom" show-arrow theme="light">
                <t-button variant="text" shape="square" @click="handleClickLog">
                  <template #icon><t-icon name="system-log" /></template>
                </t-button>
              </t-tooltip>
              <t-tooltip content="系统信息" placement="bottom" show-arrow theme="light">
                <t-button variant="text" shape="square" @click="handleClickSystemInfo">
                  <template #icon><t-icon name="questionnaire-double" /></template>
                </t-button>
              </t-tooltip>
              <!-- <t-button variant="text" shape="square">
                <template #icon><t-icon name="mail" /></template>
              </t-button>
              <t-button variant="text" shape="square">
                <template #icon><t-icon name="user" /></template>
              </t-button> -->
              <t-dropdown :options="options" trigger="click" @click="clickHandler">
                <t-space>
                  <t-button variant="text">
                    {{ useInfoStore().info.username }}
                    <template #suffix><t-icon name="chevron-down" size="16" /></template>
                  </t-button>
                </t-space>
              </t-dropdown>
            </template>
          </t-head-menu>
        </div>
      </header>
    </t-affix>

  </div>
  <div class="content-container">
    <div class="flex-box">
      <div class="main-content">
        <RouterView keep-alive />
      </div>
      <div v-if="mainStore.showDoubao" class="doubao-box">
        <!-- <t-affix class="doubao-iframe" :offset-top="50"> -->
        <iframe class="doubao-iframe" src="https://www.doubao.com/chat/" frameborder="0" width="100%"
          height="100%"></iframe>
        <!-- </t-affix> -->
      </div>
    </div>
  </div>
  <!-- <t-back-top
      container="body"
      :visible-height="0"
      style="position: absolute"
      :offset="['24px', '80px']"
    ></t-back-top> -->
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import router from './router'
import { useInfoStore } from './stores/info'
import { useAuthStore } from './stores/auth'
import { useMainStore } from './stores/main'
import "./styles/common.less"
const mainStore = useMainStore();
const expanded = ref(['dashboard']);
const options = [
  { content: '退出登陆', value: 1 },
  { content: '个人中心', value: 2 },
];
// 点击下拉菜单选项
const clickHandler = (data) => {
  if (data.value === 1) {
    useAuthStore().logout();
  } else if (data.value === 2) {
    router.push({ name: 'person' });
  }
};
// 切换菜单跳转到对应路由
const changeHandler = (active) => {
  useAuthStore().setMenuValue(active);
  router.push({ name: active });
};
// 切换affix固定状态
const handleFixedChange = (fixed) => {
  if(!mainStore.menuValue === 'dashboard'){
    document.querySelector('.menu').classList.add('menu-top-transparent');
    return;
  }
  if (fixed ) {
    document.querySelector('.menu').classList.remove('menu-top-transparent');
  } else {
    document.querySelector('.menu').classList.add('menu-top-transparent');
  }
};
// 点击日志图标跳转到日志页面
const handleClickLog = () => {
  router.push({ name: 'log' });
};
// 点击系统信息图标跳转到系统信息页面
const handleClickSystemInfo = () => {
  router.push({ name: 'systemInfo' });
};
// 切换豆包显示状态
const handleToggleDoubao = () => {
  useMainStore().setShowDoubao(!useMainStore().showDoubao);
};
</script>
<style>
@font-face {
  font-family: 'dingliexidafont';
  /* 字体家族名称（自定义） */
  src: url('./assets/fonts/dingliexidafont.ttf') format('truetype');
  /* 优先加载 woff2 */
  font-weight: 400;
  /* 字体粗细，如 400（正常）、700（加粗） */
  font-style: normal;
  /* 字体样式，如 normal、italic */
}

@font-face {
  font-family: 'ZenMaruGothic';
  src: url('./assets/fonts/ZenMaruGothic-Regular.ttf');
  font-weight: 400;
  /* Regular 对应 400，也可写 normal */
  font-style: normal;
}

@font-face {
  font-family: 'ZenMaruGothic';
  src: url('./assets/fonts/ZenMaruGothic-Bold.ttf');
  font-weight: 700;
  /* Bold 对应 700，也可写 bold */
  font-style: normal;
}

/* * {
  font-family: 'ZenMaruGothic', sans-serif !important;
} */
</style>

<template>
  <div :class="{ 'color-bg': useAuthStore().menuValue === 'dashboard' }">
    <t-affix ref="affix" :offset-top="0" :onFixedChange="handleFixedChange">
      <header>
        <div class="menu-box" :style="{ width: '100%' }">
          <t-head-menu v-model="useAuthStore().menuValue" expand-type="popup" @change="changeHandler"
            :class="{ 'menu-top-transparent': useAuthStore().menuValue === 'dashboard', 'menu': true }">
            <template #logo>
              <img height="25" src="@/assets/logo.png" alt="logo" />
            </template>
            <t-menu-item value="dashboard"> 首页 </t-menu-item>
            <t-menu-item value="handPage"> Hand账户 </t-menu-item>
            <t-submenu value="language" title="多语言">
              <t-menu-item value="multiLanguage"> 页面字段 </t-menu-item>
              <t-menu-item value="responseMessage"> 返回消息 </t-menu-item>
            </t-submenu>
             <t-submenu value="listOfView" title="值集">
              <t-menu-item value="listOfView"> 独立值集 </t-menu-item>
            </t-submenu>
            <t-menu-item value="dashboard"> 文档操作 </t-menu-item>
            <t-submenu value="dataManagement" title="数据管理">
              <t-menu-item value="projectMaintenance"> 项目维护 </t-menu-item>
              <t-menu-item value="moduleMaintenance"> 模块维护 </t-menu-item>
            </t-submenu>
            <template #operations>
              <t-tooltip content="Github" placement="bottom" show-arrow theme="light">
                <t-button variant="text" shape="square" @click="handleClickGithub">
                  <template #icon><t-icon name="logo-github" /></template>
                </t-button>
              </t-tooltip>
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
    <RouterView keep-alive />
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
  console.log('fixed', fixed);
  if (fixed) {
    document.querySelector('.menu').classList.remove('menu-top-transparent');
  } else {
    document.querySelector('.menu').classList.add('menu-top-transparent');
  }
};
// 点击github图标跳转
const handleClickGithub = () => {
  window.open('https://github.com/Hand-xieyicheng/hand-front-auth', '_blank');
};
// 点击日志图标跳转到日志页面
const handleClickLog = () => {
  router.push({ name: 'log' });
};
// 点击系统信息图标跳转到系统信息页面
const handleClickSystemInfo = () => {
  router.push({ name: 'systemInfo' });
};
</script>
<style lang="less">
#app,
body {
  background-color: #f5f5f592;
  margin: 0;
  padding: 0;
}

.color-bg:before {
  content: '';
  position: absolute;
  top: 0 !important;
  left: 0;
  right: 0;
  width: 100%;
  height: 550px;
  background-image: url(https://ai-bot.cn/wp-content/uploads/2023/07/blury-shape-bg-light.png);
  background-size: cover;
  z-index: -1;
}

// .menu-box {
//   border-bottom: 1px solid #f2f2f2;
// }

.menu-top-transparent {
  background-color: transparent;
}


.red-bg::after {
  background-image: url("/src/assets/red-bg.png");
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 1;
  background-size: contain;
  height: 100%;
  background-repeat: no-repeat;
  pointer-events: none;
}

.content-container {
  width: calc(100% - 20px);
  height: calc(100vh - 66px);
  padding: 10px 0 10px 0;
  margin: auto;
  box-sizing: border-box;
  border-radius: 10px;
}

.t-table--striped:not(.t-table--header-fixed)>.t-table__content>table>tbody>tr:nth-of-type(odd):not(.t-table__expanded-row) {
  background-color: #f2f8ff5c;
}

.page-header-box {
  padding: 6px 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .page-header-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0;
    padding: 0;
  }

  .page-header-button-options {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
  }
}

.page-content-box {
  background-color: #fff;
  min-height: 100%;
  padding: 16px;
  border-radius: 4px;
}
</style>

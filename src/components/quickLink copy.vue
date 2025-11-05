<template>
  <footer class="app-footer">
    <!-- 快捷链接区域 -->
    <div class="footer-links">
      <div class="link-group" v-for="(group, index) in linkGroups" :key="index">
        <h3 class="group-title">{{ group.title }}</h3>
        <ul class="link-list">
          <li v-for="(link, idx) in group.links" :key="idx">
            <a :href="link.url" class="link-item" target="_blank">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 版权信息区域 -->
    <div class="footer-copyright">
      <div class="copyright-text">
        © {{ new Date().getFullYear() }} Hand. 保留所有权利
      </div>
      <div class="copyright-links">
        <a href="/privacy" class="copyright-link">隐私政策</a>
        <span class="separator">|</span>
        <a href="/terms" class="copyright-link">服务条款</a>
        <span class="separator">|</span>
        <a href="/contact" class="copyright-link">联系我们</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

// 快捷链接数据
const linkGroups = ref([
  {
    title: "环境",
    links: [
      { label: "POC", url: "/product/features" },
      { label: "113", url: "http://xhi-dev.hand-china.com/" },
      { label: "AWS", url: "/product/changelog" },
      { label: "飞搭验证", url: "/product/faq" }
    ]
  },
  {
    title: "业务文档",
    links: [
      { label: "值集一览", url: "https://u0vocx8xrmg.feishu.cn/sheets/WyPpsCJrHhaDy6tiqWfcE4Lmnjg?sheet=3xJUMY" },
      { label: "页面清单", url: "https://u0vocx8xrmg.feishu.cn/sheets/E6vjsEfhlhFC16ttAvXc0hOCnBX?sheet=2bRQjX" },
      { label: "社区论坛", url: "/resources/forum" }
    ]
  },
  {
    title: "技术文档",
    links: [
      { label: "Hzero", url: "/company/about" },
      { label: "飞搭", url: "/company/careers" },
      { label: "猪齿鱼UI", url: "/company/media" },
      { label: "快速链接设定", url: "/company/partners" }
    ]
  },
  {
    title: "其它",
    links: [
      { label: "发版清单", url: "#wechat" },
      { label: "Figma", url: "谢谢" },
      { label: "GitLab", url: "#github" },
    ]
  }
]);
</script>

<style lang="less" scoped>
// 变量定义 - 方便统一修改
@primary-color: #1e50bc; // 主题蓝色
@text-color: #4e5969; // 文本默认颜色
@text-light: #86909c; // 浅色文本
@border-color: #f0f2f5; // 边框颜色
@separator-color: #c9cdcf; // 分隔符颜色
@transition-base: all 0.2s ease; // 基础过渡动画

// 混合 - 可复用样式
.transition(@property: all) {
  transition: @property 0.2s ease;
}

// 基础样式
.app-footer {
  background-color: #ffffff;
  color: @text-color;
  padding: 40px 20px 20px;
  border-top: 1px solid @border-color;

  // 快捷链接区域
  .footer-links {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto 30px;
    gap: 40px;

    .link-group {
      flex: 1;
      min-width: 160px;

      .group-title {
        font-size: 16px;
        font-weight: 600;
        color: @primary-color;
        margin-bottom: 16px;
      }

      .link-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .link-item {
          display: block;
          color: @text-color;
          text-decoration: none;
          font-size: 14px;
          padding: 6px 0;
          .transition();

          &:hover {
            color: @primary-color;
            transform: translateX(4px);
            font-weight: 600;
          }
        }
      }
    }
  }

  // 版权信息区域
  .footer-copyright {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
    border-top: 1px solid @border-color;
    text-align: center;

    .copyright-text {
      font-size: 13px;
      color: @text-light;
      margin-bottom: 12px;
    }

    .copyright-links {
      font-size: 12px;
      color: @text-light;

      .copyright-link {
        color: @text-light;
        text-decoration: none;
        margin: 0 8px;
        .transition(color);

        &:hover {
          color: @primary-color;
        }
      }

      .separator {
        margin: 0 4px;
        color: @separator-color;
      }
    }
  }

  // 响应式适配
  @media (max-width: 768px) {
    .footer-links {
      flex-direction: column;
      gap: 24px;
      padding-left: 20px;

      .link-group {
        min-width: 100%;
      }
    }

    .footer-copyright {
      .copyright-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .separator {
          display: none;
        }
      }
    }
  }
}
</style>
<template>
  <div>
    <!-- <div style="height: 388px;"></div> -->
    <footer class="app-footer">
      <!-- 快捷链接区域 -->
      <div class="footer-container">
        <div class="footer-links">
          <div class="link-group" v-for="(group, index) in linkGroups" :key="index">
            <h3 class="group-title">
              <i class="group-icon" :class="getGroupIcon(index)"></i>
              {{ group.title }}
            </h3>
            <ul class="link-list">
              <li v-for="(link, idx) in group.links" :key="idx">
                <a :href="formatLinkUrl(link.url)" class="link-item" :target="isValidUrl(link.url) ? '_blank' : '_self'"
                  :rel="isValidUrl(link.url) ? 'noopener noreferrer' : ''">
                  <span class="link-text">{{ link.label }}</span>
                  <i class="link-icon">→</i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="footer-divider"></div>

        <!-- 版权信息区域 -->
        <div class="footer-copyright">
          <div class="copyright-content">
            <div class="copyright-logo">HTools</div>
            <div class="copyright-text">
              © {{ new Date().getFullYear() }} HTools. 保留所有权利
            </div>
          </div>
          <div class="copyright-links">
            <a href="/privacy" class="copyright-link">隐私政策</a>
            <span class="separator">|</span>
            <a href="/terms" class="copyright-link">服务条款</a>
            <span class="separator">|</span>
            <a href="/contact" class="copyright-link">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 快捷链接数据
const linkGroups = ref([
  {
    title: "环境",
    links: [
      { label: "POC", url: "https://poc.hzero.jp/workplace" },
      { label: "113", url: "http://xhi-dev.hand-china.com/" },
      { label: "AWS", url: "https://gbgpoc.zenlead-global.com/workplace" },
      { label: "飞搭验证", url: "https://trial.saas.hand-china.com/portal/home" }
    ]
  },
  {
    title: "业务文档",
    links: [
      { label: "值集一览", url: "https://u0vocx8xrmg.feishu.cn/sheets/WyPpsCJrHhaDy6tiqWfcE4Lmnjg?sheet=3xJUMY" },
      { label: "页面清单", url: "https://u0vocx8xrmg.feishu.cn/sheets/E6vjsEfhlhFC16ttAvXc0hOCnBX?sheet=2bRQjX" },
      { label: "Messages一览", url: "https://u0vocx8xrmg.feishu.cn/sheets/TbhAs92tPhuSK0tA3JkcLCRxnee?sheet=3xJUMY" },
      { label: "hfat多语言", url: "https://u0vocx8xrmg.feishu.cn/sheets/M743s3sdyhl4MFtyYThcmcFDnPh" },
    ]
  },
  {
    title: "技术文档",
    links: [
      { label: "Hzero指导手册", url: "https://open.hand-china.com/document-center/doc/product/10137/10227?lang=zh_CN&doc_id=32521&doc_code=32521" },
      { label: "飞搭", url: "https://open.hand-china.com/document-center/doc/product/10001/10945?doc_code=197304&lang=zh_CN&doc_id=525401" },
      { label: "猪齿鱼UI", url: "https://open-hand.github.io/choerodon-ui/zh/procmp/dataset/dataset-example" },
      { label: "Hzero数据权限介绍", url: "https://open.hand-china.com/community/detail/625872021372407808?#Hzero%E6%95%B0%E6%8D%AE%E6%9D%83%E9%99%90%E4%BB%8B%E7%BB%8D" }
    ]
  },
  {
    title: "其它",
    links: [
      { label: "发版清单", url: "#wechat" },
      { label: "Figma", url: "https://www.figma.com" },
      { label: "GitLab", url: "https://git.dx.hand-china.com" },
      { label: "2025需求排期计划", url: "https://u0vocx8xrmg.feishu.cn/sheets/QcJhsY50bheOkJtu4Ymcm4V9nEh" },
    ]
  }
]);

// 分组图标映射
const getGroupIcon = (index) => {
  const icons = ['🌐', '📋', '💻', '🔧'];
  return icons[index % icons.length];
};

// 链接格式处理
const formatLinkUrl = (url) => {
  if (url === '谢谢' || !url) return '#';
  return url;
};

// 验证是否为有效外部链接
const isValidUrl = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};
</script>

<style lang="less" scoped>
// 变量定义
// @primary-color: #0052d9; 
// @primary-light: #f2f3ff;
// @primary-hover: #163e99;
// @text-color: #4e5969;    
// @text-light: #86909c;    
// @border-color: #f0f2f5;  
// @separator-color: #c9cdcf; 
@primary-color: #fff;
@primary-light: #0053d9;
@primary-hover: #163e99;
@text-color: #fff;
@text-light: #fff;
@border-color: #fff;
@separator-color: #c9cdcf;
@shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
@transition-base: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

// 混合 - 修复过渡动画混合定义
.common-shadow {
  box-shadow: @shadow-light;
}

.common-radius {
  border-radius: 8px;
}

// 修正过渡混合，支持多属性传递
.transition(@props: all) {
  transition: @props 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

// 基础样式
.app-footer {
  // position: fixed;
  // bottom: 0;
  // left: 0;
  // right: 0;
  position: relative;
  // left: -10px;
  // width: 100vw;
  background-color: @primary-light;
  // background-color: #ffffff;
  color: @text-color;
  padding: 10px 20px 24px;
  border-top: 1px solid @border-color;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-links {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
    padding: 24px;
    // background-color: @primary-light;
    .common-radius;
    // margin-bottom: 24px;

    .link-group {
      flex: 1;
      min-width: 160px;
      padding: 8px 0;

      .group-title {
        font-size: 16px;
        font-weight: 600;
        color: @primary-color;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px 0;

        .group-icon {
          font-size: 18px;
        }
      }

      .link-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .link-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: @text-color;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 6px;
          .transition();

          .link-text {
            .transition();
          }

          .link-icon {
            font-size: 12px;
            color: @text-light;
            opacity: 0;
            transform: translateX(-4px);
            .transition();
          }

          &:hover {
            background-color: #ffffff;
            color: @primary-hover;
            font-weight: 500;
            transform: translateX(0);
            .common-shadow;

            .link-text {
              color: @primary-hover;
            }

            .link-icon {
              opacity: 1;
              transform: translateX(0);
              color: @primary-hover;
            }
          }
        }
      }
    }
  }

  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #d8d8d8, transparent);
    margin: 8px 0 24px;
  }

  .footer-copyright {
    // padding-top: 20px;
    text-align: center;

    .copyright-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;

      .copyright-logo {
        font-size: 18px;
        font-weight: 700;
        color: @primary-color;
        letter-spacing: 0.5px;
      }
    }

    .copyright-text {
      font-size: 13px;
      color: @text-light;
      margin: 0;
    }

    .copyright-links {
      font-size: 12px;
      color: @text-light;
      padding: 8px 0;

      .copyright-link {
        color: @text-light;
        text-decoration: none;
        margin: 0 12px;
        padding: 4px 0;
        border-bottom: 1px solid transparent;
        // 修正调用方式，使用正确的参数格式
        // .transition(color, border-color);

        &:hover {
          color: @primary-color;
          border-bottom-color: @primary-color;
        }
      }

      .separator {
        margin: 0 4px;
        color: @separator-color;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 32px 16px 16px;

    .footer-links {
      flex-direction: column;
      gap: 28px;
      padding: 16px;

      .link-group {
        min-width: 100%;
        padding: 8px 12px;
      }

      .link-item {
        padding: 8px 8px;
      }
    }

    .footer-copyright {
      .copyright-content {
        flex-direction: column;
        gap: 8px;
      }

      .copyright-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px 16px;

        .copyright-link {
          margin: 0;
        }

        .separator {
          display: none;
        }
      }
    }
  }
}
</style>
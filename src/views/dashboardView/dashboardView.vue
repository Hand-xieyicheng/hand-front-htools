<template>
  <div class="app-container" :class="{ dark: isDarkMode }">
    <!-- 顶部导航栏 -->

    <main class="main-content">
      <!-- 搜索区域 -->
      <section id="home" class="search-section">
        <div class="container">
          <div class="search-container">
            <h2 class="section-title">发现更高效的导航体验</h2>
            <p class="section-subtitle">一站式访问你常用的网站和工具</p>

            <!-- 其他模板内容不变，仅替换搜索框部分 -->
            <div class="search-box">
              <DotLottieVue class="search-animation" autoplay loop
            src="http://xhi-file-dev.hand-china.com/hd-333/4/BUILD_AIGC_STORAGE_CODE/f1cc1488b7574f2db49fcdea6c2f8bb8@person1.lottie" />
              <!-- 搜索引擎下拉选择器 -->
              <div class="search-engine-selector" @mouseenter="toggleEngineDropdown(true)"
                @mouseleave="toggleEngineDropdown(false)">
                <div class="selected-engine">
                  <i :class="`engine-icon ${selectedEngine.iconClass}`"></i>
                  <span class="engine-name">{{ selectedEngine.name }}</span>
                  <span class="engine-arrow">▼</span>
                </div>
                <!-- 下拉选项 -->
                <div class="engine-dropdown" :class="{ open: isEngineDropdownOpen }">
                  <div class="engine-option" v-for="engine in searchEngines" :key="engine.id"
                    @click="selectEngine(engine)">
                    <i :class="`engine-icon ${engine.iconClass}`"></i>
                    <span class="engine-name">{{ engine.name }}</span>
                  </div>
                </div>
              </div>

              <input type="text" v-model="searchQuery" placeholder="搜索网站、工具或资源..." class="search-input"
                @keyup.enter="handleSearch">
              <button class="search-btn" @click="handleSearch">
                <t-icon name="search" class="icon-search"></t-icon>
              </button>
            </div>

            <div class="hot-tags">
              <span class="tag-title">热门搜索:</span>
              <a href="#" class="tag" @click="handleSearch('稀土掘金')">稀土掘金</a>
              <a href="#" class="tag" @click="handleSearch('Deepseek')">Deepseek</a>
              <a href="#" class="tag" @click="handleSearch('办公软件')">办公软件</a>
              <a href="#" class="tag" @click="handleSearch('Bilibili')">Bilibili</a>
              <a href="#" class="tag" @click="handleSearch('创意素材')">创意素材</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 分类导航区 -->
      <section class="categories-section">
        <div class="container">
          <h3 class="section-heading">分类导航</h3>

          <div class="categories-grid">
            <div class="category-card" v-for="category in categories" :key="category.id"
              @click="handleCategoryClick(category)">
              <div class="category-icon" :style="{ backgroundColor: category.color }">
                <img :width="category?.width ?? 32" :height="category?.height ?? 32" :src="category.icon"
                  alt="category icon" class="category-icon-image">
              </div>
              <h4 class="category-name">{{ category.name }}</h4>
              <p class="category-desc">{{ category.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门推荐区 -->
      <section id="resources" class="featured-section">
        <div class="container">
          <div class="section-header">
            <h3 class="section-heading">热门推荐</h3>
            <a href="#quick-links" class="view-all">查看全部 →</a>
          </div>

          <div class="featured-grid">
            <div class="featured-card" v-for="(item, index) in featuredItems" :key="index">
              <div class="card-badge" v-if="item.isNew">新品</div>
              <div class="card-image">
                <img :src="item.img" :alt="item.name">
              </div>
              <div class="card-content">
                <h4 class="card-title">{{ item.name }}</h4>
                <p class="card-desc">{{ item.desc }}</p>
                <div class="card-meta">
                  <span class="card-category">{{ item.category }}</span>
                  <span class="card-rating">★ {{ item.rating }}</span>
                </div>
              </div>
              <a :href="item.url" class="card-link" target="_blank">访问 →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 常用工具区 -->
      <!-- <section id="tools" class="tools-section">
        <div class="container">
          <h3 class="section-heading">常用工具</h3>
          
          <div class="tools-grid">
            <div class="tool-item" v-for="(tool, index) in tools" :key="index" @mouseenter="handleToolHover(index, true)" @mouseleave="handleToolHover(index, false)">
              <div class="tool-icon" :class="{ hovered: tool.hovered }">
                {{ tool.icon }}
              </div>
              <span class="tool-name">{{ tool.name }}</span>
            </div>
          </div>
        </div>
      </section> -->

      <!-- 快捷链接区 -->
      <section class="quick-links-section">
        <div class="container">
          <h3 class="section-heading" id="quick-links">快捷链接</h3>

          <div class="quick-links-container">
            <div class="links-column" v-for="(column, index) in quickLinks" :key="index">
              <h4 class="column-title">{{ column.title }}</h4>
              <ul class="links-list">
                <li class="link-item" v-for="(link, linkIndex) in column.links" :key="linkIndex">
                  <a :href="link.url" class="link" target="_blank">{{ link.label }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer id="about" class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo">
              <span class="logo-icon"><img height="20" src="@/assets/logo.png" alt="logo alt" class="logo-image"></span>
            </div>
            <p class="brand-desc">
              打造高效、便捷的网络导航体验，让每一次访问都更加顺畅
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="微博">🐦</a>
              <a href="#" class="social-link" aria-label="微信">💬</a>
              <a href="#" class="social-link" aria-label="GitHub">💻</a>
              <a href="#" class="social-link" aria-label="知乎">❓</a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-links-column">
              <h4 class="footer-links-title">关于我们</h4>
              <ul class="footer-links-list">
                <li><a href="#">团队介绍</a></li>
                <li><a href="#">联系方式</a></li>
                <li><a href="#">加入我们</a></li>
                <li><a href="#">隐私政策</a></li>
              </ul>
            </div>

            <div class="footer-links-column">
              <h4 class="footer-links-title">帮助中心</h4>
              <ul class="footer-links-list">
                <li><a href="#">使用指南</a></li>
                <li><a href="#">常见问题</a></li>
                <li><a href="#">反馈建议</a></li>
                <li><a href="#">网站提交</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">© 2025 HTools. 保留所有权利。</p>
          <div class="footer-bottom-links">
            <a href="#">服务条款</a>
            <a href="#">隐私政策</a>
            <a href="#">Cookie 政策</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// 状态管理
const isScrolled = ref(false);
const isDarkMode = ref(false);
const isMobile = ref(false);
const mobileMenuOpen = ref(false);
const activeNav = ref('home');
const searchQuery = ref('');
const isEngineDropdownOpen = ref(false); // 下拉框显示状态

// 搜索引擎配置（图标使用Font Awesome类名，需确保项目引入FA）
const searchEngines = ref([
  { id: 1, name: '谷歌', iconClass: 'fa-google', url: 'https://www.google.com/search?q=' },
  { id: 2, name: '百度', iconClass: 'fa-baidu', url: 'https://www.baidu.com/s?wd=' },
  { id: 3, name: '必应', iconClass: 'fa-bing', url: 'https://www.bing.com/search?q=' },
  { id: 4, name: '搜狗', iconClass: 'fa-sogou', url: 'https://www.sogou.com/web?query=' }
]);

const selectedEngine = ref(searchEngines.value[0]); // 默认选中谷歌
// 分类数据
const categories = ref([
  { id: 1, name: 'Figma', desc: 'HiFAi design', icon: 'https://files.codelife.cc/icons/figma.svg', color: '#4F46E5', url: 'https://www.figma.com/design/LKumBpqPRLL1mIZE0FHLb8/HiFAi-design?node-id=18-1044&t=Tt9x5OXjDywOesXf-1' },
  { id: 2, name: '飞书文档', desc: '【功能设计】文件夹', icon: 'https://files.codelife.cc/icons/feishu.svg', color: '#ffffff', url: 'https://u0vocx8xrmg.feishu.cn/drive/folder/Mq6rf6mQbl8Eqcdv4soc5jYynSc' },
  { id: 3, name: 'Hand门户', desc: '汉得门户系统', width: 110, icon: 'https://file-manager.hand-china.com/hand-hskp-login/4/HAND/d4c717af957a49849c523b4f5141e246@HAND logo(带slogan).png', color: '#FFFFFF', url: 'https://login.hand-china.com/sso/login?service=http%3A%2F%2Feip.hand-china.com' },
  { id: 4, name: 'Hand邮箱', desc: '汉得邮箱', width: 110, icon: 'http://mailhz.qiye.163.com/qiyeimage/logo/479335063/1546504112119.png', color: '#FFFFFF', url: 'https://mail.hand-china.com/' },
  { id: 5, name: '扣子', desc: '用Agent重塑生产力', icon: 'https://files.codelife.cc/icons/coze.cn.svg', color: '#4d54e9', url: 'https://www.coze.cn/' },
  // { id: 6, name: '娱乐休闲', desc: '影视、音乐与游戏平台', icon: '🎮', color: '#8B5CF6' },
]);

// 热门推荐数据
const featuredItems = ref([
  {
    name: '稀土掘金',
    desc: '掘金是面向全球中文开发者的技术内容分享与交流平台。',
    category: '开发资源',
    rating: 4.9,
    isNew: false,
    img: 'https://gd-hbimg.huaban.com/129d02b62c3842f08771f5a5c4c30c4cc2649b9310fdf4-mqbl6M'
  },
  {
    name: '花瓣网',
    desc: '专业设计师在花瓣发现、收集灵感',
    category: '设计资源',
    rating: 4.8,
    isNew: false,
    img: "https://files.codelife.cc/website/huaban.svg",
    url: "http://huaban.com/"
  },
  {
    name: 'Notion 协作平台',
    desc: '一体化工作空间，支持文档、表格、看板等多种',
    category: '办公效率',
    rating: 4.7,
    isNew: true
  },
]);

// 常用工具数据
const tools = ref([
  { name: '在线翻译', icon: '🌐', hovered: false },
  { name: '计算器', icon: '🧮', hovered: false },
  { name: '单位转换', icon: '📏', hovered: false },
  { name: '密码生成', icon: '🔐', hovered: false },
  { name: '二维码生成', icon: '📱', hovered: false },
  { name: '文本处理', icon: '📝', hovered: false },
  { name: '图片压缩', icon: '🖼️', hovered: false },
  { name: '时区查询', icon: '⏰', hovered: false },
]);

// 快捷链接数据
const quickLinks = ref([
  {
    title: '环境',
    links: [{ label: "POC", url: "https://poc.hzero.jp/workplace" },
    { label: "113", url: "http://xhi-dev.hand-china.com/" },
    { label: "AWS", url: "https://gbgpoc.zenlead-global.com/workplace" },
    { label: "飞搭验证", url: "https://trial.saas.hand-china.com/portal/home" }]
  },
  {
    title: '业务文档',
    links: [
      { label: "值集一览", url: "https://u0vocx8xrmg.feishu.cn/sheets/WyPpsCJrHhaDy6tiqWfcE4Lmnjg?sheet=3xJUMY" },
      { label: "页面清单", url: "https://u0vocx8xrmg.feishu.cn/sheets/E6vjsEfhlhFC16ttAvXc0hOCnBX?sheet=2bRQjX" },
      { label: "Messages一览", url: "https://u0vocx8xrmg.feishu.cn/sheets/TbhAs92tPhuSK0tA3JkcLCRxnee?sheet=3xJUMY" },
      { label: "hfat多语言", url: "https://u0vocx8xrmg.feishu.cn/sheets/M743s3sdyhl4MFtyYThcmcFDnPh" },
    ]
  },
  {
    title: '技术文档',
    links: [
      { label: "Hzero指导手册", url: "https://open.hand-china.com/document-center/doc/product/10137/10227?lang=zh_CN&doc_id=32521&doc_code=32521" },
      { label: "飞搭", url: "https://open.hand-china.com/document-center/doc/product/10001/10945?doc_code=197304&lang=zh_CN&doc_id=525401" },
      { label: "猪齿鱼UI", url: "https://open-hand.github.io/choerodon-ui/zh/procmp/dataset/dataset-example" },
      { label: "Hzero数据权限介绍", url: "https://open.hand-china.com/community/detail/625872021372407808?#Hzero%E6%95%B0%E6%8D%AE%E6%9D%83%E9%99%90%E4%BB%8B%E7%BB%8D" }
    ]
  },
  {
    title: '其它',
    links: [
      { label: "发版清单", url: "#wechat" },
      { label: "Figma", url: "https://www.figma.com" },
      { label: "GitLab", url: "https://git.dx.hand-china.com" },
      { label: "2025需求排期计划", url: "https://u0vocx8xrmg.feishu.cn/sheets/QcJhsY50bheOkJtu4Ymcm4V9nEh" },
    ]
  },
]);
// 点击页面其他地方关闭下拉框
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-engine-selector')) {
      isEngineDropdownOpen.value = false;
    }
  });
});
// 切换搜索引擎下拉框
const toggleEngineDropdown = (visible) => {
  isEngineDropdownOpen.value = visible;
};

// 选择搜索引擎
const selectEngine = (engine) => {
  selectedEngine.value = engine;
  isEngineDropdownOpen.value = false;
};

// 处理搜索（跳转到对应搜索引擎）
const handleSearch = (value) => {
  if (!searchQuery.value.trim() && !value) return;
  const searchUrl = selectedEngine.value.url + encodeURIComponent(value || searchQuery.value.trim());
  window.open(searchUrl, '_blank');
};
// 处理工具悬停状态
const handleToolHover = (index, isHovered) => {
  tools.value[index].hovered = isHovered;
};

// 设置活跃导航项
const setActiveNav = (navItem) => {
  activeNav.value = navItem;
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// 处理移动端导航点击
const handleMobileNavClick = (navItem) => {
  setActiveNav(navItem);
  toggleMobileMenu();
};

// 切换深色模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark');
};

// 检测滚动状态
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    mobileMenuOpen.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  // 初始化检测
  checkScreenSize();
  // 监听滚动事件
  window.addEventListener('scroll', handleScroll);
  // 监听窗口大小变化
  window.addEventListener('resize', checkScreenSize);

  // 检查本地存储的主题设置
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme !== null) {
    isDarkMode.value = savedTheme === 'true';
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    }
  }
});

// 监听深色模式变化并保存到本地存储
watch(isDarkMode, (newValue) => {
  localStorage.setItem('darkMode', newValue);
});

// 点击链接跳转
const handleCategoryClick = (category) => {
  if (category.url) {
    window.open(category.url, '_blank');
  }
};
</script>

<style lang="less" scoped>
// 1. 基础变量定义（统一管理，便于全局修改）
@primary: #4F46E5;
@primary-light: #6366F1;
@primary-dark: #4338CA;
@secondary: #3B82F6;
@success: #10B981;
@warning: #F59E0B;
@danger: #EF4444;
@purple: #8B5CF6;
@pink: #EC4899;

// 浅色模式灰色系
@gray-100: #F3F4F6;
@gray-200: #E5E7EB;
@gray-300: #D1D5DB;
@gray-400: #9CA3AF;
@gray-500: #6B7280;
@gray-600: #4B5563;
@gray-700: #374151;
@gray-800: #1F2937;
@gray-900: #111827;

@white: #FFFFFF;
@black: #000000;

// 阴影变量
@shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
@shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
@shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
@shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

// 圆角变量
@radius-sm: 0.25rem;
@radius: 0.5rem;
@radius-lg: 0.75rem;
@radius-xl: 1rem;
@radius-full: 50%;

// 过渡变量
@transition: all 0.3s ease;

// 尺寸变量
@padd-sm: 0.5rem;
@padd: 1rem;
@padd-md: 1.5rem;
@padd-lg: 2rem;
@padd-xl: 3rem;

// 2. 深色模式变量覆盖（使用 Less 父选择器嵌套）
.dark {
  @gray-100: #1F2937;
  @gray-200: #374151;
  @gray-300: #4B5563;
  @gray-400: #6B7280;
  @gray-500: #9CA3AF;
  @gray-600: #D1D5DB;
  @gray-700: #E5E7EB;
  @gray-800: #F3F4F6;
  @gray-900: #F9FAFB;
  @white: #111827;
  @black: #FFFFFF;
}

.main-content {
  
}
// 3. 公共混合（Mixin）定义（提取重复样式）
// 弹性布局基础
.flex-base(@justify: center, @align: center, @gap: 0) {
  display: flex;
  justify-content: @justify;
  align-items: @align;
  gap: @gap;
}

// 网格布局基础
.grid-base(@columns: 1fr, @gap: @padd) {
  display: grid;
  grid-template-columns: @columns;
  gap: @gap;
}

// 卡片悬浮效果
.card-hover() {
  transition: @transition;

  &:hover {
    transform: translateY(-5px);
    box-shadow: @shadow-md;
  }
}

// 链接样式基础
.link-base(@color: @gray-700, @hover-color: @primary) {
  text-decoration: none;
  color: @color;
  transition: @transition;

  &:hover {
    color: @hover-color;
  }
}

// 4. 基础样式重置与全局样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.app-container {
  color: @gray-800;
  min-height: 100vh;
  transition: @transition;
  // background-image: url('@/assets/main.png');
  // background-size: 100%  65vh;
  // background-repeat: no-repeat;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 @padd;
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: @padd-md;
  color: @gray-900;
}

// 5. 导航栏样式（使用嵌套简化层级）
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: transparent;
  transition: @transition;
  padding: @padd 0;

  &.scrolled {
    background-color: @white;
    box-shadow: @shadow;
    padding: 0.75rem 0;
  }

  .navbar-content {
    .flex-base(space-between, center, @padd);

    .logo {
      .flex-base(center, center, 0.5rem);

      .logo-icon {
        font-size: 1.5rem;
      }

      .logo-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: @primary;
      }
    }

    .main-nav {
      flex: 1;
      max-width: 600px;
      margin: 0 @padd-md;

      .nav-list {
        .flex-base(center, center, @padd-md);
        list-style: none;

        .nav-item {
          a {
            .link-base(@gray-700, @primary);
            font-weight: 500;
            padding: 0.5rem 0;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0;
              height: 2px;
              background-color: @primary;
              border-radius: 1px;
              transition: @transition;
            }
          }

          &.active {
            a {
              color: @primary;

              &::after {
                width: 100%;
              }
            }
          }
        }
      }
    }

    .navbar-actions {
      .flex-base(center, center, @padd);

      .theme-toggle {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: @radius-full;
        .flex-base(center, center);
        transition: @transition;

        &:hover {
          background-color: @gray-200;
        }
      }

      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  }

  // 移动端菜单
  .mobile-menu {
    background-color: @white;
    box-shadow: @shadow-md;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 0;
    overflow: hidden;
    transition: @transition;

    &.open {
      max-height: 500px;
      padding: @padd 0;
    }

    .mobile-nav-list {
      list-style: none;
      padding: 0 @padd;

      .mobile-nav-item {
        margin-bottom: 0.5rem;

        a {
          display: block;
          padding: 0.75rem @padd;
          .link-base(@gray-700, @primary);
          border-radius: @radius;

          &:hover,
          &.active {
            background-color: @gray-200;
            color: @primary;
          }
        }

        &.active {
          a {
            background-color: @gray-200;
            color: @primary;
          }
        }
      }
    }
  }
}

// 6. 搜索区域样式
.search-section {
  padding: 8rem 0 4rem;
  text-align: center;

  .search-container {
    max-width: 800px;
    margin: 0 auto;

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: @gray-900;
      margin-bottom: @padd;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: @gray-600;
      margin-bottom: @padd-md;
    }

    .search-box {
      display: flex;
      max-width: 700px;
      margin: 0 auto 2rem;
      border-radius: 0;
      // overflow: hidden;
      box-shadow: @shadow-md;
      background-color: @white;
      border: 1px solid @primary;
      position: relative;

      .search-animation {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        z-index: 1;
      }

      // 搜索引擎选择器
      .search-engine-selector {
        position: relative;
        width: 5rem;
        border-right: 1px solid @gray-200;
        cursor: pointer;
        z-index: 10;

        // 选中的搜索引擎
        .selected-engine {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 100%;
          padding: 0 0.5rem;

          .engine-icon {
            font-size: 1.25rem;
            color: @gray-700;
          }

          .engine-arrow {
            font-size: 0.75rem;
            color: @gray-500;
            transition: @transition;
          }
        }

        // 下拉选项框
        .engine-dropdown {
          position: absolute;
          top: calc(100% + 2px);
          left: 0;
          width: 100%;
          background-color: @white;
          border: 1px solid @gray-200;
          border-top: none;
          border-radius: 0 0 @radius @radius;
          max-height: 0;
          overflow: hidden;
          transition: @transition;

          &.open {
            max-height: 200px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }

          .engine-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            transition: @transition;

            &:hover {
              background-color: @gray-100;
              color: @primary;
            }

            .engine-icon {
              font-size: 1.1rem;
            }

            .engine-name {
              font-size: 0.875rem;
              color: @gray-800;
            }
          }
        }

        //  hover效果
        &:hover {
          .selected-engine {
            .engine-arrow {
              transform: rotate(180deg);
            }
          }
        }
      }

      // 搜索输入框调整（增加左边距，适配选择器）
      .search-input {
        flex: 1;
        padding: 1.25rem 1.5rem;
        padding-left: 1rem; // 与选择器间距
        border: none;
        outline: none;
        font-size: 1rem;
        background-color: transparent;
        color: @gray-800;

        &::placeholder {
          color: @gray-400;
        }
      }

      // 搜索按钮样式不变
      .search-btn {
        padding: 0 1.5rem;
        background-color: @primary;
        color: white;
        border: none;
        cursor: pointer;
        transition: @transition;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: @primary-dark;
        }

        .icon-search {
          font-size: 1.25rem;
        }
      }
    }

    // 响应式调整（移动端适配）
    @media (max-width: 480px) {
      .search-box {
        .search-engine-selector {
          width: 4rem;

          .selected-engine {
            .engine-name {
              display: none; // 移动端隐藏文字，只显示图标
            }
          }
        }

        .search-input {
          padding: 1rem;
          padding-left: 0.5rem;
        }

        .search-btn {
          padding: 0 1rem;
        }
      }
    }


    .hot-tags {
      .flex-base(center, center, 0.75rem);
      flex-wrap: wrap;
      margin-top: @padd;

      .tag-title {
        color: @gray-600;
        font-size: 0.875rem;
      }

      .tag {
        .link-base(@gray-700, @primary);
        font-size: 0.875rem;
        padding: 0.375rem 0.75rem;
        border-radius: 999px;
        background-color: @gray-200;

        &:hover {
          background-color: @gray-300;
        }
      }
    }
  }
}

// 7. 分类导航区样式
.categories-section {
  padding: @padd-xl 0;
  border-radius: @radius-xl;
  margin: 0 @padd @padd-xl;

  .categories-grid {
    .grid-base(repeat(auto-fill, minmax(180px, 1fr)), @padd-md);

    .category-card {
      text-align: center;
      padding: @padd-md @padd;
      border-radius: @radius;
      background-color: @gray-100;
      cursor: pointer;
      .card-hover();

      .category-icon {
        width: 3rem;
        height: 3rem;
        border-radius: @radius-full;
        .flex-base(center, center);
        margin: 0 auto @padd;
        font-size: 1.5rem;
        color: @white;
      }

      .category-name {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: @gray-900;
      }

      .category-desc {
        font-size: 0.875rem;
        color: @gray-600;
      }
    }
  }
}

// 8. 热门推荐区样式
.featured-section {
  padding: @padd-xl 0;

  .section-header {
    .flex-base(space-between, center, 0);
    margin-bottom: @padd-md;

    .view-all {
      .link-base(@primary, @primary-dark);
      font-weight: 500;
      .flex-base(center, center, 0.25rem);
    }
  }

  .featured-grid {
    .grid-base(repeat(auto-fill, minmax(300px, 1fr)), @padd-lg);

    .featured-card {
      background-color: @white;
      border-radius: @radius-lg;
      overflow: hidden;
      box-shadow: @shadow;
      position: relative;
      .card-hover();

      .card-badge {
        position: absolute;
        top: @padd;
        right: @padd;
        background-color: @primary;
        color: @white;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: @radius-sm;
        font-weight: 600;
      }

      .card-image {
        img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
      }

      .card-content {
        padding: @padd-md;

        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: @gray-900;
        }

        .card-desc {
          font-size: 0.875rem;
          color: @gray-600;
          margin-bottom: @padd;
          line-height: 1.5;
        }

        .card-meta {
          .flex-base(space-between, center, 0);
          font-size: 0.75rem;
          color: @gray-500;
          margin-bottom: @padd;

          .card-category {
            background-color: @gray-200;
            padding: 0.25rem 0.5rem;
            border-radius: @radius-sm;
          }
        }
      }

      .card-link {
        .link-base(@primary, @primary-dark);
        display: inline-block;
        font-weight: 500;
        font-size: 0.875rem;
        margin-left: @padd-md;
        margin-bottom: @padd-md;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// 9. 常用工具区样式
.tools-section {
  padding: @padd-xl 0;
  margin: 0 @padd @padd-xl;

  .tools-grid {
    .grid-base(repeat(auto-fill, minmax(120px, 1fr)), @padd-md);

    .tool-item {
      .flex-base(center, center, 0);
      flex-direction: column;
      text-align: center;
      cursor: pointer;
      transition: @transition;
      padding: @padd;
      border-radius: @radius;

      &:hover {
        background-color: @gray-200;
      }

      .tool-icon {
        width: 3rem;
        height: 3rem;
        border-radius: @radius-full;
        background-color: @gray-200;
        .flex-base(center, center);
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
        transition: @transition;

        &.hovered {
          background-color: @primary;
          color: @white;
          transform: scale(1.1);
        }
      }

      .tool-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: @gray-800;
      }
    }
  }
}

// 10. 快捷链接区样式
.quick-links-section {
  padding: @padd-xl 0 @padd-lg;

  .quick-links-container {
    .grid-base(repeat(auto-fill, minmax(200px, 1fr)), @padd-lg);

    .links-column {
      .column-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: @padd;
        color: @gray-900;
        position: relative;
        padding-bottom: 0.5rem;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 2rem;
          height: 2px;
          background-color: @primary;
          border-radius: 1px;
        }
      }

      .links-list {
        list-style: none;

        .link-item {
          margin-bottom: 0.75rem;

          .link {
            .link-base(@gray-600, @primary);
            font-size: 0.875rem;

            &:hover {
              padding-left: 0.25rem;
            }
          }
        }
      }
    }
  }
}

// 11. 页脚样式
.footer {
  background-color: @gray-200;
  padding: @padd-lg 0 @padd;
  color: @gray-700;
  transition: @transition;

  .footer-content {
    .flex-base(flex-start, flex-start, @padd-lg);
    flex-wrap: wrap;
    margin-bottom: @padd-lg;

    .footer-brand {
      flex: 1;
      min-width: 250px;

      .logo {
        .flex-base(center, center, 0.5rem);

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: @primary;
        }
      }

      .brand-desc {
        margin: @padd 0;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .social-links {
        .flex-base(center, center, @padd);
        margin-top: @padd;

        .social-link {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: @radius-full;
          background-color: @gray-300;
          .flex-base(center, center);
          color: @gray-800;
          .link-base(@gray-800, @white);

          &:hover {
            background-color: @primary;
          }
        }
      }
    }

    .footer-links {
      flex: 2;
      .flex-base(flex-start, flex-start, @padd-lg);
      flex-wrap: wrap;

      .footer-links-column {
        flex: 1;
        min-width: 150px;

        .footer-links-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: @padd;
          color: @gray-900;
        }

        .footer-links-list {
          list-style: none;

          li {
            margin-bottom: 0.75rem;

            a {
              .link-base(@gray-700, @primary);
              font-size: 0.875rem;
            }
          }
        }
      }
    }
  }

  .footer-bottom {
    padding-top: @padd;
    border-top: 1px solid @gray-300;
    .flex-base(space-between, center, @padd);
    flex-wrap: wrap;
    font-size: 0.75rem;

    .footer-bottom-links {
      .flex-base(center, center, @padd-md);

      a {
        .link-base(@gray-700, @primary);
      }
    }
  }
}

// 12. 响应式样式（统一使用 Less 嵌套管理）
@media (max-width: 1024px) {
  .navbar {
    .navbar-content {
      .main-nav {
        margin: 0 @padd;

        .nav-list {
          gap: @padd-md;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    .navbar-content {
      .main-nav {
        display: none;
      }

      .mobile-menu-toggle {
        display: block;
      }
    }
  }

  .search-section {
    padding: 6rem 0 @padd-xl;

    .search-container {
      .section-title {
        font-size: 2rem;
      }
    }
  }

  .categories-section {
    .categories-grid {
      .grid-base(repeat(auto-fill, minmax(140px, 1fr)), @padd-md);
    }
  }

  .featured-section {
    .featured-grid {
      .grid-base(repeat(auto-fill, minmax(250px, 1fr)), @padd-lg);
    }
  }
}

@media (max-width: 480px) {
  .search-section {
    .search-container {
      .section-title {
        font-size: 1.75rem;
      }

      .search-box {
        .search-input {
          padding: @padd;
        }

        .search-btn {
          padding: 0 @padd;
        }
      }
    }
  }

  .categories-section {
    .categories-grid {
      .grid-base(repeat(2, 1fr), @padd-md);
    }
  }

  .tools-section {
    .tools-grid {
      .grid-base(repeat(3, 1fr), @padd-md);
    }
  }

  .footer {
    .footer-content {
      flex-direction: column;
      gap: @padd-lg;

      .footer-links {
        gap: @padd-lg;
      }
    }
  }
}
</style>

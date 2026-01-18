<template>
  <div class="release-notes">
    <!-- 页面标题 -->
    <header class="notes-header">
      <h1>产品更新日志</h1>
      <p>记录每一次迭代与优化</p>
    </header>

    <!-- 时间轴主体 -->
    <main class="timeline">
      <div v-for="(release, index) in releaseNotes" :key="release.id" class="timeline-item"
        :class="{ 'last-item': index === releaseNotes.length - 1 }">
        <!-- 时间轴节点 -->
        <div class="timeline-node">
          <div class="node-dot" :class="getVersionClass(release.version)"></div>
          <div class="node-line" :class="getVersionClass(release.version)"></div>
        </div>

        <!-- 版本内容 -->
        <div class="release-card">
          <!-- 版本信息（版本号 + 日期） -->
          <div class="release-meta">
            <span class="version" :class="getVersionClass(release.version)">v{{ release.version }}</span>
            <span class="date">{{ release.date }}</span>
          </div>

          <!-- 版本标题 -->
          <h3 class="release-title">{{ release.title }}</h3>

          <!-- 版本更新内容 -->
          <div class="release-changes">
            <div v-if="release.newFeatures.length" class="change-group">
              <h4 class="group-title">新增功能</h4>
              <ul class="change-list">
                <li v-for="(item, i) in release.newFeatures" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div v-if="release.improvements.length" class="change-group">
              <h4 class="group-title">优化改进</h4>
              <ul class="change-list">
                <li v-for="(item, i) in release.improvements" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div v-if="release.fixes.length" class="change-group">
              <h4 class="group-title">问题修复</h4>
              <ul class="change-list">
                <li v-for="(item, i) in release.fixes" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="notes-footer">
      <p>© 2025 产品名称. 持续迭代，优化体验</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 版本类型判断（用于样式区分）
const getVersionClass = (version) => {
  const parts = version.split('.').map(Number);
  if (parts[0] > 0) return 'major';  // 主版本更新
  if (parts[1] > 0) return 'minor';  // 次版本更新
  return 'patch';                    // 补丁更新
};

// 产品日志数据
const releaseNotes = ref([
  {
    id: 1,
    version: '0.0.1',
    date: '2025-11-08',
    title: '系统初始化',
    newFeatures: [
      '新增多语言【页面字段】页面',
      '新增日志页面',
      '新增首页',
    ],
    improvements: [],
    fixes: []
  },
  {
    id: 2,
    version: '0.0.2',
    date: '2025-11-09',
    title: '数据管理模块',
    newFeatures: [
      '新增项目维护页面',
      '新增模块维护页面',
    ],
    improvements: [
      '【页面字段】页面项目和模块字段动态化',
    ],
    fixes: [
      // '修复数据筛选时的缓存问题',
      // '解决部分图表样式显示异常'
    ]
  },
  {
    id: 3,
    version: '0.0.3',
    date: '2025-11-21',
    title: '快翻译',
    newFeatures: [
      '添加快翻译页面',
    ],
    improvements: [
    ],
    fixes: [
      // '修复数据筛选时的缓存问题',
      // '解决部分图表样式显示异常'
    ]
  }, {
    id: 4,
    version: '0.0.4',
    date: '2025-12-06',
    title: 'Hand账户、快翻译',
    newFeatures: [
    ],
    improvements: [
      "升级Hand账户为多账户登陆",
      "多语言模块兼容多账户模式"
    ],
    fixes: [
      '修复多语言只能翻译一行的BUG',
      // '解决部分图表样式显示异常'
    ]
  },
  // {
  //   id: 3,
  //   version: '3.1.0',
  //   date: '2025-09-30',
  //   title: '协作功能升级',
  //   newFeatures: [
  //     '新增团队协作空间',
  //     '添加实时在线编辑功能',
  //     '支持多人评论与批注'
  //   ],
  //   improvements: [
  //     '优化权限管理系统',
  //     '改进通知提醒机制'
  //   ],
  //   fixes: [
  //     '修复协作时偶尔出现的内容同步延迟',
  //     '解决部分场景下的权限校验错误'
  //   ]
  // },
  // {
  //   id: 4,
  //   version: '3.0.0',
  //   date: '2025-09-01',
  //   title: '全新界面设计与核心功能重构',
  //   newFeatures: [
  //     '全新UI设计，现代化视觉风格',
  //     '重构核心架构，提升系统稳定性',
  //     '新增智能助手功能',
  //     '支持暗色模式切换'
  //   ],
  //   improvements: [
  //     '全面优化用户操作流程',
  //     '提升系统响应速度',
  //     '增强跨平台兼容性'
  //   ],
  //   fixes: [
  //     '解决旧版本遗留的多项稳定性问题',
  //     '修复兼容性相关bug'
  //   ]
  // },
  // {
  //   id: 5,
  //   version: '2.5.3',
  //   date: '2025-08-12',
  //   title: '稳定性与安全性更新',
  //   newFeatures: [],
  //   improvements: [
  //     '增强系统安全性，修复潜在漏洞',
  //     '优化后台服务稳定性'
  //   ],
  //   fixes: [
  //     '修复登录超时后跳转异常问题',
  //     '解决文件上传时的大小限制bug',
  //     '修复部分页面刷新后状态丢失问题'
  //   ]
  // }
].reverse());
</script>

<style scoped>
/* 基础样式重置与全局设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.release-notes {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  color: #333647;
  background-color: #ffffff;
  min-height: 100vh;
}

/* 头部样式 */
.notes-header {
  text-align: center;
  margin-bottom: 4rem;
}

.notes-header h1 {
  font-size: 2.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.8rem;
  letter-spacing: -0.02em;
}

.notes-header p {
  font-size: 1.1rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

/* 时间轴样式 */
.timeline {
  position: relative;
  padding-left: 2.5rem;
}

/* 时间轴竖线 */
.timeline::before {
  content: '';
  position: absolute;
  left: 0.65rem;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e2e8f0;
}

/* 时间轴项 */
.timeline-item {
  position: relative;
  margin-bottom: 4rem;
  display: flex;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

/* 最后一项移除下划线 */
.timeline-item.last-item .node-line {
  display: none;
}

/* 渐入动画延迟 */
.timeline-item:nth-child(1) {
  animation-delay: 0.1s;
}

.timeline-item:nth-child(2) {
  animation-delay: 0.2s;
}

.timeline-item:nth-child(3) {
  animation-delay: 0.3s;
}

.timeline-item:nth-child(4) {
  animation-delay: 0.4s;
}

.timeline-item:nth-child(5) {
  animation-delay: 0.5s;
}

/* 时间轴节点 */
.timeline-node {
  position: absolute;
  left: -2.5rem;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-dot {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  z-index: 1;
  transition: all 0.3s ease;
}

.node-line {
  width: 1px;
  flex: 1;
  transition: all 0.3s ease;
}

/* 版本类型颜色区分 */
.major .node-dot,
.major .node-line {
  background-color: #6366f1;
}

.minor .node-dot,
.minor .node-line {
  background-color: #10b981;
}

.patch .node-dot,
.patch .node-line {
  background-color: #3b82f6;
}

/* 版本卡片 */
.release-card {
  flex: 1;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 1.8rem;
  transition: all 0.3s ease;
}

/* 卡片悬停效果 */
.timeline-item:hover .release-card {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  border: 1px solid #f0f4f8;
}

/* 版本元信息（版本号+日期） */
.release-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.version {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* 版本号颜色区分 */
.major.version {
  background-color: #ede9fe;
  color: #6366f1;
}

.minor.version {
  background-color: #d1fae5;
  color: #059669;
}

.patch.version {
  background-color: #dbeafe;
  color: #2563eb;
}

.date {
  font-size: 0.85rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.date::before {
  content: '•';
  font-size: 1.2rem;
  line-height: 1;
  color: #cbd5e1;
}

/* 版本标题 */
.release-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

/* 更新内容区域 */
.release-changes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 变更组标题 */
.group-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-title::before {
  content: '';
  width: 4px;
  height: 16px;
  border-radius: 2px;
}

/* 变更组标题颜色区分 */
.change-group:nth-child(1) .group-title::before {
  background-color: #6366f1;
}

.change-group:nth-child(2) .group-title::before {
  background-color: #10b981;
}

.change-group:nth-child(3) .group-title::before {
  background-color: #3b82f6;
}

/* 变更列表 */
.change-list {
  padding-left: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.change-list li {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
  position: relative;
}

.change-list li::marker {
  color: #a0aec0;
  font-size: 0.7rem;
}

/* 页脚样式 */
.notes-footer {
  text-align: center;
  margin-top: 6rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f4f8;
  color: #718096;
  font-size: 0.9rem;
}

/* 渐入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .release-notes {
    padding: 2rem 1rem;
  }

  .notes-header h1 {
    font-size: 1.8rem;
  }

  .timeline {
    padding-left: 2rem;
  }

  .timeline::before {
    left: 0.55rem;
  }

  .timeline-node {
    left: -2rem;
  }

  .release-card {
    padding: 1.5rem;
  }

  .release-title {
    font-size: 1.2rem;
  }

  .timeline-item {
    margin-bottom: 3rem;
  }
}

@media (max-width: 480px) {
  .release-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .date::before {
    display: none;
  }

  .change-list {
    padding-left: 1.2rem;
  }

  .change-list li {
    font-size: 0.9rem;
  }
}
</style>
<template>
  <div class="translation-container">
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 页面标题 -->
      <header class="page-header">
        <h1 class="page-title">
          <t-icon name="translate" class="translate-icon" />
          多语言翻译工具
        </h1>
        <typer class="page-desc" :speed="100" text='输入文本，一键获取英文、日文、繁体中文、中文等翻译结果' show-cursor></typer>
      </header>
      <p class="page-alert">
        <span>Powered by
          <a href="https://fanyi.baidu.com/" target="_blank">Baidu Translate</a>
        </span>,
        Recommend using
        <a href="https://translate.google.com/?sl=auto&tl=zh-CN&op=translate" target="_blank">Google Translate </a>
        for long texts
      </p>
      <!-- 操作区：输入框 + 翻译按钮 + 历史记录按钮 -->
      <section class="operation-section">
        <textarea v-model="sourceText" class="source-input" placeholder="请输入需要翻译的文本...（自动识别语种）"
          :disabled="isTranslating" @input="handleInput"></textarea>
        <div class="btn-group">
          <!-- 复选框框组受控模式 -->
          <t-checkbox-group :value="checkedLangs" :options="langList" :on-change="onChangeCheckedLangs" />
          <t-button theme="secondary" :disabled="!sourceText.trim() || isTranslating" @click="handleClear">
            <template #icon>
              <t-icon name="clear" class="clear-icon" />
            </template>
          </t-button>
          <t-button theme="secondary" :disabled="isTranslating" @click="toggleHistory">
            <template #icon>
              <t-icon name="history" class="history-icon" />
            </template>
          </t-button>
          <t-button :loading="isTranslating" :disabled="!sourceText.trim() || isTranslating || !checkedLangs.length"
            @click="handleTranslate">
            <template #icon>
              <t-icon name="translate" class="translate-icon" />
            </template>
            一键翻译
          </t-button>
        </div>
      </section>

      <!-- 翻译结果区域 -->
      <section class="result-section" v-if="translationResults.length">
        <div class="result-card" v-for="(result, index) in translationResults" :key="index">
          <div class="result-header">
            <h3 class="result-title">{{ result.language }}</h3>
            <t-icon name="copy" class="copy-icon" :class="{ copied: result.copied }"
              @click="handleCopy(result.text, index)" :title="result.copied ? '已复制' : '复制文本'" />
          </div>
          <div class="result-content">
            <p class="result-text">{{ result.text }}</p>
          </div>
        </div>
      </section>

      <!-- 空状态提示 -->
      <section class="empty-state" v-else-if="!isTranslating && sourceText.trim()">
        <t-icon name="translate" size="48" class="empty-icon" />
        <p class="empty-text">点击"一键翻译"获取结果</p>
      </section>
    </main>

    <!-- 右侧历史记录侧边栏 -->
    <aside class="history-sidebar" :class="{ active: isHistoryOpen }">
      <div class="history-header">
        <h3 class="history-title">翻译历史</h3>
        <button class="close-history-btn" @click="toggleHistory">
          <t-icon name="close" />
        </button>
      </div>

      <div class="history-content">
        <!-- 历史记录列表 -->
        <div class="history-list" v-if="historyList.length">
          <div class="history-item" v-for="(item, index) in historyList" :key="index" @click="selectHistoryItem(item)">
            <div class="history-source">
              <span class="history-label">原文：</span>
              <span class="history-content">{{ item.source }}</span>
            </div>
            <div class="history-time">{{ formatTime(item.timestamp) }}</div>
          </div>
        </div>

        <!-- 无历史记录提示 -->
        <div class="empty-history" v-else>
          <t-icon name="file-empty" size="32" class="empty-history-icon" />
          <p class="empty-history-text">暂无翻译历史记录</p>
        </div>
      </div>

      <div class="history-footer">
        <button class="clear-history-btn" @click="clearHistory">清空历史</button>
      </div>
    </aside>

    <!-- 遮罩层（移动端） -->
    <div class="history-overlay" :class="{ active: isHistoryOpen }" @click="toggleHistory" v-if="isMobile"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Loading, Icon } from 'tdesign-vue-next';
import { getTranslate } from '@/services/translate';
import { Typer } from "vue3-text-typer";
// 引入TDesign图标
const TIcon = Icon;
const TLoading = Loading;

// 状态管理
const sourceText = ref(''); // 输入文本
const isTranslating = ref(false); // 翻译加载状态
const translationResults = ref([]); // 翻译结果
const isHistoryOpen = ref(false); // 历史记录展开状态
const historyList = ref([]); // 历史记录列表（从localStorage读取）
const isMobile = ref(false); // 是否为移动端
const checkedLangs = ref(localStorage.getItem('checkedLangs') ? JSON.parse(localStorage.getItem('checkedLangs')) : ['en', 'jp', 'cht', 'zh']); // 复选框框组受控模式选中值
const langList = ref([
  { label: '全选', checkAll: true }, {
    label: '英文',
    value: 'en',
    checked: true
  }, {
    label: '日文',
    value: 'jp',
    checked: true
  }, {
    label: '繁体中文',
    value: 'cht',
    checked: true
  }, {
    label: '泰语',
    value: 'th',
    checked: true
  }, {
    label: '简体中文',
    value: 'zh',
    checked: true
  }])

// 检测设备类型
const checkDeviceType = () => {
  isMobile.value = window.innerWidth < 768;
};

// 初始化
onMounted(() => {
  // 加载历史记录
  const savedHistory = localStorage.getItem('translationHistory');
  if (savedHistory) {
    historyList.value = JSON.parse(savedHistory);
  }

  // 检测设备类型
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
});

// 监听窗口大小变化
watch(isMobile, (newVal) => {
  if (newVal && isHistoryOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// 处理输入（清空复制状态）
const handleInput = () => {
  if (translationResults.value.length) {
    translationResults.value = translationResults.value.map(item => ({ ...item, copied: false }));
  }
};

// 清空数据
const handleClear = () => {
  sourceText.value = '';
  translationResults.value = [];
}

// 处理翻译（新增历史记录存储）
const handleTranslate = async () => {
  const text = sourceText.value.trim();
  if (!text) return;

  // 显示加载状态
  isTranslating.value = true;
  translationResults.value = [];
  // 循环语言列表
  for (let i = 0; i < checkedLangs.value.length; i++) {
    const currentLang = checkedLangs.value[i];
    let res = await getTranslate({
      q: text,
      from: 'auto',
      to: currentLang
    })
    if (res.status === "success") {
      translationResults.value.push({
        language: langList.value.find(item => item.value === currentLang)?.label || currentLang,
        text: res.data.trans_result[0].dst,
        copied: false
      });
    }
  }

  // 生成历史记录项
  const historyItem = {
    source: text,
    results: translationResults.value,
    timestamp: Date.now()
  };
  // 添加到历史列表并存储到localStorage
  historyList.value.unshift(historyItem); // 最新记录排在前面
  saveHistoryToLocalStorage();

  isTranslating.value = false;

}

// 复选框框组受控模式选中值改变时触发
const onChangeCheckedLangs = (val) => {
  checkedLangs.value = val;
  localStorage.setItem('checkedLangs', JSON.stringify(val));
}

// 处理复制
const handleCopy = (text, index) => {
  // 复制到剪贴板
  navigator.clipboard.writeText(text).then(() => {
    // 更新复制状态
    const updatedResults = [...translationResults.value];
    updatedResults[index].copied = true;
    translationResults.value = updatedResults;

    // 2秒后重置复制状态
    setTimeout(() => {
      const resetResults = [...translationResults.value];
      resetResults[index].copied = false;
      translationResults.value = resetResults;
    }, 2000);
  });
};

// 切换历史记录展开/收起
const toggleHistory = () => {
  isHistoryOpen.value = !isHistoryOpen.value;

  // 移动端处理滚动
  if (isMobile.value) {
    document.body.style.overflow = isHistoryOpen.value ? 'hidden' : '';
  }
};

// 保存历史记录到localStorage
const saveHistoryToLocalStorage = () => {
  localStorage.setItem('translationHistory', JSON.stringify(historyList.value));
};

// 格式化时间显示
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

// 选择历史记录项（回显到页面）
const selectHistoryItem = (item) => {
  sourceText.value = item.source;
  translationResults.value = item.results.map(res => ({ ...res, copied: false })); // 重置复制状态
  isHistoryOpen.value = false; // 自动收起历史记录

  // 移动端恢复滚动
  if (isMobile.value) {
    document.body.style.overflow = '';
  }
};

// 清空历史记录
const clearHistory = () => {
  historyList.value = [];
  localStorage.removeItem('translationHistory');
};
</script>

<style lang="less" scoped>
.translation-container {
  display: flex;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  max-width: calc(100% - 360px);
  margin: 0 auto;
  padding: 40px 20px;
  color: #333;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 20px 16px;
  }
}

.page-header {
  text-align: center;
  margin-bottom: 16px;

  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: var(--td-brand-color);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .page-desc {
    font-size: 16px;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    margin-bottom: 30px;

    .page-title {
      font-size: 24px;
    }
  }
}

.page-alert {
  font-size: 12px;
  color: #737373;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;

  a {
    color: var(--td-brand-color);
    text-decoration: none;
    font-weight: 600;
  }
}

.operation-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;

  .source-input {
    height: 160px;
    padding: 16px;
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    font-size: 16px;
    resize: none;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--td-brand-color);
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #999;
    }

    @media (max-width: 768px) {
      height: 120px;
      font-size: 14px;
    }
  }

  .btn-group {
    display: flex;
    gap: 16px;
    align-self: flex-end;

    .translate-btn {
      padding: 12px 24px;
      background-color: var(--td-brand-color);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;

      &:hover {
        background-color: var(--td-brand-color-hover);
      }

      &:disabled {
        background-color: var(--td-brand-color-disabled);
        cursor: not-allowed;
      }
    }

    .history-btn {
      padding: 12px 24px;
      background-color: white;
      color: var(--td-brand-color);
      border: 1px solid var(--td-brand-color);
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;

      &:hover {
        background-color: #f0f7ff;
      }

      &:disabled {
        color: var(--td-brand-color-disabled);
        border-color: var(--td-brand-color-disabled);
        cursor: not-allowed;
        background-color: white;
      }

      .history-icon {
        font-size: 18px;
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-self: stretch;
      gap: 12px;

      .translate-btn,
      .history-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

/* 翻译结果区域 */
.result-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.result-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0a9;

    .result-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--td-brand-color);
      margin: 0;
    }

    .copy-icon {
      font-size: 16px;
      color: #999;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: var(--td-brand-color);
      }

      &.copied {
        color: #52c41a;
      }
    }
  }

  .result-content {
    .result-text {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      word-break: break-all;
      margin: 0;
      min-height: 80px;
      display: flex;
      align-items: flex-start;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;

    .result-title {
      font-size: 16px;
    }

    .result-text {
      font-size: 14px;
    }
  }
}

/* 空状态提示 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #999;

  .empty-icon {
    color: #d9d9d9;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    padding: 60px 0;

    .empty-text {
      font-size: 16px;
    }
  }
}

/* 右侧历史记录侧边栏 */
.history-sidebar {
  width: 360px;
  background-color: white;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;

  &.active {
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
  }

  .history-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;

    .history-title {
      font-size: 18px;
      font-weight: 600;
      color: #3f3f3f;
      margin: 0;
    }

    .close-history-btn {
      background: transparent;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 20px;
      transition: color 0.3s ease;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .history-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .history-item {
      padding: 12px;
      border-radius: 8px;
      background-color: #f8f9fa;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f0f7ff;
        border-left: 3px solid #1890ff;
      }

      .history-source {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;

        .history-label {
          font-weight: 500;
          color: #666;
          margin-right: 8px;
          flex-shrink: 0;
          font-size: 14px;
        }

        .history-content {
          flex: 1;
          color: #333;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }
      }

      .history-time {
        font-size: 12px;
        color: #999;
        text-align: right;
      }
    }

    .empty-history {
      text-align: center;
      padding: 60px 20px;
      color: #999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;

      .empty-history-icon {
        color: #d9d9d9;
        margin-bottom: 12px;
      }

      .empty-history-text {
        font-size: 16px;
        margin: 0;
      }
    }
  }

  .history-footer {
    padding: 20px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    position: sticky;
    bottom: 0;
    background-color: white;

    .clear-history-btn {
      color: #ff4d4f;
      background: transparent;
      border: none;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;
      padding: 8px 16px;

      &:hover {
        color: #d9363e;
        background-color: #fff5f5;
        border-radius: 4px;
      }
    }
  }
}

/* 移动端遮罩层 */
.history-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.active {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
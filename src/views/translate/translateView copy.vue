<template>
  <div class="translation-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">多语言翻译工具</h1>
      <p class="page-desc">输入文本，一键获取英文、日文、繁体中文（HK/TW）翻译结果</p>
    </header>

    <!-- 输入区域 -->
    <section class="input-section">
      <textarea
        v-model="sourceText"
        class="source-input"
        placeholder="请输入需要翻译的文本..."
        :disabled="isTranslating"
        @input="handleInput"
      ></textarea>
      <button
        class="translate-btn"
        :disabled="!sourceText.trim() || isTranslating"
        @click="handleTranslate"
      >
        <t-loading v-if="isTranslating" size="small" />
        <span v-else>一键翻译</span>
      </button>
    </section>

    <!-- 翻译结果区域 -->
    <section class="result-section" v-if="translationResults.length">
      <div class="result-card" v-for="(result, index) in translationResults" :key="index">
        <div class="result-header">
          <h3 class="result-title">{{ result.language }}</h3>
          <t-icon
            name="copy"
            class="copy-icon"
            :class="{ copied: result.copied }"
            @click="handleCopy(result.text, index)"
            :title="result.copied ? '已复制' : '复制文本'"
          />
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Loading, Icon } from 'tdesign-vue-next';

// 引入TDesign图标
const TIcon = Icon;
const TLoading = Loading;

// 状态管理
const sourceText = ref(''); // 输入文本
const isTranslating = ref(false); // 翻译加载状态
const translationResults = ref([]); // 翻译结果

// 模拟翻译数据（实际项目中替换为真实接口请求）
const mockTranslation = (text) => {
  return [
    {
      language: '英文翻译',
      text: `Translated to English: ${text} (This is a simulated translation result)`,
      copied: false
    },
    {
      language: '日文翻译',
      text: `日本語訳：${text}（これは模擬翻訳結果です）`,
      copied: false
    },
    {
      language: '繁体中文（HK）',
      text: `繁體中文（香港）翻譯：${text}（這是模擬翻譯結果）`,
      copied: false
    },
    {
      language: '繁体中文（TW）',
      text: `繁體中文（台灣）翻譯：${text}（這是模擬翻譯結果）`,
      copied: false
    }
  ];
};

// 处理输入（清空复制状态）
const handleInput = () => {
  if (translationResults.value.length) {
    translationResults.value = translationResults.value.map(item => ({ ...item, copied: false }));
  }
};

// 处理翻译
const handleTranslate = () => {
  if (!sourceText.value.trim()) return;

  // 显示加载状态
  isTranslating.value = true;
  translationResults.value = [];

  // 模拟接口请求延迟
  setTimeout(() => {
    translationResults.value = mockTranslation(sourceText.value.trim());
    isTranslating.value = false;
  }, 1500);
};

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
</script>

<style lang="less" scoped>
.translation-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;

  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: #1890ff;
    margin-bottom: 12px;
  }

  .page-desc {
    font-size: 16px;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;

  .source-input {
    width: 100%;
    height: 160px;
    padding: 16px;
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    font-size: 16px;
    resize: none;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #999;
    }
  }

  .translate-btn {
    align-self: flex-end;
    padding: 12px 24px;
    background-color: #1890ff;
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
      background-color: #096dd9;
    }

    &:disabled {
      background-color: #8cc5ff;
      cursor: not-allowed;
    }
  }
}

.result-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
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
    border-bottom: 1px solid #f0f0f0;

    .result-title {
      font-size: 18px;
      font-weight: 600;
      color: #1890ff;
    }

    .copy-icon {
      font-size: 20px;
      color: #999;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #1890ff;
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
}

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
}

/* 响应式设计 */
@media (max-width: 768px) {
  .translation-page {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 24px !important;
  }

  .input-section {
    margin-bottom: 30px;
  }

  .source-input {
    height: 120px !important;
    font-size: 14px !important;
  }

  .translate-btn {
    align-self: center;
    width: 100%;
  }

  .result-section {
    grid-template-columns: 1fr;
  }

  .result-title {
    font-size: 16px !important;
  }

  .result-text {
    font-size: 14px !important;
  }
}
</style>
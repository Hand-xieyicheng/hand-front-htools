<template>
  <div class="tree-operation-container">
    <h3 class="component-title">多语言值集配置</h3>
    <div class="tree-wrapper">
      <!-- 一级节点：值集编码 -->
      <div class="tree-node level-1">
        <t-input
          v-model="valueSetCode"
          placeholder="请输入值集编码"
          class="code-input"
          :disabled="isDisabled"
        />
        <t-button
          type="primary"
          @click="addChildNode"
          icon="add"
          class="add-btn"
          :disabled="!valueSetCode.trim()"
        >
          新增节点
        </t-button>
      </div>

      <!-- 子节点列表 -->
      <div class="child-nodes">
        <div
          v-for="(node, index) in childNodes"
          :key="index"
          class="tree-node level-2"
        >
          <!-- 节点操作区 -->
          <div class="node-actions">
            <t-icon
              name="drag"
              class="drag-icon"
              cursor="move"
              title="拖动排序"
            />
            <t-icon
              name="delete"
              class="delete-icon"
              cursor="pointer"
              title="删除节点"
              @click="removeChildNode(index)"
            />
          </div>

          <!-- 二级节点输入框组 -->
          <div class="input-group level-2-inputs">
            <t-input
              v-model="node.name"
              placeholder="请输入名称"
              class="node-input name-input"
              :disabled="isDisabled"
            />
            <t-input
              v-model="node.value"
              placeholder="请输入值"
              class="node-input value-input"
              :disabled="isDisabled"
            />
            <t-input
              v-model="node.sort"
              placeholder="排序号"
              class="node-input sort-input"
              type="number"
              :disabled="isDisabled"
            />
          </div>

          <!-- 固定三级节点（多语言类型） -->
          <div class="level-3-nodes">
            <div class="level-3-title">多语言配置：</div>
            <div class="language-nodes">
              <div
                v-for="(lang, langIndex) in languageTypes"
                :key="langIndex"
                class="language-node"
              >
                <t-input
                  :value="lang.name"
                  readonly
                  class="lang-name"
                />
                <t-input
                  v-model="node.languages[langIndex].value"
                  placeholder="请输入对应语言值"
                  class="lang-value"
                  :disabled="isDisabled"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div
          v-if="childNodes.length === 0"
          class="empty-state"
        >
          <t-icon name="empty" class="empty-icon" />
          <p class="empty-text">暂无节点，请点击"新增节点"添加</p>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="action-buttons">
      <t-button
        type="default"
        @click="resetForm"
      >
        重置
      </t-button>
      <t-button
        type="primary"
        @click="submitForm"
        :disabled="!valueSetCode.trim() || childNodes.length === 0"
      >
        提交
      </t-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

// 固定的多语言类型
const languageTypes = ref([
  { name: '中文' },
  { name: '英文' },
  { name: '日文' },
  { name: '繁体中文香港' },
  { name: '繁体中文台湾' },
]);

// 值集编码
const valueSetCode = ref('');

// 子节点列表
const childNodes = ref([]);

// 是否禁用（可根据实际需求控制）
const isDisabled = ref(false);

// 新增子节点
const addChildNode = () => {
  // 初始化多语言值为空
  const initLanguages = languageTypes.value.map(() => ({ value: '' }));
  
  childNodes.value.push({
    name: '',
    value: '',
    sort: childNodes.value.length + 1, // 默认排序号为节点索引+1
    languages: initLanguages,
  });
  
  MessagePlugin.success('节点新增成功');
};

// 删除子节点
const removeChildNode = (index) => {
  childNodes.value.splice(index, 1);
  
  // 重新排序
  childNodes.value.forEach((node, i) => {
    node.sort = i + 1;
  });
  
  MessagePlugin.success('节点删除成功');
};

// 重置表单
const resetForm = () => {
  valueSetCode.value = '';
  childNodes.value = [];
  MessagePlugin.info('表单已重置');
};

// 提交表单
const submitForm = () => {
  // 表单验证
  const hasInvalidNode = childNodes.value.some(node => {
    return !node.name.trim() || !node.value.trim() || !node.sort;
  });
  
  if (hasInvalidNode) {
    MessagePlugin.error('请完善所有节点的名称、值和排序号');
    return;
  }
  
  // 验证多语言值（可选，根据实际需求决定是否必填）
  const hasEmptyLangValue = childNodes.value.some(node => {
    return node.languages.some(lang => !lang.value.trim());
  });
  
  if (hasEmptyLangValue) {
    MessagePlugin.warning('部分多语言值为空，是否继续提交？', {
      type: 'confirm',
      onConfirm: () => handleSubmit(),
    });
  } else {
    handleSubmit();
  }
};

// 处理提交逻辑
const handleSubmit = () => {
  const submitData = {
    valueSetCode: valueSetCode.value.trim(),
    nodes: childNodes.value.map(node => ({
      name: node.name.trim(),
      value: node.value.trim(),
      sort: Number(node.sort),
      languages: node.languages.map((lang, index) => ({
        type: languageTypes.value[index].name,
        value: lang.value.trim(),
      })),
    })),
  };
  
  // 模拟接口提交
  console.log('提交数据：', submitData);
  MessagePlugin.success('表单提交成功');
  
  // 提交后可选择重置表单
  // resetForm();
};
</script>

<style scoped lang="less">
.tree-operation-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .component-title {
    margin: 0 0 24px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
    border-bottom: 1px solid #f2f3f5;
    padding-bottom: 12px;
  }

  .tree-wrapper {
    margin-bottom: 24px;
  }

  .tree-node {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f7f8fa;
    }

    &.level-1 {
      justify-content: space-between;
    }

    &.level-2 {
      flex-direction: column;
      align-items: flex-start;
      padding: 16px;
      background-color: #fafafa;
      border: 1px solid #ebeef5;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .code-input {
    width: calc(100% - 120px);
  }

  .add-btn {
    width: 110px;
  }

  .node-actions {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    width: 100%;
    justify-content: flex-end;

    .drag-icon,
    .delete-icon {
      font-size: 16px;
      margin-left: 16px;
      transition: color 0.2s;
    }

    .drag-icon {
      color: #c0c4cc;
      cursor: move;
    }

    .delete-icon {
      color: #ff4d4f;

      &:hover {
        color: #ff7875;
      }
    }
  }

  .input-group {
    display: flex;
    width: 100%;
    gap: 16px;
    margin-bottom: 16px;
  }

  .node-input {
    flex: 1;

    &.name-input {
      flex: 2;
    }

    &.value-input {
      flex: 2;
    }

    &.sort-input {
      width: 100px;
      flex: none;
    }
  }

  .level-3-nodes {
    width: 100%;
    margin-top: 12px;

    .level-3-title {
      font-size: 14px;
      font-weight: 500;
      color: #4e5969;
      margin-bottom: 12px;
    }

    .language-nodes {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      width: 100%;
    }

    .language-node {
      display: flex;
      align-items: center;
      width: calc(50% - 6px);
      gap: 8px;

      .lang-name {
        width: 120px;
        background-color: #f2f3f5;
        color: #86909c;
        cursor: not-allowed;
      }

      .lang-value {
        flex: 1;
      }
    }
  }

  .child-nodes {
    margin-left: 32px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
    color: #c0c4cc;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 14px;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    t-button {
      min-width: 100px;
    }
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .tree-node.level-1 {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .code-input {
      width: 100%;
    }

    .add-btn {
      width: 100%;
    }

    .input-group {
      flex-direction: column;
      gap: 8px;
    }

    .node-input {
      width: 100%;
    }

    .language-nodes {
      flex-direction: column;
    }

    .language-node {
      width: 100%;
    }

    .action-buttons {
      flex-direction: column;
    }

    t-button {
      width: 100%;
    }
  }
}
</style>
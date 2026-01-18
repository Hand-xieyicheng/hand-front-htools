<template>
  <div class="response-message-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">返回消息</h1>
      </div>
      <div>
        <div class="env-select">
          <t-select v-model="env" @change="handleEnvChange" :options="handAuthStoreNew.envOptions" placeholder="请选择环境"
            clearable></t-select>
        </div>
        <t-button theme="primary" @click="handleAdd">
          <template #icon><add-icon /></template>
          添加返回消息
        </t-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <t-row :gutter="20" justify="space-between">
        <t-col :span="4">
          <t-input v-model="searchKeyword" placeholder="搜索消息代码或描述" clearable @clear="handleClearSearch"
            @keyup="handleSearch">
            <template #prefix-icon>
              <search-icon />
            </template>
          </t-input>
        </t-col>
        <t-col :span="2">
          <t-select v-model="selectedType" placeholder="按类型筛选" clearable @change="handleTypeFilter">
            <t-option value="" label="全部类型" />
            <t-option value="info" label="info" />
            <t-option value="warn" label="warn" />
            <t-option value="error" label="error" />
          </t-select>
        </t-col>
        <t-col :span="2">
          <t-select v-model="selectedLang" placeholder="按语言筛选" clearable @change="handleLangFilter">
            <t-option value="" label="全部语言" />
            <t-option value="zh_CN" label="中文" />
            <t-option value="en_US" label="英文" />
            <t-option value="ja_JP" label="日文" />
            <t-option value="cht_CN" label="繁体中文香港" />
            <t-option value="zh_TW" label="繁体中文台湾" />
          </t-select>
        </t-col>
        <t-col :span="2" align="right">
          <t-button variant="text" @click="handleRefresh">
            <template #icon><refresh-icon /></template>
          </t-button>
        </t-col>
      </t-row>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <t-table stripe stripe-color="blue" :data="messageStore.messageList" :loading="messageStore.loading"
        :columns="columns" row-key="id">
        <template #operations="{ row }">
          <t-space>
            <t-button variant="outline" shape="circle" theme="primary" @click="handleEdit(row.id)">
              <template #icon> <edit-icon /></template>
            </t-button>
            <t-button variant="outline" shape="circle" theme="danger" @click="handleDelete(row)">
              <template #icon> <delete-icon /></template>
            </t-button>
          </t-space>
        </template>
        <template #empty>
          <div class="empty-state">
            <t-icon name="document" size="64" />
            <p style="color: #929292;">暂无返回消息数据</p>
            <t-button size="large" variant="dashed" shape="round" theme="primary" @click="handleAdd">添加返回消息</t-button>
          </div>
        </template>
      </t-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <div style="height: 64px;"></div>
      <div class="pagination-section">
        <t-pagination :total="messageStore.pagination.total" :page-size="messageStore.pagination.pageSize"
          :current="messageStore.pagination.page" :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" @change="handlePageChange" />
      </div>
    </div>

    <!-- 新增/编辑抽屉 -->
    <t-drawer :closeOnEscKeydown="false" :closeOnOverlayClick="false" @confirm="handleFormSubmit"
      @cancel="handleDrawerClose" :header="drawerTitle" :visible="messageStore.drawerVisible" size="600px"
      placement="right" @close="handleDrawerClose">
      <t-form :data="formData" :rules="formRules" ref="formRMRef" label-align="top">
        <t-form-item label="消息代码" name="code">
          <t-input size="large" v-model="formData.code" placeholder="请输入消息代码" />
        </t-form-item>
        <t-form-item label="消息类型" name="type">
          <t-select v-model="formData.type" placeholder="请选择消息类型" clearable>
            <t-option value="info" label="info" />
            <t-option value="warn" label="warn" />
            <t-option value="error" label="error" />
          </t-select>
        </t-form-item>
        <t-form-item label="消息描述(中文)" name="zh_CN">
          <t-input v-model="formData.zh_CN" placeholder="请输入中文描述" />
          <template #statusIcon>
            <div style="width: 100px; display: flex; justify-content: center">
              <t-button style="width: 100px" :disabled="!formData.zh_CN" variant="outline" theme="primary"
                @click="handleTranslate">生成以下翻译</t-button>
            </div>
          </template>
        </t-form-item>
        <t-form-item label="消息描述(英文)" name="en_US">
          <t-input v-model="formData.en_US" placeholder="请输入英文描述" />
        </t-form-item>
        <t-form-item label="消息描述(日文)" name="ja_JP">
          <t-input v-model="formData.ja_JP" placeholder="请输入日文描述" />
        </t-form-item>
        <t-form-item label="消息描述(繁体中文香港)" name="cht_CN">
          <t-input v-model="formData.cht_CN" placeholder="请输入繁体中文香港描述" />
        </t-form-item>
        <t-form-item label="消息描述(繁体中文台湾)" name="zh_TW">
          <t-input v-model="formData.zh_TW" placeholder="请输入繁体中文台湾描述" />
        </t-form-item>
      </t-form>
    </t-drawer>

    <!-- 详情弹窗 -->
    <t-dialog :visible="detailDialogVisible" title="返回消息详情" :width="500" @close="handleDetailDialogClose">
      <div class="detail-content">
        <div class="detail-item">
          <span class="detail-label">消息代码：</span>
          <span class="detail-value">{{ messageStore.messageDetail?.code || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">消息类型：</span>
          <span class="detail-value">{{ messageStore.messageDetail?.typeMeaning || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">语言：</span>
          <span class="detail-value">{{ messageStore.messageDetail?.langMeaning || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">消息描述：</span>
          <span class="detail-value">{{ messageStore.messageDetail?.description || '-' }}</span>
        </div>
      </div>
    </t-dialog>

    <!-- 删除确认对话框 -->
    <t-dialog :visible="deleteDialogVisible" title="确认删除" :width="400" @close="handleDeleteDialogClose">
      <template #header>
        <div class="delete-dialog-title">
          <span>删除提示</span>
        </div>
      </template>
      <div class="delete-dialog-content">
        <p class="delete-warning">确认删除返回消息「{{ selectedMessageCode }}」? 此操作不可撤销，删除后数据将无法恢复。</p>
      </div>
      <template #footer>
        <div class="delete-dialog-footer">
          <t-button size="large" shape="round" theme="default" @click="handleDeleteDialogClose">取消</t-button>
          <t-button size="large" shape="round" theme="danger" @click="confirmDelete">确定删除</t-button>
        </div>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useMessageStore } from '@/stores/responseMessage';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, RefreshIcon, ArticleIcon } from 'tdesign-icons-vue-next';
import moment from 'moment';
import { MessagePlugin } from 'tdesign-vue-next';
import { useInfoStore } from '@/stores/info';
import { useHandAuthStoreNew } from '@/stores/handLoginNew';
import { getTranslate } from '@/services/translate';

// 状态管理
const messageStore = useMessageStore();

// 表单引用
const formRMRef = ref(null);

// 响应式数据
const searchKeyword = ref('');
const selectedType = ref('');
const selectedLang = ref('');
const deleteDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const selectedMessage = ref(null);
const selectedMessageId = ref(null);
const selectedMessageCode = ref('');
const env = ref('');
const handAuthStoreNew = useHandAuthStoreNew();

const translateLangsMap = reactive({
  en_US: 'en',
  ja_JP: 'jp',
  cht_CN: 'cht',
  zh_TW: 'cht',
});
// 表单数据
const formData = reactive({
  code: '',
  type: '',
  lang: '',
  zh_CN: '',
  en_US: '',
  ja_JP: '',
  cht_CN: '',
  zh_TW: '',
  description: ''
});

// 表单验证规则
const formRules = {
  code: [
    { required: true, message: '请输入消息代码', trigger: ['blur', 'change'] },
    { min: 1, max: 100, message: '消息代码长度应在1-100个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_.]+$/, message: '消息代码只能包含字母、数字和下划线和点号', trigger: ['blur', 'change'] }
  ],
  type: [
    { required: true, message: '请选择消息类型', trigger: ['blur', 'change'] }
  ],
  lang: [
    { required: true, message: '请选择语言', trigger: ['blur', 'change'] }
  ],
  zh_CN: [
    { required: true, message: '请输入中文描述', trigger: ['blur', 'change'] }
  ]
};

// 表格列配置
const columns = [
  {
    title: '消息代码',
    colKey: 'code',
    width: 300
  },
  {
    title: '消息类型',
    colKey: 'typeMeaning',
    width: 100
  },
  {
    title: '语言',
    colKey: 'langMeaning',
    width: 120
  },
  {
    title: '消息描述',
    colKey: 'description',
    ellipsis: true
  },
  {
    title: '操作',
    colKey: 'operations',
    width: 160,
    fixed: 'right',
    align: 'center'
  }
];

// 计算属性
const drawerTitle = computed(() => {
  return messageStore.currentAction === 'add' ? '添加返回消息' : '编辑返回消息';
});

// 方法
// 处理添加
const handleAdd = () => {
  // 重置表单
  nextTick(() => {
    formRMRef.value?.reset();
    Object.keys(formData).forEach(key => {
      formData[key] = '';
    });
    messageStore.openAddDrawer();
  });
};

// 处理编辑
const handleEdit = (id) => {
  messageStore.openEditDrawer(id).then(() => {
    // 填充表单数据
    if (messageStore.messageDetail) {
      Object.keys(formData).forEach(key => {
        formData[key] = messageStore.messageDetail[key] || '';
      });
    }
  });
};

// 处理删除
const handleDelete = (row) => {
  selectedMessage.value = row;
  selectedMessageId.value = row.id;
  selectedMessageCode.value = row.code;
  deleteDialogVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  try {
    let res = await messageStore.deleteMessage(selectedMessage.value, env.value);
    debugger
    if (!res) {
      handleDeleteDialogClose();
    } 
  } catch (error) {
    MessagePlugin.error('删除失败');
  }
};

// 关闭删除对话框
const handleDeleteDialogClose = () => {
  deleteDialogVisible.value = false;
  selectedMessageId.value = null;
  selectedMessageCode.value = '';
  selectedMessage.value = null;
};

// 关闭详情对话框
const handleDetailDialogClose = () => {
  detailDialogVisible.value = false;
};

// 关闭抽屉
const handleDrawerClose = () => {
  messageStore.closeDrawer();
};

// 表单提交
const handleFormSubmit = async () => {
  try {
    // 验证表单
    let valid = await formRMRef.value?.validate();
    let isValid = true;
    for (let key in valid) {
      let validators = valid[key];
      for (let validator of validators) {
        if (validator.result === false) {
          isValid = false;
          break;
        }
      }
    }
    if (!isValid) {
      return;
    }
    if (messageStore.currentAction === 'add') {
      // 添加操作
      await messageStore.addMessage(formData, env.value, translateLangsMap);
    } else {
      // 编辑操作
      await messageStore.updateMessage(messageStore.currentMessageId, formData, env.value, translateLangsMap);
    }

    // 关闭抽屉
    messageStore.closeDrawer();
  } catch (error) {
    console.error('提交失败:', error);
  }
};

// 搜索
const handleSearch = () => {
  messageStore.setQueryParams({
    keyword: searchKeyword.value,
    page: 1
  });
  messageStore.fetchMessageList();
};

// 清除搜索
const handleClearSearch = () => {
  searchKeyword.value = '';
  messageStore.resetQueryParams();
  messageStore.fetchMessageList();
};

// 类型筛选
const handleTypeFilter = () => {
  messageStore.setQueryParams({ type: selectedType.value, page: 1 });
  messageStore.fetchMessageList();
};

// 语言筛选
const handleLangFilter = () => {
  messageStore.setQueryParams({ lang: selectedLang.value, page: 1 });
  messageStore.fetchMessageList();
};

// 刷新
const handleRefresh = () => {
  messageStore.fetchMessageList();
};

// 页码,页数变化
const handlePageChange = (page) => {
  messageStore.changePage(page.current);
  messageStore.changePageSize(page.pageSize);
};

// 生命周期
onMounted(() => {
  // 初始化数据
  // messageStore.fetchMessageList();
});

// 环境切换
const handleEnvChange = () => {
  messageStore.setEnv(env.value);
  messageStore.fetchMessageList();
};

// 调用百度翻译接口
const handleTranslate = async () => {
  try {
    for (let lang in translateLangsMap) {
      let res = await getTranslate({
        q: formData.zh_CN,
        from: 'zh',
        to: translateLangsMap[lang]
      });
      if (res.status === "success") {
        formData[lang] = res.data.trans_result[0].dst;
      } else {
        MessagePlugin.error('翻译失败');
      }
    }
  } catch (error) {
    console.error('翻译失败:', error);
    MessagePlugin.error('翻译失败');
  }
};
</script>

<style scoped lang="less">
.response-message-container {
  .env-select {
    display: inline-flex;
    align-items: center;
    margin-right: 16px;

    span {
      white-space: nowrap;
      font-size: 12px;
    }

    .to-maintenance {
      font-size: 10px;
      text-decoration: none;
      white-space: nowrap;
      color: var(--td-brand-color);
      cursor: pointer;
      margin-left: 8px;
    }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0 16px 0;

    .header-content {
      display: flex;
      align-items: center;
      position: relative;
    }

    .page-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .search-filter-section {
    margin-bottom: 16px;
    padding: 16px;
    background-color: #fff;
    border-radius: 4px;
  }
}

.table-section {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
}

.pagination-section {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  z-index: 1000;
  box-sizing: border-box;
  border-top: 1px solid #e4e7ed;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

.empty-state p {
  margin: 16px 0;
  font-size: 16px;
}

.delete-dialog-title {
  position: relative;
  width: 100%;
}

.delete-dialog-content {
  padding: 16px 0;
}

.delete-dialog-footer {
  display: flex;
  justify-content: center;
}

.delete-warning {
  color: var(--td-error-color-active);
  font-size: 16px;
  margin-top: 10px;
  font-weight: 600;
}

.detail-content {
  padding: 20px 0;
}

.detail-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.detail-label {
  width: 120px;
  font-weight: 600;
  color: #333;
  margin-right: 16px;
  text-align: right;
}

.detail-value {
  flex: 1;
  color: #666;
  word-break: break-word;
}
</style>
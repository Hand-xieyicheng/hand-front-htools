<template>
    <div class="env-management-container">
        <!-- 页面标题和操作按钮 -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">环境管理</h1>
            </div>
            <t-button theme="primary" @click="handleAdd">
                <template #icon><add-icon /></template>
                添加环境
            </t-button>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="search-filter-section">
            <t-row :gutter="20" justify="space-between">
                <t-col :span="4">
                    <t-input v-model="searchKeyword" placeholder="搜索环境名称或编码" clearable @clear="handleClearSearch"
                        @keyup="handleSearch">
                        <template #prefix-icon>
                            <search-icon />
                        </template>
                    </t-input>
                </t-col>
                <t-col :span="2">
                    <t-select v-model="selectedStatus" placeholder="按状态筛选" clearable @change="handleStatusFilter">
                        <t-option value="" label="全部状态" />
                        <t-option :value="1" label="启用" />
                        <t-option :value="0" label="禁用" />
                    </t-select>
                </t-col>
                <t-col :span="2">
                    <t-select v-model="selectedPublic" placeholder="按公开性筛选" clearable @change="handlePublicFilter">
                        <t-option value="" label="全部" />
                        <t-option :value="1" label="公开" />
                        <t-option :value="0" label="私有" />
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
            <t-table stripe stripe-color="blue" :data="envStore.envList" :loading="envStore.loading" :columns="columns"
                row-key="id">
                <template #operations="{ row }">
                    <t-space>
                        <t-button :disabled="row.updater_id !== useInfoStore().info.id" variant="outline" shape="circle"
                            theme="danger" @click="handleDelete(row)">
                            <template #icon> <delete-icon /></template>
                        </t-button>
                        <t-button :disabled="row.updater_id !== useInfoStore().info.id" variant="outline" shape="circle"
                            theme="primary" @click="handleEdit(row.id)">
                            <template #icon> <edit-icon /></template>
                        </t-button>
                    </t-space>
                </template>
                <template #status="{ row }">
                    <t-tag v-if="row.status === 1" theme="success">启用</t-tag>
                    <t-tag v-else-if="row.status === 0" theme="danger">禁用</t-tag>
                    <span v-else>未知</span>
                </template>
                <template #is_public="{ row }">
                    <t-tag v-if="row.is_public === 1" theme="info">公开</t-tag>
                    <t-tag v-else-if="row.is_public === 0" theme="default">私有</t-tag>
                    <span v-else>未知</span>
                </template>
                <template #env_img_url="{ row }">
                    <div v-if="row.env_img_url" class="env-image-container">
                        <img :src="row.env_img_url" alt="环境图片" class="env-image"
                            @click="handleImagePreview(row.env_img_url)" />
                    </div>
                    <span v-else>-</span>
                </template>
                <template #login_url="{ row }">
                    <a :href="row.login_url" target="_blank" rel="noopener noreferrer" class="login-url-link">
                        {{ row.login_url }}
                    </a>
                </template>
                <template #empty>
                    <div class="empty-state">
                        <t-icon name="document" size="64" />
                        <p style="color: #929292;">暂无环境数据</p>
                        <t-button size="large" variant="dashed" shape="round" theme="primary"
                            @click="handleAdd">添加环境</t-button>
                    </div>
                </template>
            </t-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
            <div style="height: 64px;"></div>
            <div class="pagination-section">
                <t-pagination :total="envStore.pagination.total" :page-size="envStore.pagination.pageSize"
                    :current="envStore.pagination.page" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" @change="handlePageChange" />
            </div>
        </div>

        <!-- 添加/编辑抽屉 -->
        <t-drawer @confirm="handleFormSubmit" @cancel="handleDrawerClose" :header="drawerTitle"
            :visible="envStore.drawerVisible" size="600px" placement="right" @close="handleDrawerClose">
            <t-form :data="formData" :rules="formRules" ref="formRef" label-align="top">
                <t-form-item label="环境名称" name="env_name">
                    <t-input size="large" v-model="formData.env_name" placeholder="请输入环境名称" />
                </t-form-item>
                <t-form-item label="环境编码" name="env_code">
                    <t-input size="large" v-model="formData.env_code" placeholder="请输入环境编码（如：dev、test、prod）" />
                </t-form-item>
                <t-form-item label="登录地址URL" name="login_url">
                    <t-input size="large" v-model="formData.login_url"
                        placeholder="请输入环境登录地址URL（如：https://dev-hand.example.com/login）" />
                </t-form-item>
                <t-form-item label="环境图片URL" name="env_img_url">
                    <t-input size="large" v-model="formData.env_img_url" placeholder="请输入环境图片URL（选填）" />
                </t-form-item>
                <t-form-item label="是否公开" name="is_public">
                    <t-radio-group size="large" v-model="formData.is_public">
                        <t-radio :value="1">公开（所有用户可见）</t-radio>
                        <t-radio :value="0">私有（仅授权用户可见）</t-radio>
                    </t-radio-group>
                </t-form-item>
                <t-form-item label="环境状态" name="status">
                    <t-radio-group size="large" v-model="formData.status">
                        <t-radio :value="1">启用</t-radio>
                        <t-radio :value="0">禁用（禁用后不可访问）</t-radio>
                    </t-radio-group>
                </t-form-item>
                <t-form-item label="环境备注" name="remark">
                    <t-textarea v-model="formData.remark" placeholder="请输入环境备注（如：环境用途、访问权限说明、维护周期等）"
                        :autosize="{ minRows: 3, maxRows: 10 }" />
                </t-form-item>
            </t-form>
        </t-drawer>

        <!-- 删除确认对话框 -->
        <t-dialog :visible="deleteDialogVisible" title="确认删除" :width="400" @close="handleDeleteDialogClose">
            <template #header>
                <div class="delete-dialog-title">
                    <span>删除提示</span>
                </div>
            </template>
            <div class="delete-dialog-content">
                <p class="delete-warning">确认删除环境「{{ selectedEnvName }}」? 此操作不可撤销，删除后数据将无法恢复。</p>
            </div>
            <template #footer>
                <div class="delete-dialog-footer">
                    <t-button size="large" shape="round" theme="default" @click="handleDeleteDialogClose">取消</t-button>
                    <t-button size="large" shape="round" theme="danger" @click="confirmDelete">确定删除</t-button>
                </div>
            </template>
        </t-dialog>

        <!-- 图片预览对话框 -->
        <t-dialog :visible="imagePreviewVisible" :width="600" title="环境图片预览" @close="handleImagePreviewClose">
            <div class="image-preview-container">
                <img :src="previewImageUrl" alt="环境图片预览" class="preview-image" />
            </div>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useEnvStore } from '@/stores/env';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import moment from 'moment';
import { MessagePlugin } from 'tdesign-vue-next';
import { useInfoStore } from '@/stores/info';

// 状态管理
const envStore = useEnvStore();

// 表单引用
const formRef = ref(null);

// 响应式数据
const searchKeyword = ref('');
const selectedStatus = ref('');
const selectedPublic = ref('');
const deleteDialogVisible = ref(false);
const selectedEnvId = ref(null);
const selectedEnvName = ref('');
const imagePreviewVisible = ref(false);
const previewImageUrl = ref('');

// 表单数据
const formData = reactive({
    env_name: '',
    env_code: '',
    login_url: '',
    env_img_url: '',
    is_public: 0,
    status: 1,
    remark: ''
});

// 表单验证规则
const formRules = {
    env_name: [
        { required: true, message: '请输入环境名称', trigger: ['blur', 'change'] },
        { min: 1, max: 100, message: '环境名称长度应在1-100个字符之间', trigger: 'blur' }
    ],
    env_code: [
        { required: true, message: '请输入环境编码', trigger: ['blur', 'change'] },
        { min: 1, max: 50, message: '环境编码长度应在1-50个字符之间', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '环境编码只能包含字母、数字和下划线', trigger: ['blur', 'change'] }
    ],
    login_url: [
        { required: true, message: '请输入环境登录地址URL', trigger: ['blur', 'change'] },
        { pattern: /^(https?:\/\/)[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=]+$/, message: '请输入有效的URL地址', trigger: ['blur', 'change'] }
    ],
    env_img_url: [
        { pattern: /^(https?:\/\/)?[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=]+$/, message: '请输入有效的图片URL地址', trigger: ['blur', 'change'] }
    ],
    is_public: [
        { required: true, message: '请选择是否公开', trigger: 'change' }
    ],
    status: [
        { required: true, message: '请选择环境状态', trigger: 'change' }
    ]
};

// 表格列配置
const columns = [
    {
        title: '环境名称',
        colKey: 'env_name',
        width: 180
    },
    {
        title: '环境编码',
        colKey: 'env_code',
        width: 120
    },
    {
        title: '登录地址',
        colKey: 'login_url',
        ellipsis: true
    },
    {
        title: '环境图片',
        colKey: 'env_img_url',
        width: 100,
        align: 'center'
    },
    {
        title: '是否公开',
        colKey: 'is_public',
        width: 80,
        align: 'center'
    },
    {
        title: '状态',
        colKey: 'status',
        width: 80,
        align: 'center'
    },
    {
        title: '备注',
        colKey: 'remark',
        ellipsis: true
    },
    {
        title: '创建人',
        colKey: 'creator_name',
        width: 100
    },
    {
        title: '创建时间',
        colKey: 'created_at',
        width: 160,
        align: 'center',
        cell: (row, col) => {
            return col.row.created_at ? moment(col.row.created_at).format('YYYY-MM-DD HH:mm:ss') : '-';
        }
    },
    {
        title: '更新人',
        colKey: 'updater_name',
        width: 100
    },
    {
        title: '更新时间',
        colKey: 'updated_at',
        width: 160,
        align: 'center',
        cell: (row, col) => {
            return col.row.updated_at ? moment(col.row.updated_at).format('YYYY-MM-DD HH:mm:ss') : '-';
        }
    },
    {
        title: '操作',
        colKey: 'operations',
        width: 140,
        fixed: 'right',
        align: 'center'
    }
];

// 计算属性
const drawerTitle = computed(() => {
    return envStore.currentAction === 'add' ? '添加环境' : '编辑环境';
});

// 方法
// 处理添加
const handleAdd = () => {
    // 重置表单
    nextTick(() => {
        formRef.value?.reset();
        Object.keys(formData).forEach(key => {
            if (key === 'status') {
                formData[key] = 1;
            } else if (key === 'is_public') {
                formData[key] = 0;
            } else {
                formData[key] = '';
            }
        });
        envStore.openAddDrawer();
    });
};

// 处理编辑
const handleEdit = (id) => {
    envStore.openEditDrawer(id).then(() => {
        // 填充表单数据
        if (envStore.envDetail) {
            Object.keys(formData).forEach(key => {
                formData[key] = envStore.envDetail[key] || '';
            });
        }
    });
};

// 处理删除
const handleDelete = (row) => {
    selectedEnvId.value = row.id;
    selectedEnvName.value = row.env_name;
    deleteDialogVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
    try {
        let res = await envStore.deleteExistingEnv(selectedEnvId.value);
        if (res.status === "success") {
            MessagePlugin.success('删除成功');
            // 刷新列表
            await envStore.fetchEnvList();
        } else {
            MessagePlugin.error('删除失败');
            deleteDialogVisible.value = false;
        }
        deleteDialogVisible.value = false;
        // 重置选中状态
        selectedEnvId.value = null;
        selectedEnvName.value = '';
    } catch (error) {
        console.error('删除失败:', error);
    }
};

// 关闭删除对话框
const handleDeleteDialogClose = () => {
    deleteDialogVisible.value = false;
    selectedEnvId.value = null;
    selectedEnvName.value = '';
};

// 关闭抽屉
const handleDrawerClose = () => {
    envStore.closeDrawer();
};

// 表单提交
const handleFormSubmit = async () => {
    try {
        // 验证表单
        await formRef.value?.validate();

        if (envStore.currentAction === 'add') {
            // 添加操作
            await envStore.addNewEnv(formData);
        } else {
            // 编辑操作
            await envStore.updateExistingEnv(envStore.currentEnvId, formData);
        }

        // 关闭抽屉
        envStore.closeDrawer();
    } catch (error) {
        console.error('提交失败:', error);
    }
};

// 搜索
const handleSearch = () => {
    envStore.setQueryParams({
        env_name: searchKeyword.value,
        env_code: searchKeyword.value,
        page: 1
    });
    envStore.fetchEnvList();
};

// 清除搜索
const handleClearSearch = () => {
    searchKeyword.value = '';
    envStore.resetQueryParams();
    envStore.fetchEnvList();
};

// 状态筛选
const handleStatusFilter = () => {
    envStore.setQueryParams({ status: selectedStatus.value, page: 1 });
    envStore.fetchEnvList();
};

// 公开性筛选
const handlePublicFilter = () => {
    envStore.setQueryParams({ is_public: selectedPublic.value, page: 1 });
    envStore.fetchEnvList();
};

// 刷新
const handleRefresh = () => {
    envStore.fetchEnvList();
};

// 页码,页数变化
const handlePageChange = (page) => {
    envStore.changePage(page.current);
    envStore.changePageSize(page.pageSize);
};

// 图片预览
const handleImagePreview = (imageUrl) => {
    previewImageUrl.value = imageUrl;
    imagePreviewVisible.value = true;
};

// 关闭图片预览
const handleImagePreviewClose = () => {
    imagePreviewVisible.value = false;
    previewImageUrl.value = '';
};

// 生命周期
onMounted(() => {
    // 初始化数据
    envStore.fetchEnvList();
});
</script>

<style scoped lang="less">
.env-management-container {

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

.env-image-container {
    width: 40px;
    height: 40px;
    margin: 0 auto;
}

.env-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
}

.login-url-link {
    color: var(--td-primary-color);
    text-decoration: underline;
}

.login-url-link:hover {
    color: var(--td-primary-color-active);
}

.image-preview-container {
    text-align: center;
    padding: 20px 0;
}

.preview-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
}
</style>
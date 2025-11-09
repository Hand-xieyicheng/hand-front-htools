<template>
    <div class="module-maintenance-container">
        <!-- 页面标题和操作按钮 -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">模块维护</h1>
            </div>
            <t-button theme="primary" @click="handleAdd">
                <template #icon><add-icon /></template>
                添加模块
            </t-button>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="search-filter-section">
            <t-row :gutter="20" justify="space-between">
                <t-col :span="4">
                    <t-input v-model="searchKeyword" placeholder="搜索模块名称或编码" clearable @clear="handleClearSearch"
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
                <t-col :span="4">
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
            <t-table stripe stripe-color="blue" :data="moduleStore.moduleList" :loading="moduleStore.loading"
                :columns="columns" row-key="id">
                <template #operations="{ row }">
                    <t-space>
                        <t-button variant="outline" shape="circle" theme="danger" @click="handleDelete(row)">
                            <template #icon> <delete-icon /></template>
                        </t-button>
                        <t-button variant="outline" shape="circle" theme="primary" @click="handleEdit(row.id)">
                            <template #icon> <edit-icon /></template>
                        </t-button>
                    </t-space>
                </template>
                <template #status="{ row }">
                    <t-tag v-if="row.status === 1" theme="success">启用</t-tag>
                    <t-tag v-else-if="row.status === 0" theme="danger">禁用</t-tag>
                    <span v-else>未知</span>
                </template>
                <template #empty>
                    <div class="empty-state">
                        <t-icon name="document" size="64" />
                        <p style="color: #929292;">暂无模块数据</p>
                        <t-button size="large" variant="dashed" shape="round" theme="primary"
                            @click="handleAdd">添加模块</t-button>
                    </div>
                </template>
            </t-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
            <div style="height: 64px;"></div>
            <div class="pagination-section">
                <t-pagination :total="moduleStore.pagination.total" :page-size="moduleStore.pagination.pageSize"
                    :current="moduleStore.pagination.page" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" @change="handlePageChange" />
            </div>
        </div>

        <!-- 添加/编辑抽屉 -->
        <t-drawer @confirm="handleFormSubmit" @cancel="handleDrawerClose" :header="drawerTitle"
            :visible="moduleStore.drawerVisible" size="500px" placement="right" @close="handleDrawerClose">
            <t-form :data="formData" :rules="formRules" ref="formRef" label-align="top">
                <t-form-item label="模块名称" name="module_name">
                    <t-input size="large" v-model="formData.module_name" placeholder="请输入模块名称" />
                </t-form-item>
                <t-form-item label="模块编码" name="module_code">
                    <t-input size="large" v-model="formData.module_code" placeholder="请输入模块编码" />
                </t-form-item>
                <t-form-item label="排序" name="sort">
                    <t-input size="large" v-model="formData.sort" placeholder="请输入排序" />
                </t-form-item>
                <t-form-item label="模块描述" name="remark">
                    <t-textarea v-model="formData.remark" placeholder="请输入模块描述"
                        :autosize="{ minRows: 3, maxRows: 10 }" />
                </t-form-item>
                <t-form-item label="模块状态" name="status">
                    <t-radio-group size="large" v-model="formData.status">
                        <t-radio :value="1">启用</t-radio>
                        <t-radio :value="0">禁用</t-radio>
                    </t-radio-group>
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
                <p class="delete-warning">确认删除模块「{{ selectedModuleName }}」? 此操作不可撤销，删除后数据将无法恢复。</p>
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
import { useModuleStore } from '@/stores/module';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import moment from 'moment';

// 状态管理
const moduleStore = useModuleStore();

// 表单引用
const formRef = ref(null);

// 响应式数据
const searchKeyword = ref('');
const selectedStatus = ref('');
const deleteDialogVisible = ref(false);
const selectedModuleId = ref(null);
const selectedModuleName = ref('');

// 表单数据
const formData = reactive({
    module_name: '',
    module_code: '',
    sort: 0,
    remark: '',
    status: 1,
});

// 表单验证规则
const formRules = {
    module_name: [
        { required: true, message: '请输入模块名称', trigger: ['blur', 'change'] },
        { min: 1, max: 50, message: '模块名称长度应在1-50个字符之间', trigger: 'blur' }
    ],
    module_code: [
        { required: true, message: '请输入模块编码', trigger: ['blur', 'change'] },
        { min: 1, max: 30, message: '模块编码长度应在1-30个字符之间', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '模块编码只能包含字母、数字和下划线',
            trigger: ['blur', 'change']
        }
    ],
    sort: [
        { required: true, message: '请输入排序', trigger: ['blur', 'change'] },
        { min: 0, max: 9999, message: '排序值必须在0-9999之间', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择模块状态', trigger: 'change' }
    ],
};

// 表格列配置
const columns = [
    {
        title: '排序',
        colKey: 'sort',
        width: 60,
        align: 'center'
    },
    {
        title: '模块名称',
        colKey: 'module_name',
        width: 200
    },
    {
        title: '模块编码',
        colKey: 'module_code',
        width: 150
    },
    {
        title: '模块描述',
        colKey: 'remark',
        ellipsis: true
    },
    {
        title: '状态',
        colKey: 'status',
        width: 100,
        align: 'center'
    },
    {
        title: '创建人',
        colKey: 'creator_name',
        width: 120
    },
    {
        title: '创建时间',
        colKey: 'created_at',
        width: 200,
        align: 'center',
        cell: (row, col) => {
            return col.row.created_at ? moment(col.row.created_at).format('YYYY-MM-DD HH:mm:ss') : '-';
        }
    },
    {
        title: '更新人',
        colKey: 'updater_name',
        width: 120
    },
    {
        title: '更新时间',
        colKey: 'updated_at',
        width: 200,
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
    return moduleStore.currentAction === 'add' ? '添加模块' : '编辑模块';
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
            } else {
                formData[key] = '';
            }
        });
        moduleStore.openAddDrawer();
    });
};

// 处理编辑
const handleEdit = (id) => {
    moduleStore.openEditDrawer(id).then(() => {
        // 填充表单数据
        if (moduleStore.moduleDetail) {
            Object.keys(formData).forEach(key => {
                formData[key] = moduleStore.moduleDetail[key] || '';
            });
        }
    });
};

// 处理删除
const handleDelete = (row) => {
    selectedModuleId.value = row.id;
    selectedModuleName.value = row.module_name;
    deleteDialogVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
    try {
        await moduleStore.deleteExistingModule(selectedModuleId.value);
        deleteDialogVisible.value = false;
        // 重置选中状态
        selectedModuleId.value = null;
        selectedModuleName.value = '';
    } catch (error) {
        console.error('删除失败:', error);
    }
};

// 关闭删除对话框
const handleDeleteDialogClose = () => {
    deleteDialogVisible.value = false;
    selectedModuleId.value = null;
    selectedModuleName.value = '';
};

// 关闭抽屉
const handleDrawerClose = () => {
    moduleStore.closeDrawer();
};

// 表单提交
const handleFormSubmit = async () => {
    try {
        // 验证表单
        await formRef.value?.validate();

        if (moduleStore.currentAction === 'add') {
            // 添加操作
            await moduleStore.addNewModule(formData);
        } else {
            // 编辑操作
            await moduleStore.updateExistingModule(moduleStore.currentModuleId, formData);
        }

        // 关闭抽屉
        moduleStore.closeDrawer();
    } catch (error) {
        console.error('提交失败:', error);
    }
};

// 搜索
const handleSearch = () => {
    moduleStore.setQueryParams({
        module_name: searchKeyword.value,
        module_code: searchKeyword.value,
        page: 1
    });
    moduleStore.fetchModuleList();
};

// 清除搜索
const handleClearSearch = () => {
    searchKeyword.value = '';
    moduleStore.resetQueryParams();
    moduleStore.fetchModuleList();
};

// 状态筛选
const handleStatusFilter = () => {
    moduleStore.filterByStatus(selectedStatus.value);
};

// 刷新
const handleRefresh = () => {
    moduleStore.fetchModuleList();
};

// 页码,页数变化
const handlePageChange = (page) => {
    moduleStore.changePage(page.current);
    moduleStore.changePageSize(page.pageSize);
};

// 生命周期
onMounted(() => {
    // 初始化数据
    moduleStore.fetchModuleList();
});
</script>

<style scoped lang="less">
.module-maintenance-container {

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
</style>

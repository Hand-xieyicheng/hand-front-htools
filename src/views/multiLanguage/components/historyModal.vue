<template>
    <div class="history-modal-container">
        <t-dialog header="历史记录" cancelBtn="关闭" :closeBtn="false" :confirmBtn="null" width="80%" :onOpened="handleOpened"
            :visible="visible" @cancel="handleCancel">

            <div class="history-modal-content">
                <div class="history-modal-content-item">
                    <t-table :data="dataSource" :columns="columns" :stripe="true" :bordered="true" :hover="true"
                        cell-empty-content="-" resizable lazy-load :pagination="pagination" @page-change="onPageChange">
                        <template #multilingual_json="{ row }">
                            <div style="white-space: pre-line;">
                                <t-collapse :key="row.id">
                                    <t-collapse-panel :key="item.filedId" v-for="item in row.multilingual_json"
                                        :value="item.filedId" :header="item.label">
                                        <div style="color: #42c05d;font-size: 12px; margin-bottom: 8px;">
                                            编码：{{ item?.filed ?? '-' }}</div>
                                        <table class="multi-language-table">
                                            <tbody>
                                                <tr v-for="lang in item.multiLanguage" :key="lang.id">
                                                    <td style="width: 90px;font-size: 12px;">{{ lang?.label || '-' }}
                                                    </td>
                                                    <td>
                                                        <div class="custom-input-container">
                                                            {{ lang?.value || '-' }}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </t-collapse-panel>
                                </t-collapse>
                            </div>
                        </template>
                        <template #operation="{ row }">
                            <div>
                                <t-popconfirm content="确认删除吗" @confirm="handleDeleteData(row)">
                                    <t-button size="small" variant="text" theme="danger">删除</t-button>
                                </t-popconfirm>
                                <t-button size="small" variant="text" theme="primary"
                                    @click="handleApplyData(row)">应用数据</t-button>
                            </div>
                        </template>
                    </t-table>
                </div>
            </div>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getHistoryList, deleteHistoryData } from '@/services/multiLan';
import moment from 'moment';
const dataSource = ref([]);
const expandedRowKeys = ref(['2']);
// 1. 定义接收父组件的参数（必传/可选、类型、默认值）
const props = defineProps({
    // 控制抽屉显示/隐藏（必传，双向绑定）
    visible: {
        type: Boolean,
        required: true, // 父组件必须传递该参数
        default: false
    },
});
const pagination = ref({
    defaultPageSize: 10,
    total: 0,
    defaultCurrent: 1,
});
// 定义表格列
const columns = ref([
    {
        title: '项目',
        colKey: 'project_code',
        key: 'project_code',
        align: 'center',
    },
    {
        title: '模块',
        colKey: 'module_code',
        key: 'module_code',
        align: 'center',
    },
    // {
    //     title: '文档字段',
    //     colKey: 'multilingual_json',
    //     key: 'multilingual_json',
    //     align: 'center',
    //     width: 400,
    // }, 
    {
        title: '创建时间',
        colKey: 'created_at',
        key: 'created_at',
        cell: (row) => moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
        align: 'center',
    }, {
        title: '操作',
        colKey: 'operation',
        key: 'operation',
        align: 'center',
    },
]);
// 2. 定义向父组件传递事件的方法（子传父）
const emit = defineEmits(['update:visible', 'cancel', 'overlay-click']);
const handleOpened = () => {
    getHistoryDataList();
};
// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
};

// BaseTable 中只有 page-change 事件，没有 change 事件
const onPageChange = async (pageInfo) => {
    console.log('page-change', pageInfo);
    // 下面为受控方式，如果使用此方式，将pagination内的defaultCurrent改为current
    // pagination.value.current = pageInfo.current;
    // pagination.value.pageSize = pageInfo.pageSize;
    getHistoryDataList(pageInfo);
};

// 获取历史记录列表
const getHistoryDataList = async (pageInfo) => {
    try {
        const res = await getHistoryList({
            project: props.project,
            module: props.module,
            page: pageInfo?.current || pagination.value.defaultCurrent,
            pageSize: pageInfo?.pageSize || pagination.value.defaultPageSize,
        });
        if (res.status === 'success') {
            dataSource.value = res.data.list || [];
            pagination.value.total = res.data.total || 0;
        } else {
            MessagePlugin.error(res.msg);
        }
    } catch (error) {
        MessagePlugin.error(error.message);
    }
}
// 应用数据
const handleApplyData = (row) => {
    emit('update:applyData', row);
    emit('update:visible', false);
}
// 删除数据
const handleDeleteData = async (row) => {
    console.log('row', row);
    try {
        const res = await deleteHistoryData(row.id);
        if (res.status === 'success') {
            MessagePlugin.success('删除成功');
            getHistoryDataList();
        } else {
            MessagePlugin.error(res.msg);
        }
    } catch (error) {
        MessagePlugin.error(error.message);
    }
}
</script>
<style scoped lang="less">
.history-modal-container {
    .history-modal-header {
        display: flex;
        align-items: center;
        margin-left: 30px;
        position: relative;

        .history-modal-header-icon {
            position: absolute;
            left: calc(-50% - 50px);
            top: -200px;
        }
    }
}
</style>

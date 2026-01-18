<template>
    <div class="doc-copy-modal-container">
        <t-dialog :onOpened="filteredDataSource" :visible="visible" width="80vw" cancel-btn="关闭" confirm-btn="复制"
            @confirm="copyAllTableDataToClipboard" @cancel="handleCancel" @close="handleCancel">
            <template #header>
                <div class="doc-copy-modal-header">
                    <span>多语言文档</span>
                    <t-icon @click="linkToMultilanDoc" name="link" class="link-icon" />
                </div>
            </template>
            <table class="multi-language-table">
                <thead>
                    <tr>
                        <th style="width: 80px;font-size: 12px;">模板代码</th>
                        <th style="width: 80px;font-size: 12px;">代码</th>
                        <th style="width: 80px;font-size: 12px;">描述(中文)</th>
                        <th style="width: 80px;font-size: 12px;">描述(English)</th>
                        <th style="width: 80px;font-size: 12px;">描述(日本語)</th>
                        <th style="width: 80px;font-size: 12px;">描述(繁体中文(香港))</th>
                        <th style="width: 80px;font-size: 12px;">描述(繁体中文(台湾))</th>
                        <th style="width: 80px;font-size: 12px;">唯一性</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in dataSource" :key="item.filed">
                        <td>{{ item?.filed?.split('.')?.slice(0, -2)?.join('.') ?? item.filed }}</td>
                        <td>{{ item?.filed?.split('.')?.slice(2)?.join('.') ?? item.filed }}</td>
                        <td>{{ item.multiLanguage?.[0]?.value ?? '-' }}</td>
                        <td>{{ item.multiLanguage?.[1]?.value ?? '-' }}</td>
                        <td>{{ item.multiLanguage?.[2]?.value ?? '-' }}</td>
                        <td>{{ item.multiLanguage?.[3]?.value ?? '-' }}</td>
                        <td>{{ item.multiLanguage?.[4]?.value ?? '-' }}</td>
                        <td>{{ item?.filed }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="common-no-data" v-show="dataSource.length === 0">
                暂无数据
            </div>
            <t-checkbox-group @change="filteredDataSource" v-model="checkedItems" :options="options"
                option-label="filed" option-value="filed" />

        </t-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { copyToClipboard } from '@/utils/tools';
import { FILED_TYPE_ENUM } from '@/utils/constance';
const options = [
    { label: '全选', checkAll: true }, ...FILED_TYPE_ENUM, { label: '去除重复项', filed: 'other' }]
// 1. 定义接收父组件的参数（必传/可选、类型、默认值）
const props = defineProps({
    // 控制抽屉显示/隐藏（必传，双向绑定）
    visible: {
        type: Boolean,
        required: true, // 父组件必须传递该参数
        default: false
    },
    // 系统
    system: {
        type: String,
        required: true, // 父组件必须传递该参数
        default: ''
    },
    // 模块
    module: {
        type: String,
        required: true, // 父组件必须传递该参数
        default: ''
    },
    // 多语言数据结构
    dataStructure: {
        type: Array,
        required: true, // 父组件必须传递该参数
        default: []
    },
});
// 选中的字段类型
const checkedItems = ref([2]);

// 2. 定义向父组件传递事件的方法（子传父）
const emit = defineEmits(['update:visible', 'cancel', 'overlay-click']);
// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
};
const dataSource = ref([]);
// 页面打开时吧数据赋值
onMounted(() => {
    dataSource.value = props.dataStructure;
});

// 过滤数据
const filteredDataSource = (val) => {
    if (val) {
        checkedItems.value = val;
    };
    if (checkedItems.value.includes('checkAll')) {
        dataSource.value = props.dataStructure;
    }
    if (checkedItems.value.includes('other')) {
        // 去除对象中重复项,filed字段
        return dataSource.value = [...new Set(props.dataStructure.filter(item => checkedItems.value.includes(item.status)))];
    } else {
        return dataSource.value = props.dataStructure.filter(item => checkedItems.value.includes(item.status));
    }
};

// 复制表格内容到剪贴板
const copyAllTableDataToClipboard = () => {
    if (!dataSource.value?.length) {
        MessagePlugin.info('请先生成多语言字段！')
        return
    } else {
        let tableData = "";
        dataSource.value?.forEach(item => {
            console.log(tableData);
            tableData = tableData + (item?.filed?.split('.')?.slice(0, -2)?.join('.') ?? item.filed)
             + "\t" + (item?.filed?.split('.')?.slice(2)?.join('.') ?? item.filed)
             + "\t" + item.multiLanguage?.[0]?.value
             + "\t" + item.multiLanguage?.[1]?.value 
             + "\t" + item.multiLanguage?.[2]?.value 
             + "\t" + item.multiLanguage?.[3]?.value 
             + "\t" + item.multiLanguage?.[4]?.value 
             + "\t" + item?.filed
             + "\n";
        });
        copyToClipboard(tableData);
    }
}

// 跳转到多语言文档
const linkToMultilanDoc = () => {
    window.open(`https://u0vocx8xrmg.feishu.cn/sheets/M743s3sdyhl4MFtyYThcmcFDnPh?sheet=haroqk`);
}
</script>
<style scoped lang="less">
.doc-copy-modal-container {
    .doc-copy-modal-header {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        color: #333;
        .link-icon {
            color: var(--td-brand-color);
            font-size: 16px;
            margin-left: 8px;
            cursor: pointer;
        }
    }
    .multi-language-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ddd;
        margin-bottom: 16px;
        th{
            background-color: #f5f5f5;
            font-weight: bold;
        }
        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
    }
}
</style>

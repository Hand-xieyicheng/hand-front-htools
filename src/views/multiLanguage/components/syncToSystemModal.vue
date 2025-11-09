<template>
    <div class="generate-field-modal-container">
        <t-dialog header="同步至环境中" :closeBtn="false" width="80%" :onOpened="handleOpened" :visible="visible"
            @cancel="handleCancel">
            <template #footer>
                <t-button theme="secondary" @click="handleCancel">关闭</t-button>
                <t-button theme="success" @click="handleSaveHistory">存入历史</t-button>
                <t-button theme="warning" @click="handleConfirm('syncAll')">一键同步</t-button>
                <t-button theme="primary" @click="handleConfirm('syncNew')">仅同步新字段</t-button>
            </template>
            <div class="generate-field-content" ref="scrollContainer">
                <div style="margin-bottom: 10px; ">当前环境：<a href="{{handAuthStore.handEnvLink}}" target="_blank"
                        style="color: var(--td-brand-color);">{{ handAuthStore.handEnv }}环境</a>
                    <span style="margin-left: 16px;">登陆账号: {{ handAuthStore?.handSelfData?.loginName || '无' }}</span>
                </div>
                <t-table row-key="promptId" :data="structureDataList" :columns="structureLanColumns" :stripe="true"
                    :bordered="true" :hover="true" cell-empty-content="-" resizable lazy-load>
                    <template #status="{ row }">
                        <div>
                            <t-tag v-show="row.status === 1" theme="success" variant="outline">公共字段</t-tag>
                            <t-tag v-show="row.status === 2" theme="warning" variant="outline">新字段</t-tag>
                            <t-tag v-show="row.status === 3" theme="primary" variant="outline">存在字段</t-tag>
                        </div>
                    </template>
                    <template #syncStatus="{ row }">
                        <div>
                            <t-tag v-show="row.status !== 1 && !row?.syncStatus" variant="outline">待同步</t-tag>
                            <t-tag v-show="row.syncStatus === 1" theme="warning" variant="outline">进行中</t-tag>
                            <t-tag v-show="row.syncStatus === 2" theme="success" variant="outline">同步成功</t-tag>
                            <t-tag v-show="row.syncStatus === 3" theme="danger" variant="outline">同步失败</t-tag>
                        </div>
                    </template>
                    <template #operation="{ row }">
                        <t-button @click="handleSync(row)" v-show="row.status === 2 || row.status === 3" variant="text" theme="primary"
                            size="small">同步至环境</t-button>
                    </template>
                </t-table>
            </div>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getCommonLansData } from '@/services/handLogin';
import { useHandAuthStore } from '@/stores/handLogin';
import { addCommonLansData, updateCommonLansData } from '@/services/multiLan';
// 所有数据
const handAuthStore = useHandAuthStore();
const structureDataList = ref([]);
const structureLanColumns = ref([
    {
        title: '模板代码',
        colKey: 'filed',
        key: 'filed',
    },
    {
        title: '标题',
        colKey: 'label',
        key: 'label',
    },
    { colKey: 'status', title: '状态', align: 'center', width: '100px' },
    { colKey: 'syncStatus', title: '操作状态', align: 'center', width: '100px' },
    { colKey: 'operation', title: '操作', align: 'center', width: '120px' },
])
// 1. 定义接收父组件的参数（必传/可选、类型、默认值）
const props = defineProps({
    // 控制抽屉显示/隐藏（必传，双向绑定）
    visible: {
        type: Boolean,
        required: true, // 父组件必须传递该参数
        default: false
    },
    system: {
        type: String,
        required: true, // 父组件必须传递该参数
        default: ''
    },
    module: {
        type: String,
        required: true, // 父组件必须传递该参数
        default: ''
    },
    dataStructure: {
        type: Array,
        required: true, // 父组件必须传递该参数
        default: []
    },
    // 抽屉弹出方向（可选，有默认值）
    placement: {
        type: String,
        required: false,
        default: 'bottom', // 默认从底部弹出
        validator: (value) => {
            // 限制可选值，增强健壮性
            return ['top', 'right', 'bottom', 'left'].includes(value);
        }
    },
    // 抽屉标题（可选，有默认值）
    title: {
        type: String,
        required: false,
        default: '标题名称'
    },
    // 存入历史（可选，有默认值）
    saveToHistory: {
        type: Function,
        required: false,
        default: () => {}
    },
    setDataStructure: {
        type: Function,
        required: false,
        default: () => {}
    }
});

// 2. 定义向父组件传递事件的方法（子传父）
const emit = defineEmits(['update:visible', 'cancel', 'overlay-click']);
const handleOpened = () => {
    structureDataList.value = JSON.parse(JSON.stringify(props.dataStructure));
};
// 校验数据
const validateLansData = async () => {
    // 校验数据结构是否为空
    if (structureDataList.value.length === 0) {
        MessagePlugin.error('字段列表为空，请先输入字段列表');
        return;
    } else {
        // 否则开始进入流程
        for (const item of structureDataList.value) {
            // 检测是否为公共字段
            item.status = 0;
            const res = await getCommonLansData({ promptKey: "hfat.common", description: item.label });
            if (res?.empty) {
                // 平台不存在该字段，跳过
                const res2 = await getCommonLansData({ promptKey: "hzero.common", description: item.label });
                if (res2?.empty) {
                    item.status = 2;
                    // 发现不是公共字段，检测是否为存在字段
                    const res3 = await getCommonLansData({ promptKey: `${system}.${module}`, description: item.label });
                    continue;
                } else {
                    // 平台存在该字段
                    item.status = 2; // 2 新字段
                    for (const item2 of res.content || []) {
                        if (item2.description === item.label && (item2.promptKey === 'hfat.common' || item2.promptKey === 'hzero.common')) {
                            item.filed = item2.promptKey + '.' + item2.promptCode;
                            item.status = 1;
                            break;
                        }
                    }
                }
            } else {
                // 是公共字段
                item.status = 2;
                for (const item2 of res.content || []) {
                    if (item2.description === item.label && (item2.promptKey === 'hfat.common' || item2.promptKey === 'hzero.common')) {
                        item.filed = item2.promptKey + '.' + item2.promptCode;
                        item.status = 1;
                        break;
                    }
                }
            }
            // 滚动到最下方
            scrollToBottom();
        }
    }
}

// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
};

const handleSync = async (item) => {
    // 1. 校验数据
    if (item.status !== 2 && item.status !== 3) {
        MessagePlugin.error('只有新字段和存在字段才能同步');
        return;
    }
    // 2. 开始同步数据
    item.syncStatus = 1; // 进行中
    await handleConfirm('syncOne', [item]);
}

// 点击同步按钮：开始同步数据
// status: 0 未处理 1 公共字段 2 新字段 3 存在字段
const handleConfirm = async (type, syncArrayData) => {
    // 1. 过滤数据
    let syncData = [];
    if (type === 'syncOne') {
        syncData = syncArrayData;
    } else if (type === 'syncAll') {
        syncData = structureDataList.value.filter(item => item.status === 2 || item.status === 3);
    } else if (type === 'syncNew') {
        syncData = structureDataList.value.filter(item => item.status === 2);
    }
    // 2. 校验数据
    if (syncData.length === 0) {
        MessagePlugin.error('无可同步的数据');
        return;
    } else {
        // 3. 开始同步数据
        MessagePlugin.info(`开始同步${syncData.length}条数据...`);
        // 4. 开始数据校验，获取平台的token等数据，进行数据新增或数据更新
        for (const item of syncData) {
            // 获取promptKey,数据为item.filed的前两位
            let promptKey = item.filed.split('.')[0] + '.' + item.filed.split('.')[1];
            // promptCode,数据为item.filed的后面所有
            let promptCode = item.filed.split('.').slice(2).join('.');
            const res = await getCommonLansData({ promptKey: promptKey, promptCode: promptCode });
            console.log('res', res, item);
            if (res?.empty) {
                // 平台不存在该字段，新增
                await addCommonLansDataEvent(item);
                item.status = 2;
            } else if (res?.content?.length) {
                // 平台存在该字段，更新
                item.status = 3;
                await updateCommonLansDataEvent(item, res?.content?.[0]);
            }
        }
    }
};
// 新增数据
const addCommonLansDataEvent = async (item) => {
    item.syncStatus = 1; // 进行中
    let res = await addCommonLansData({
        "promptCode": item.filed.split('.').slice(2).join('.'),
        "promptKey": item.filed.split('.')[0] + '.' + item.filed.split('.')[1],
        "promptConfigs": {
            "zh_CN": item?.multiLanguage?.[0].value || item.label,
            "en_US": item?.multiLanguage?.[1].value || item.label,
            "ja_JP": item?.multiLanguage?.[2].value || item.label,
            "cht_CN": item?.multiLanguage?.[3].value || item.label,
            "zh_TW": item?.multiLanguage?.[4].value || item.label
        },
        "tenantId": "0",
        "zh_CN": item?.multiLanguage?.[0].value || item.label,
        "en_US": item?.multiLanguage?.[1].value || item.label,
        "ja_JP": item?.multiLanguage?.[2].value || item.label,
        "cht_CN": item?.multiLanguage?.[3].value || item.label,
        "zh_TW": item?.multiLanguage?.[4].value || item.label
    });
    console.log('addCommonLansData', res);
    if (res?.promptCode && res?.promptKey) {
        item.syncStatus = 2; // 成功
        MessagePlugin.success(`新增数据成功，Key: ${res?.promptKey}.${res?.promptCode}`);
    } else {
        item.syncStatus = 3; // 失败
        MessagePlugin.error(`新增数据失败，Key: ${res?.promptKey}.${res?.promptCode}`);
    }
}
// 更新数据
const updateCommonLansDataEvent = async (item, rawData) => {
    item.syncStatus = 1; // 进行中
    let res = await updateCommonLansData({
        ...rawData,
        "zh_CN": item?.multiLanguage?.[0].value || item.label,
        "en_US": item?.multiLanguage?.[1].value || item.label,
        "ja_JP": item?.multiLanguage?.[2].value || item.label,
        "cht_CN": item?.multiLanguage?.[3].value || item.label,
        "zh_TW": item?.multiLanguage?.[4].value || item.label,
        "promptConfigs": {
            "zh_TW": item?.multiLanguage?.[4].value || item.label,
            "cht_CN": item?.multiLanguage?.[3].value || item.label,
            "en_US": item?.multiLanguage?.[1].value || item.label,
            "zh_CN": item?.multiLanguage?.[0].value || item.label,
            "ja_JP": item?.multiLanguage?.[2].value || item.label
        }
    });
    console.log('updateCommonLansData', res);
    if (res?.promptCode && res?.promptKey) {
        item.syncStatus = 2; // 成功
        MessagePlugin.success(`更新数据成功，Key: ${res?.promptKey}.${res?.promptCode}`);
    } else {
        item.syncStatus = 3; // 失败
        MessagePlugin.error(`更新数据失败，Key: ${res?.promptKey}.${res?.promptCode}`);
    }
}

// 存入历史
const handleSaveHistory = () => {
    console.log('structureDataList', structureDataList.value);
    props.setDataStructure(structureDataList.value);
    props.saveToHistory(structureDataList.value);
}

</script>
<style lang="less">
.generate-field-modal {
    position: relative;

    .t-dialog__header .t-dialog__header-content {
        justify-content: center;
    }
}
</style>
<style scoped lang="less">
.generate-field-modal-container {
    .generate-field-header {
        display: flex;
        align-items: center;
        margin-left: 30px;
        position: relative;

        .generate-field-header-icon {
            position: absolute;
            left: calc(-50% - 50px);
            top: -200px;
        }
    }

    .generate-field-content {
        background-color: #f5f5f5;
        padding: 16px;
        margin-top: 8px;
        border-radius: 4px;
        min-height: 400px;
        max-height: 400px;
        overflow: auto;
        position: relative;

        h4 {
            margin: 0 0 10px 0;
        }
    }

    .stream-container {
        .tag-title {
            border: 1px solid #c5d7ff;
            padding: 2px 5px;
            border-radius: 20px;
            font-size: 12px;
            background-color: #dbe9ff;
            color: #0251d7;
        }
    }

    .stream-content {
        padding: 15px 0;
        //   border: 1px solid #eee;
        //   border-radius: 8px;
        line-height: 1.6;
        white-space: pre-wrap;
        /* 保留换行和空格，避免内容挤压 */
        font-size: 10px;
        color: #333;
    }

    .control-btns {
        gap: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        //   position: absolute;
        //   right: 0;
        //   top: 0;
        //   width: 100%;
        //   background-color: #fff;
        //   padding: 10px;
    }
}
</style>

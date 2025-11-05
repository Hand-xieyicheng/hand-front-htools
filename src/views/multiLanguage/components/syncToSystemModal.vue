<template>
    <div class="generate-field-modal-container">
        <t-dialog cancelBtn="终止且关闭" :closeBtn="false" :confirmBtn="null" class="generate-field-modal" width="80%"
            :onOpened="handleOpened" :visible="visible" @cancel="handleCancel">
            <template #header>
                <div class="generate-field-header">
                    <DotLottieVue class="generate-field-header-icon" autocorrect="on" style=" width: 350px"
                        resizeMode="cover" autoplay loop
                        src="https://minio.hifat.hzero.cn/hd-222/4/BUILD_AIGC_STORAGE_CODE/b76e6200f72b451e8d577e027ca28b84@aiLogo.lottie" />
                    同步至环境中
                </div>
            </template>
            <div class="generate-field-content" ref="scrollContainer">
                <t-table row-key="promptId" :data="structureDataList" :columns="structureLanColumns" :stripe="true"
                    :bordered="true" :hover="true" cell-empty-content="-" resizable lazy-load>
                    <template #operation="{ row }">
                        <div>
                            <t-loading :loading="row.status === 0" />
                            <t-tag v-show="row.status === undefined" variant="outline">待验证</t-tag>
                            <t-tag v-show="row.status === 1" theme="success" variant="outline">已存在</t-tag>
                            <t-tag v-show="row.status === 2" theme="warning" variant="outline">新字段</t-tag>
                        </div>

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
// 所有数据
const structureDataList = ref([]);

const structureLanColumns = ref([
    {
        title: '模板代码',
        colKey: 'filed',
        key: 'filed',
        width: '300px',
    },
    {
        title: '标题',
        colKey: 'label',
        key: 'label',
    },
    { colKey: 'operation', title: '同步数据', align: 'center', width: '100px' },
])
// 1. 定义接收父组件的参数（必传/可选、类型、默认值）
const props = defineProps({
    // 控制抽屉显示/隐藏（必传，双向绑定）
    visible: {
        type: Boolean,
        required: true, // 父组件必须传递该参数
        default: false
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
            item.status = 0;
            const res = await getCommonLansData({ promptKey: "hfat.common", description: item.label });
            if (res?.empty) {
                // 平台不存在该字段，跳过
                item.status = 2;
                continue;
            } else {
                // 平台存在该字段
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


// 滚动到最底部的核心方法
const scrollToBottom = (height = 0) => {
    // 确保 DOM 已挂载（scrollContainer.value 不为 null）
    if (scrollContainer.value) {
        const container = scrollContainer.value;
        // 关键：scrollTop = scrollHeight（滚动高度 = 内容总高度）
        if (height) {
            container.scrollTop = container.scrollTop + height;
        } else {
            container.scrollTop = container.scrollHeight;
        }

        // 兼容某些浏览器（可选）：强制重绘后设置
        // container.scrollTop = container.scrollHeight;
    }
};

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

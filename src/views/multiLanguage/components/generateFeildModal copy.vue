<template>
    <div class="generate-field-modal-container">
        <t-dialog class="generate-field-modal" width="80%" :onOpened="handleOpened" :visible="visible"
            :on-overlay-click="handleOverlayClick" @cancel="handleCancel">
            <template #header>
                <div class="generate-field-header">
                    <DotLottieVue class="generate-field-header-icon" autocorrect="on" style=" width: 350px"
                        resizeMode="cover" autoplay loop
                        src="https://minio.hifat.hzero.cn/hd-222/4/BUILD_AIGC_STORAGE_CODE/b76e6200f72b451e8d577e027ca28b84@aiLogo.lottie" />
                    AI生成多语言字段
                </div>
            </template>
            <div>
                <t-steps :current="currentStep" readonly>
                    <t-step-item v-for="value in stepList" :key="value.title" :title="value.title" :content="value.content" :status="value.status" />
                </t-steps>
            </div>
            <div v-if="currentStep === 0">
                <t-loading :loading="comminLangLoading">
                    <div class="generate-field-content" ref="scrollContainer">
                        <h4>获取到 {{ commonLansData?.length || 0 }} 条多语言字段</h4>
                        <t-table row-key="promptId" :data="commonLansData" :columns="commonLanColumns" :stripe="true"
                            :bordered="true" :hover="true" cell-empty-content="-" resizable lazy-load>
                        </t-table>
                    </div>
                </t-loading>
            </div>
            <div v-if="currentStep === 3">
                <div class="control-btns">
                    <t-button size="small" @click="fetchStreamData" :disabled="isLoading">
                        {{ isLoading ? '请求中...' : '开始获取流数据' }}
                    </t-button>
                    <t-button size="small" @click="abortStreamRequest" :disabled="!isLoading || !abortController">
                        终止请求
                    </t-button>
                </div>
                <div class="generate-field-content" ref="scrollContainer">
                    <div class="stream-container">
                        <span class="tag-title" v-show="reasoningContent">思考过程</span>
                        <div class="stream-content" v-html="reasoningContent"></div>
                        <span class="tag-title" v-show="streamText">最终结果</span>
                        <div class="stream-content" v-html="streamText"></div>
                    </div>
                </div>
            </div>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getCommonLansData } from '@/services/handLogin';
// 状态管理
const currentStep = ref(0)
const streamText = ref(''); // 打字机展示文本
const reasoningContent = ref(''); // 打字机展示文本
const isLoading = ref(false); // 请求状态
const abortController = ref(null); // 终止控制器
const decoder = ref(new TextDecoder('utf-8')); // 二进制流解码（处理中文）\
const comminLangLoading = ref(false); // 多语言common字段加载状态
// 多语言数据
const commonLansData = ref([]);
// 获取滚动容器 DOM 元素
const scrollContainer = ref(null);
// 步骤列表
// type StepStatus = 'default' | 'process' | 'finish' | 'error'
const stepList = ref([
    {
        title: '获取Common字段',
        content: '从Hzero平台获取Common字段',
        status: 'default',
    },
    {
        title: '数据校验',
        content: '查看平台是否存在数据',
        status: 'default',
    },
    {
        title: 'Deepseek',
        content: '调用Deepseek API',
        status: 'default',
    },
    {
        title: '数据整合',
        content: '将Deepseek返回的数据整合到平台',
        status: 'default',
    },
])
const commonLanColumns = ref([
    {
        title: '模板代码',
        colKey: 'promptKey',
        key: 'promptKey',
        width: '20%',
    },
    {
        title: '代码',
        colKey: 'promptCode',
        key: 'promptCode',
        width: '40%',
    },
    {
        title: '描述',
        colKey: 'description',
        key: 'description',
        width: '40%',
    },
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
    }
});

// 2. 定义向父组件传递事件的方法（子传父）
const emit = defineEmits(['update:visible', 'cancel', 'overlay-click']);
const handleOpened = () => {
    console.log("props.dataStructure", props.dataStructure);
    // 初始化时校验数据结构是否为空
    if (props.dataStructure.length === 0) {
        MessagePlugin.error('字段列表为空，请先输入字段列表');
        return;
    } else {
        // 否则开始进入流程
        startFullProcess();
    }
};
// 开始全流程步骤
const startFullProcess = async () => {
    // 1. 获取多语言common字段
    await getCommonLansDataList();
    // 2. 校验数据
    // 3. 调用Deepseek API
    // 4. 整合数据到平台
}
// 获取多语言common字段
const getCommonLansDataList = async () => {
    stepList.value[0].status = 'process';
    comminLangLoading.value = true;
    Promise.all([
        getCommonLansData({}),
        getCommonLansData({ promptKey: 'hzero.common' }),
    ]).then((res) => {
        if (!res[0]?.empty && !res[1]?.empty) {
            commonLansData.value = [...(res[0].content || []), ...(res[1].content || [])];
            stepList.value[0].status = 'finish';
        } else {
            stepList.value[0].status = 'error';
        } 
        comminLangLoading.value = false;
    }).catch(() => {
        comminLangLoading.value = false;
    })
}
// 点击遮罩层：通知父组件关闭抽屉（更新visible）
const handleOverlayClick = () => {
    emit('update:visible', false); // 触发双向绑定更新
};

// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
};


// 滚动到最底部的核心方法
const scrollToBottom = () => {
    // 确保 DOM 已挂载（scrollContainer.value 不为 null）
    if (scrollContainer.value) {
        const container = scrollContainer.value;
        // 关键：scrollTop = scrollHeight（滚动高度 = 内容总高度）
        container.scrollTop = container.scrollHeight;

        // 兼容某些浏览器（可选）：强制重绘后设置
        // container.scrollTop = container.scrollHeight;
    }
};

/**
 * 发起流式请求：替换 axios 为原生 fetch（更适配 SSE 流）
 */
const fetchStreamData = async () => {
    // 1. 重置状态
    streamText.value = '';
    reasoningContent.value = '';
    isLoading.value = true;
    abortController.value = new AbortController();
    const { signal } = abortController.value;

    try {
        // 2. 获取 Token 并发起请求（用 fetch 替代 axios，避免流式兼容问题）
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9099/multiLanAi/getFiledIdByAi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 携带身份令牌
            },
            body: JSON.stringify({
                chineseList: props.dataStructure ?? [],
                module: "utCase",
                system: "hfat"
            }),
            signal: signal, // 绑定终止信号
            cache: 'no-store' // 彻底禁用缓存，确保实时流
        });

        // 3. 验证响应有效性（必须是成功状态且存在流数据）
        if (!response.ok) {
            throw new Error(`后端请求失败：${response.status} ${response.statusText}`);
        }
        if (!response.body) {
            throw new Error('后端未返回流式数据');
        }

        // 4. 处理流式响应（核心：逐块读取 + 解析 SSE 格式）
        const reader = response.body.getReader(); // 获取流读取器
        while (true) {
            // 读取单个数据块（done 为 true 表示流结束）
            const { done, value } = await reader.read();
            if (done) break;

            // 5. 解码二进制流 → 字符串（解决中文乱码）
            const chunkStr = decoder.value.decode(value, { stream: true });
            // 按行分割 SSE 数据（每行一个数据单元，过滤空行）
            const lines = chunkStr.split('\n').filter(line => line.trim());

            // 6. 解析每行 SSE 数据
            for (const line of lines) {
                // SSE 格式要求：数据行以 "data: " 开头
                if (!line.startsWith('data: ')) continue;

                // 移除前缀，获取真实数据
                const dataStr = line.slice(6);

                // 7. 处理流结束标识（后端转发的 DeepSeek 结束信号）
                if (dataStr === '[DONE]') {
                    reader.releaseLock(); // 释放读取器
                    return;
                }

                // 8. 解析 JSON 数据（后端转发的 DeepSeek 内容）
                let data;
                try {
                    data = JSON.parse(dataStr);
                } catch (e) {
                    console.warn('解析流数据失败，跳过该块:', e);
                    continue; // 跳过格式错误的块，避免整体崩溃
                }

                // 9. 处理错误信息（后端返回的错误）
                if (data.error) {
                    streamText.value = `错误：${data.error}`;
                    reader.releaseLock();
                    return;
                }

                // 10. 提取内容并实现打字机效果（逐字符追加）
                const content = data.choices?.[0]?.delta?.content || '';
                const reasoning_content = data.choices?.[0]?.delta?.reasoning_content || '';
                if (content) {
                    for (const char of content) {
                        streamText.value += char;
                        // 控制打字速度（15ms/字符，可根据需求调整）
                        await new Promise(resolve => setTimeout(resolve, 10));
                        scrollToBottom(); // 新增后调用滚动
                    }
                }
                if (reasoning_content) {
                    for (const char of reasoning_content) {
                        reasoningContent.value += char;
                        // 控制打字速度（15ms/字符，可根据需求调整）
                        await new Promise(resolve => setTimeout(resolve, 5));
                        scrollToBottom(); // 新增后调用滚动
                    }
                }
            }
        }

    } catch (error) {
        // 11. 错误处理（忽略主动终止的错误）
        if (error.name !== 'AbortError') {
            streamText.value = `前端请求失败：${error.message}`;
            console.error('流式请求错误详情:', error);
        }
    } finally {
        // 12. 重置请求状态
        isLoading.value = false;
        abortController.value = null;
    }
};


/**
 * 终止流式请求（释放资源 + 提示用户）
 */
const abortStreamRequest = () => {
    if (abortController.value) {
        abortController.value.abort(); // 触发终止信号
        streamText.value += '\n（请求已手动终止）';
        isLoading.value = false; // 立即更新按钮状态
        abortController.value = null;
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

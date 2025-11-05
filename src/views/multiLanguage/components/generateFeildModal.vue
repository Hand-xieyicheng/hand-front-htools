<template>
    <div class="generate-field-modal-container">
        <t-dialog cancelBtn="终止且关闭" :closeBtn="false" :confirmBtn="null" class="generate-field-modal" width="80%" :onOpened="handleOpened" :visible="visible"
             @cancel="handleCancel">
            <template #header>
                <div class="generate-field-header">
                    <DotLottieVue class="generate-field-header-icon" autocorrect="on" style=" width: 350px"
                        resizeMode="cover" autoplay loop
                        src="https://minio.hifat.hzero.cn/hd-222/4/BUILD_AIGC_STORAGE_CODE/b76e6200f72b451e8d577e027ca28b84@aiLogo.lottie" />
                    AI生成{{ generateType === "generateId" ? "多语言字段" : generateType === "generateTranslate" ? "多语言翻译" : "多语言字段及翻译" }}
                </div>
            </template>
            <div>
                <t-steps :current="currentStep" readonly>
                    <t-step-item v-for="value in stepList" :key="value.title" :title="value.title"
                        :content="value.content" :status="value.status" />
                </t-steps>
            </div>
            <div v-if="currentStep === 0">
                <t-loading :loading="comminLangLoading">
                    <div class="generate-field-content" ref="scrollContainer">
                        <t-table row-key="promptId" :data="structureDataList" :columns="structureLanColumns"
                            :stripe="true" :bordered="true" :hover="true" cell-empty-content="-" resizable lazy-load>
                            <template #operation="{ row }">
                                <div>
                                    <t-loading :loading="row.status === 0" />
                                    <t-tag v-show="row.status === undefined" variant="outline">待验证</t-tag>
                                    <t-tag v-show="row.status === 1" theme="success" variant="outline">已存在</t-tag>
                                    <t-tag v-show="row.status === 2" theme="warning" variant="outline">新字段</t-tag>
                                    <!-- <check-double-icon v-if="row.status === 1" :fill-color='"transparent"' :stroke-color='"currentColor"' :stroke-width="2"/> -->
                                </div>

                            </template>
                        </t-table>
                    </div>
                </t-loading>
            </div>
            <div v-if="currentStep === 1">
                <div class="control-btns">
                    <t-button size="small" @click="callDeepseekAPI" :disabled="isLoading">
                        {{ isLoading ? '请求中...' : 'AI一下' }}
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
            <div v-if="currentStep === 2">
                <div style="text-align: center;" class="generate-field-content" ref="scrollContainer">
                    <DotLottieVue autocorrect="on" style="height: 250px; width: 100%" resizeMode="cover" autoplay loop
                        src="http://172.22.4.113:9000/hd-555/4/MINIO1/62fb1c3977894d49b3b5f95bd8fe448c@rocketMan.lottie" />
                    <h4>数据处理中</h4>
                </div>
            </div>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getCommonLansData } from '@/services/handLogin';
// 状态管理
const currentStep = ref(0); // 当前步骤索引
const streamText = ref(''); // 打字机展示文本
const reasoningContent = ref(''); // 打字机展示文本
const isLoading = ref(false); // 请求状态
const abortController = ref(null); // 终止控制器
const decoder = ref(new TextDecoder('utf-8')); // 二进制流解码（处理中文）\
const comminLangLoading = ref(false); // 多语言common字段加载状态
// 所有数据
const structureDataList = ref([]);
// 获取滚动容器 DOM 元素
const scrollContainer = ref(null);
// 步骤列表
// type StepStatus = 'default' | 'process' | 'finish' | 'error'
const stepList = ref([{
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
    title: '数据处理',
    content: '处理将Deepseek返回的数据',
    status: 'default',
},
])
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
    { colKey: 'operation', title: '验证数据', align: 'center', width: '100px' },
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
    // 生成类型（可选，有默认值）
    generateType: {
        type: String,
        required: false,
        default: 'generateId'
    },
    // 抽屉标题（可选，有默认值）
    title: {
        type: String,
        required: false,
        default: '标题名称'
    },
    setDataStructure: {
        type: Function,
        required: true, // 父组件必须传递该参数
        default: () => {}
    }
});

// 2. 定义向父组件传递事件的方法（子传父）
const emit = defineEmits(['update:visible', 'cancel', 'overlay-click']);
const handleOpened = () => {
    structureDataList.value = JSON.parse(JSON.stringify(props.dataStructure));
    console.log("props.dataStructure", props.dataStructure);
    currentStep.value = 0;
    stepList.value.forEach(item => item.status = 'default');
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
    // 2. 校验数据
    await validateLansData();
    // 3. 调用Deepseek API
    currentStep.value = 1;
    await callDeepseekAPI();
}
// 校验数据
const validateLansData = async () => {
    stepList.value[0].status = 'process';
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
        console.log("structureDataList.value", structureDataList.value);
        stepList.value[0].status = 'finish';
    }
}

// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    // 终止ai进程
    if (abortController.value) {
        abortController.value.abort();
    }
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

/**
 * 发起流式请求：替换 axios 为原生 fetch（更适配 SSE 流）
 */
const callDeepseekAPI = async () => {
    // 1. 重置状态
    streamText.value = '';
    reasoningContent.value = '';
    isLoading.value = true;
    abortController.value = new AbortController();
    const { signal } = abortController.value;

    try {
        // 2. 获取 Token 并发起请求（用 fetch 替代 axios，避免流式兼容问题）
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9099/multiLanAi/getFiledIdOrTranslateByAi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 携带身份令牌
            },
            body: JSON.stringify({
                // 过滤出filed为空或不包含hzero.common或不包含hfat.common的字段
                chineseList: structureDataList.value.filter(item => !item.filed || (item.filed.indexOf('hzero.common') === -1 && item.filed.indexOf('hfat.common') === -1)) ?? [],
                module: "utCase",
                system: "hfat",
                generateType: props.generateType
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
            // 如果返回的字符中包含“认证错误”，则直接返回
            if (chunkStr.includes('认证错误')) {
                MessagePlugin.error('认证失败，请重新登录');
                // 终止ai进程
                abortController.value.abort();
                // 关闭抽屉
                emit('update:visible', false);
    location.href = 'http://localhost:8080/login?redirect=' + location.href
                return;
            }
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
                    // 9. 处理流结束，处理最终数据
                    try {
                        console.log('最终数据:', streamText.value);
                        // 11. 解析最终数据为 JSON 格式
                        const finalData = JSON.parse(streamText.value);
                        if (finalData?.length) {
                            // 将finalData中对应filedId的值赋值给structureDataList中相同filedId的filed字段
                            // step设置为2
                            stepList.value[1].status = 'success';
                            currentStep.value = 2;
                            finalData.forEach(item => {
                                const index = structureDataList.value.findIndex(i => i.filedId === item.filedId);
                                if (index !== -1) {
                                    structureDataList.value[index] = item;
                                }
                            })
                            props.setDataStructure(structureDataList.value);
                        }
                        // 12. 关闭弹窗
                        setTimeout(() => {
                            stepList.value[2].status = 'success';
                            emit('update:visible', false);
                            emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
                        }, 2000);
                        break; // 跳出循环，结束流处理
                    } catch (e) {
                        stepList.value[1].status = 'error';
                        console.warn('解析最终数据失败:', e);
                    }
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
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
        justify-content: center;

        .generate-field-header-icon {
            position: absolute;
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

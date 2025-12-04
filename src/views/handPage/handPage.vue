<template>
    <div class="hand-page-container">
        <div class="page-header-box">
            <h2 class="page-header-title">Hand Admin 账户维护
                <div class="custom-alert-info">请使用 Admin 账户登陆</div>
            </h2>
        </div>

        <t-row :gutter="24" class="env-card-row">
            <t-col :span="4" v-for="envItem in envListWithColor" :key="envItem.value">
                <div v-if="handAuthStore.envData[envItem.value]" class="env-data-wrapper">
                    <t-card :title="envItem.label" :bordered="true" :shadow="true"
                        :class="['env-maintenance-card', envItem.themeClass, { 'env-maintenance-card-active': selectedEnv === envItem.value }]"
                        @click="handleSelectEnv(envItem.value)">
                        
                        <template #actions>
                            <t-tag v-if="selectedEnv === envItem.value" size="small" shape="mark" :theme="envItem.tagTheme">当前选中</t-tag>
                            <t-tag v-else size="small" shape="mark" theme="default">未选中</t-tag>
                        </template>

                        <div class="env-info-header">
                            <img :src="envItem.img" :alt="envItem.label" class="env-logo" />
                            <p class="env-link">{{ envItem.link }}</p>
                        </div>

                        <t-divider dashed></t-divider>

                        <div class="hand-auth-token-box">
                            <h4 class="box-title">TOKEN 信息</h4>
                            <p>
                                <span class="label">剩余有效时间:</span>
                                <span class="value">{{ formatRemainingTime(handAuthStore.envData[envItem.value].leftValidTime) }}</span>
                            </p>
                            <p class="token-line">
                                <span class="label">TOKEN:</span>
                                <span class="value token-content">{{ handAuthStore.envData[envItem.value].handAuth.access_token || '-' }}</span>
                            </p>
                            <p class="token-line">
                                <span class="label">REFRESH TOKEN:</span>
                                <span class="value token-content">{{ handAuthStore.envData[envItem.value].handAuth.refresh_token || '-' }}</span>
                            </p>
                        </div>

                        <t-divider dashed></t-divider>

                        <div class="hand-auth-token-box">
                            <h4 class="box-title">用户信息</h4>
                            <p>
                                <span class="label">用户名:</span>
                                <span class="value">{{ handAuthStore.envData[envItem.value].handSelfData.realName || '无' }}</span>
                            </p>
                            <p>
                                <span class="label">用户角色:</span>
                                <span class="value">{{ handAuthStore.envData[envItem.value].handSelfData.currentRoleName || '无' }}</span>
                            </p>
                            <p>
                                <span class="label">登陆账号:</span>
                                <span class="value">{{ handAuthStore.envData[envItem.value].handSelfData.loginName || '无' }}</span>
                            </p>
                            <p>
                                <span class="label">email:</span>
                                <span class="value">{{ handAuthStore.envData[envItem.value].handSelfData.email || '无' }}</span>
                            </p>
                        </div>

                        <template #footer>
                            <div class="hand-auth-button-options">
                                <t-button :theme="envItem.tagTheme" variant="text" @click.stop="handLogoutHand(envItem.value)">退出登陆</t-button>
                                <t-button :theme="envItem.tagTheme" @click.stop="handLoginHand(envItem.value)">跳转登陆</t-button>
                            </div>
                        </template>
                    </t-card>
                </div>
            </t-col>
        </t-row>
        
        <div class="global-button-options">
            <t-button size="medium" theme="primary" @click="handleCheckEnvToken(selectedEnv)">验证登陆</t-button>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
// 假设以下依赖和路径正确
import { useHandAuthStore } from '@/stores/handLogin'; 
import defaultLogo from '@/assets/113_logo.png'; 
import moment from 'moment';
import { MessagePlugin } from 'tdesign-vue-next'; 

const handAuthStore = useHandAuthStore();

// 页面加载后，初始化所有环境的定时器（确保已登录环境的时间开始走动）
onMounted(() => {
    // 遍历所有环境，启动它们的计时器
    Object.keys(handAuthStore.envData).forEach(env => {
        // 只有当环境中有 token 信息时才启动 timer
        if (handAuthStore.envData[env].handAuth.expires_in) {
            handAuthStore.startTimer(env);
            // 首次加载时，尝试获取当前环境的用户信息
            if (env === selectedEnv.value) {
                // 不带提示，静默获取
                handAuthStore.getUserInfo(env); 
            }
        }
    });
})

// 原始环境列表数据，新增颜色和主题类名
const envListBase = [
    {
        label: '113 环境',
        value: '113',
        link: 'http://xhi-api-dev.hand-china.com',
        img: 'http://172.22.4.113:9000/hd-public/hpfm05/0/BUILD_AIGC_STORAGE_CODE/37a79fb165b94f3cba033b0ee0bc4299@%E6%B1%89%E5%BE%97logo%E7%99%BD%E5%BA%95.png',
        themeClass: 'theme-113',
        tagTheme: 'warning', 
    },
    {
        label: 'POC 环境',
        value: 'poc',
        link: 'https://gw.poc.hzero.jp',
        img: 'https://minio.poc.hzero.jp/hz-public/hpfm05/0/DEFAULT/5773fa32cfe043ada7f1a7905d25e766@hzero.png',
        themeClass: 'theme-poc',
        tagTheme: 'success', 
    },
    {
    
        label: 'GBG POC',
        value: 'gbg',
        link: 'https://gbgpoc-api.zenlead-global.com',
        img: defaultLogo,
        themeClass: 'theme-gbg',
        tagTheme: 'primary', 
    }
]
const envListWithColor = ref(envListBase);

// 当前选中的环境，从 Store 中获取初始值
const selectedEnv = ref(handAuthStore.handEnv || '113');

/**
 * 选中环境卡片，并设置 Store 的当前环境和环境链接。
 * @param {string} env - 环境标识符
 */
const handleSelectEnv = (env) => {
    selectedEnv.value = env;
    const envData = envListWithColor.value.find(item => item.value === env);
    if (!envData) return;
    
    // 更新 Store 的当前环境和链接
    handAuthStore.setHandEnv(env);
    handAuthStore.setHandEnvLink(env, envData.link);
    
    MessagePlugin.success(`已切换环境至：${envData.label}`);
}

/**
 * 跳转到对应环境的登陆页。
 * @param {string} env - 环境标识符
 */
const handLoginHand = async (env) => {
    // 确保选中当前环境，并更新 Store
    handleSelectEnv(env); 

    const envLink = envListWithColor.value.find(item => item.value === env)?.link || '';
    if (!envLink) {
         MessagePlugin.error('环境链接未找到，无法跳转！');
         return;
    }
    
    // 需先设置环境链接到 Store
    handAuthStore.setHandEnvLink(env, envLink);

    // 完整的跳转 URL
    const redirectUri = `http://localhost:5173/handPage?redirectUrlIdentifies=c81e728d9d4c2f636f067f89cc14862c`;
    const authUrl = `${envLink}/oauth/oauth/authorize?response_type=token&client_id=localhost&redirect_uri=${encodeURIComponent(redirectUri)}&env=${env}`;

    window.location.href = authUrl;
}

/**
 * 退出指定环境的登陆状态。
 * @param {string} env - 环境标识符
 */
const handLogoutHand = async (env) => {
    const label = envListWithColor.value.find(item => item.value === env)?.label || env;
    
    // 调用 Store 的清除操作，并传入环境标识符
    handAuthStore.clearHandAuth(env); 
    
    MessagePlugin.success(`已清除 ${label} 的登陆状态！`);
}

/**
 * 验证当前选中环境的登陆信息是否有效。
 * @param {string} env - 环境标识符
 */
const handleCheckEnvToken = (env) => {
    // 调用 Store 的获取用户信息操作，并传入环境标识符
    handAuthStore.getUserInfo(env, '验证通过，用户信息有效', '验证失败，请重新登陆');
}


/**
 * 格式化剩余时间
 * @param {number} seconds - 剩余秒数
 */
const formatRemainingTime = (seconds) => {
    if (!seconds || seconds <= 0) return '0 小时 0 分 0 秒';

    const duration = moment.duration(seconds, 'seconds');

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const secs = duration.seconds();

    return `${hours} 小时 ${minutes} 分 ${secs} 秒`;
}
</script>

<style scoped lang="less">
// 解决 Less 编译错误的颜色定义，使用固定的颜色值进行计算
@td-warning: #ffaa00; 
@td-success: #00a870; 
@td-primary: #0052d9; 

// 基础颜色混合 (Mixin)：用于在 Less 编译时计算出主题的浅色背景和阴影
.color-theme-base(@color) {
    --card-theme-color: @color;                     // 主题色 CSS 变量
    --card-bg-light: fade(@color, 8%);              // 浅色背景 (Less 计算)
    --card-shadow-hover: fade(@color, 15%);         // 阴影颜色 (Less 计算)
    --card-border-active: @color;                   // 边框激活色 CSS 变量
}

// 三个主题卡片的颜色定义
.theme-113 {
    .color-theme-base(@td-warning); 
}
.theme-poc {
    .color-theme-base(@td-success);
}
.theme-gbg {
    .color-theme-base(@td-primary);
}


.hand-page-container {
    padding: 24px;
    background-color: var(--td-bg-color-container-light);

    .page-header-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        .page-header-title {
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;

            .custom-alert-info {
                font-size: 14px;
                color: var(--td-text-color-placeholder);
                margin-left: 16px;
                padding: 4px 8px;
                border-radius: 4px;
                background-color: var(--td-bg-color-secondarycontainer);
            }
        }
    }

    .global-button-options {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
    }

    .env-card-row {
        margin-top: 16px;
    }

    // 单个环境卡片样式
    .env-maintenance-card {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); // 平滑动画曲线
        border: 2px solid var(--td-component-stroke);
        transform: translateY(0); // 启用硬件加速

        &:hover {
            border-color: var(--card-theme-color);
            box-shadow: 0 8px 20px var(--card-shadow-hover);
            transform: translateY(-4px); // 向上轻微抬升动画
        }
        
        // 选中状态
        &.env-maintenance-card-active {
            border-color: var(--card-border-active);
            background-color: var(--card-bg-light);
            box-shadow: 0 4px 15px var(--card-shadow-hover);
            transform: scale(1.01); // 轻微放大

            .t-card__title, .box-title {
                color: var(--card-theme-color);
            }
            .env-link {
                color: var(--card-border-active);
                font-weight: 500;
            }
        }
        
        // 卡片头部环境信息
        .env-info-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 8px;

            .env-logo {
                width: 60px;
                height: 60px;
                object-fit: contain;
                margin-bottom: 8px;
                border-radius: 50%;
                background-color: #fff;
                border: 1px solid var(--td-component-stroke);
                transition: transform 0.3s ease;
            }

            // 选中时 Logo 动画
            &.env-maintenance-card-active .env-logo {
                transform: scale(1.1);
            }

            .env-link {
                font-size: 13px;
                color: var(--td-text-color-placeholder);
                word-break: break-all;
                text-align: center;
                transition: color 0.3s;
            }
        }

        // TOKEN/用户信息框
        .hand-auth-token-box {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .box-title {
                font-size: 15px;
                font-weight: 600;
                color: var(--td-text-color-primary);
                margin: 0 0 4px 0;
                // 使用 CSS 变量作为分隔线颜色
                border-left: 3px solid var(--card-theme-color); 
                padding-left: 8px;
            }

            p {
                display: flex;
                font-size: 13px;
                margin: 0;

                .label {
                    color: var(--td-text-color-secondary);
                    min-width: 110px;
                    flex-shrink: 0;
                }

                .value {
                    color: var(--td-text-color-primary);
                    word-break: break-all;
                    flex-grow: 1;
                }
            }
            
            // 对较长的 token 内容进行特殊处理
            .token-line {
                .token-content {
                    font-family: monospace;
                    font-size: 12px;
                    max-height: 4.5em; 
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    user-select: none;
                }
            }
        }

        // 卡片底部按钮
        .hand-auth-button-options {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            width: 100%;
        }
    }
}
</style>
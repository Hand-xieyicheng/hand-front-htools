<template>
    <div class="hand-page-container">
        <div class="page-header-box">
            <h2 class="page-header-title">Hand账户维护
                <div class="custom-alert-info">请使用 Admin 账户登陆</div>
            </h2>
        </div>

        <div class="env-card-box">
            <t-row :gutter="16" class="env-card-row">
                <t-col :span="4" v-for="(envItem, index) in handAuthNewStore.envList" :key="envItem.value">
                    <t-loading :loading="envItem.loading" size="small" class="loading-spinner">
                    <div class="env-data-wrapper">
                        <t-card :class="{ [`theme-${index}`]: envItem.active }" :title="envItem.env_name"
                            :bordered="true" :shadow="true" class="env-maintenance-card env-maintenance-card-active">
                            <template #actions>
                                <t-space>
                                    <t-tag size="small" theme="primary" variant="outline">{{ envItem?.env_code || '无'
                                    }}</t-tag>
                                    <t-tag v-if="envItem.active" size="small" theme="success"
                                        variant="outline">激活</t-tag>
                                    <t-tag v-else size="small" theme="default" variant="outline">未激活</t-tag>
                                </t-space>
                            </template>

                            <div class="env-info-header">
                                <t-avatar v-if="envItem.env_img_url" shape="round" size="100px" :image="envItem.env_img_url"> </t-avatar>
                                <t-avatar v-else shape="round" size="100px"> {{ envItem.env_name?.[0] || '无' }}
                                </t-avatar>
                                <p class="env-link">{{ envItem.login_url }}</p>
                                <p class="env-link">{{ envItem.remark }}</p>
                            </div>

                            <t-divider dashed></t-divider>

                            <div class="hand-auth-token-box">
                                <h4 class="box-title">TOKEN 信息</h4>
                                <p class="token-line">
                                    <span class="label">TOKEN:</span>
                                    <span class="value token-content">{{ envItem?.access_token || '-' }}</span>
                                </p>
                                <p class="token-line">
                                    <span class="label">REFRESH TOKEN:</span>
                                    <span class="value token-content">{{ envItem?.refresh_token || '-' }}</span>
                                </p>
                            </div>

                            <t-divider dashed></t-divider>

                            <div class="hand-auth-token-box">
                                <h4 class="box-title">用户信息</h4>
                                <p>
                                    <span class="label">用户名:</span>
                                    <span class="value">{{ envItem?.selfData?.realName || '无' }}</span>
                                </p>
                                <p>
                                    <span class="label">用户角色:</span>
                                    <span class="value">{{ envItem?.selfData?.currentRoleName || '无' }}</span>
                                </p>
                                <p>
                                    <span class="label">登陆账号:</span>
                                    <span class="value">{{ envItem?.selfData?.loginName || '无' }}</span>
                                </p>
                                <p>
                                    <span class="label">email:</span>
                                    <span class="value">{{ envItem?.selfData?.email || '无' }}</span>
                                </p>
                            </div>

                            <template #footer>
                                <div class="hand-auth-button-options">
                                    <t-button :disabled="envItem.loading || !envItem.access_token" size="small" theme="secondary"
                                        @click.stop="handLogoutHand(envItem)">退出登陆</t-button>
                                    <t-button size="small" theme="warning"
                                        @click.stop="handLoginHand(envItem)">跳转登陆</t-button>
                                    <t-button :disabled="envItem.loading || !envItem.access_token" size="small" theme="primary"
                                        @click="handleCheckEnvToken(envItem)">验证登陆</t-button>
                                </div>
                            </template>
                        </t-card>
                    </div>
                    </t-loading>
                    <t-button v-if="envItem.loading" class="cancel-btn" size="small" @click="envItem.loading = false">取消加载</t-button>
                </t-col>
            </t-row>
        </div>



    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
// 假设以下依赖和路径正确
import { useHandAuthStoreNew } from '@/stores/handLoginNew';
import defaultLogo from '@/assets/113_logo.png';
import moment from 'moment';
import { MessagePlugin } from 'tdesign-vue-next';
const handAuthNewStore = useHandAuthStoreNew();

// 页面加载后，初始化所有环境的定时器（确保已登录环境的时间开始走动）
onMounted(() => {
    getEnvList();
})
/**
 * 获取环境列表
 */
const getEnvList = async () => {
    try {
        await handAuthNewStore.getEnvList();
    } catch (error) {
        MessagePlugin.error('获取环境列表失败，请稍后重试！');
    }
}
/**
 * 跳转到对应环境的登陆页。
 * @param {string} env - 环境标识符
 */
const handLoginHand = async (envItem) => {

    const envLink = envItem.login_url || '';
    if (!envLink) {
        MessagePlugin.error('环境链接未找到，无法跳转！');
        return;
    }
    // 完整的跳转 URL
    const redirectUri = import.meta.env.VITE_APP_HTOOLS_BASE_URL + `/handPageNew?redirectUrlIdentifies=c81e728d9d4c2f636f067f89cc14862c&env=${envItem.id}`;
    const authUrl = `${envLink}/oauth/oauth/authorize?response_type=token&client_id=localhost&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
}

/**
 * 退出指定环境的登陆状态。
 * @param {string} envItem - 环境标识符
 */
const handLogoutHand = async (envItem) => {
    handAuthNewStore.setCurrentEnv(envItem.id);
    handAuthNewStore.clearCurrentAuth();
    MessagePlugin.success(`已清除 ${envItem.env_name} 的登陆状态！`);
}

/**
 * 验证当前选中环境的登陆信息是否有效。
 * @param {string} envItem - 环境标识符
 */
const handleCheckEnvToken = (envItem) => {
    // 调用 Store 的获取用户信息操作，并传入环境标识符
    handAuthNewStore.getUserInfo(envItem, '验证通过，用户信息有效', '验证失败，请重新登陆');
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
    --card-theme-color: @color; // 主题色 CSS 变量
    --card-bg-light: fade(@color, 8%); // 浅色背景 (Less 计算)
    --card-shadow-hover: fade(@color, 15%); // 阴影颜色 (Less 计算)
    --card-border-active: @color; // 边框激活色 CSS 变量
}

// 三个主题卡片的颜色定义
.theme-0 {
    .color-theme-base(@td-warning);
}

.theme-1 {
    .color-theme-base(@td-success);
}

.theme-2 {
    .color-theme-base(@td-primary);
}


.hand-page-container {

    .global-button-options {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
    }

    .env-card-box {
        padding: 16px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 1400px;
        margin: 50px auto 0 auto;
        position: relative;
        .cancel-btn {
            position: absolute;
            top: calc(50% + 20px);
            left: calc(50% - 30px);
            z-index: 3501;
        }
    }

    // 单个环境卡片样式
    .env-maintenance-card {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); // 平滑动画曲线
        border: 1px dashed var(--td-component-stroke);
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

            .t-card__title,
            .box-title {
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
<template>
    <div class="system-info-container">
        <!-- 页面标题 -->
        <div class="page-header-box">
            <h2 class="page-header-title">系统信息</h2>
        </div>
        <div class="page-content-box">
            <div class="info-grid">
                <!-- 基础系统信息卡片 -->
                <t-card class="info-card" title="基础系统信息" shadow="hover">
                    <div class="info-list">
                        版本：v0.0.3
                    </div>
                     <div class="info-list">
                        gitHub 仓库：<a href="https://github.com/Hand-xieyicheng/hand-front-auth" target="_blank">hand-front-auth</a>
                    </div>
                </t-card>

                <!-- Deepseek 用量信息卡片 -->
                <t-card class="info-card" shadow="hover">
                    <template #title>
                        <div class="quota-header">
                            <img src="@/assets/deepseek.png" width="24" height="24" alt="Deepseek 图标"
                                class="quota-icon" />
                            <span class="quota-title">Deepseek 用量统计</span>
                            <t-tag type="info" size="small" class="quota-tag"
                                :theme="deepseekQuota.is_available ? 'success' : 'danger'">
                                {{ deepseekQuota.is_available ? '可用' : '已用完' }}
                            </t-tag>
                            <t-button type="primary" variant="text" size="small" class="quota-refresh-btn" @click="refreshQuota">
                                <template #icon><refresh-icon /></template>
                                刷新
                            </t-button>
                        </div>
                    </template>
                    <div class="quota-stats">
                        <!-- 本月调用次数 -->
                        <div class="quota-item">
                            <t-icon name="currency-exchange" class="quota-icon" />
                            <div class="quota-label">货币</div>
                            <div class="quota-value">{{ deepseekQuota?.currency || '-' }}</div>
                        </div>
                        <div class="quota-item">
                            <t-icon name="wallet" class="quota-icon" />
                            <div class="quota-label">赠金余额</div>
                            <div class="quota-value">{{ deepseekQuota?.granted_balance || '-' }}</div>
                        </div>
                        <div class="quota-item">
                            <t-icon name="money" class="quota-icon" />
                            <div class="quota-label">充值余额</div>
                            <div class="quota-value">{{ deepseekQuota?.topped_up_balance || '-' }}</div>
                        </div>
                        <div class="quota-item">
                            <t-icon name="money" class="quota-icon" />
                            <div class="quota-label">总余额</div>
                            <div class="quota-value"
                                :style="{ 'color': deepseekQuota?.total_balance > 0 ? '#07a061' : '#ff4d2f' }">{{
                                    deepseekQuota?.total_balance || '-' }}</div>
                        </div>
                    </div>
                    <!-- <t-progress :percentage="50" /> -->
                    <!-- <div class="quota-footer">
                    <t-info-item label="最近调用时间" :value="deepseekQuota.lastCallTime" size="small" class="info-item">
                        <template #prefix><t-icon name="time" class="info-icon small-icon" /></template>
                    </t-info-item>
                    <t-info-item label="额度重置时间" :value="deepseekQuota.quotaResetTime" size="small" class="info-item">
                        <template #prefix><t-icon name="calendar" class="info-icon small-icon" /></template>
                    </t-info-item>
                </div> -->
                </t-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMainStore } from '@/stores/main';
import { RefreshIcon } from 'tdesign-icons-vue-next';
const mainStore = useMainStore();
onMounted(() => {
    mainStore.getCurrentBalance();
});
// 系统基础信息
const systemInfo = ref({
    version: 'v2.3.1',
    buildTime: '2025-10-28 15:30:45',
    environment: 'production',
    framework: 'Vue 3.4 + TDesign 1.12',
    lastUpdate: '2025-11-05 09:12:33',
});

// Deepseek 用量信息
const deepseekQuota = computed(() => mainStore?.balanceInfos || {});

// 刷新 Deepseek 用量
const refreshQuota = () => {
    mainStore.getCurrentBalance(true, "数据刷新成功");
};
</script>

<style scoped lang="less">
// 基础变量（基于 TDesign 原生变量，使用 var() 格式）
@page-padding: 32px;
@grid-gap: 28px;
@card-radius: 12px;
@card-padding: 24px;
@card-hover-offset: -5px;
@card-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
@card-hover-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
@item-gap: 20px;
@primary-color: var(--td-primary-color);
@success-color: var(--td-success-color);
@warning-color: var(--td-warning-color);
@danger-color: var(--td-danger-color);
@text-primary: var(--td-text-color-primary);
@text-secondary: var(--td-text-color-secondary);
@text-tertiary: var(--td-text-color-tertiary);
@border-color: var(--td-border-color);
@bg-light: var(--td-bg-color-container);
@bg-hover: var(--td-bg-color-hover);

// 页面基础样式
.system-info-container {
    h4 {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        padding: 0 0 10px 0;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;

        :deep(.t-button .t-icon+.t-button__text:not(:empty)) {
            margin-left: 4px !important;
        }

    }
}

// 页面标题
.page-header {
    .t-page-header__title {
        font-size: 24px;
        font-weight: 600;
        color: @text-primary;
        margin-bottom: 4px;
    }

    .t-page-header__subtitle {
        font-size: 15px;
        color: @text-secondary;
        opacity: 0.9;
    }
}

// 网格布局
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(620px, 1fr));
    gap: @grid-gap;
}

// 卡片样式
.info-card {
    border-radius: @card-radius;
    padding: @card-padding;
    box-shadow: @card-shadow;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: white;

    &:hover {
        transform: translateY(@card-hover-offset);
        box-shadow: @card-hover-shadow;
    }

    .t-card__header {
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--td-border-color-light);

        .t-card__title {
            font-size: 18px;
            font-weight: 600;
            color: @text-primary;
            display: flex;
            align-items: center;

            &::before {
                content: '';
                display: inline-block;
                width: 4px;
                height: 20px;
                border-radius: 2px;
                background-color: @primary-color;
                margin-right: 8px;
            }
        }
    }
}

// 信息项样式
.info-item {
    .t-info-item__label {
        font-size: 14px;
        color: @text-secondary;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .t-info-item__value {
        font-size: 15px;
        color: @text-primary;
        transition: color 0.2s;

        &:hover {
            color: @primary-color;
            cursor: default;
        }
    }

    // 可复制文本 hover 效果
    &.t-info-item--copyable:hover .t-info-item__value {
        color: @primary-color;
    }
}

// 信息项图标
.info-icon {
    font-size: 16px;
    color: @primary-color;
    transition: color 0.2s;

    .info-item:hover & {
        color: var(--td-primary-color-dark);
    }

    &.small-icon {
        font-size: 14px;
    }
}

// 通用列表布局
.info-list,
.developer-details,
.env-config {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: @item-gap;
}

.quota-header {
    display: flex;
    align-items: center;
    gap: 12px;

    img {
        width: 24px;
        height: 24px;
        margin-bottom: 0;
    }
}

// Deepseek 用量统计
.quota-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 20px;
    text-align: center;
}

.quota-item {
    padding: 16px;
    border-radius: 8px;
    background-color: @bg-hover;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.02);
    }
}

.quota-icon {
    font-size: 24px;
    color: @primary-color;
    margin-bottom: 8px;
    display: inline-block;
}

.quota-label {
    font-size: 14px;
    color: @text-secondary;
    margin-bottom: 8px;
    display: block;
}

.quota-value {
    font-size: 22px;
    font-weight: 600;
    color: @primary-color;
    line-height: 1.2;
}

.quota-progress {
    margin-bottom: 16px;
    --td-progress-height: 8px;
    --td-progress-radius: 4px;
}

.quota-footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 8px;
}


// 响应式适配
@media (max-width: 1366px) {
    .info-grid {
        grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
    }
}

@media (max-width: 768px) {
    @page-padding: 20px;
    @grid-gap: 20px;
    @card-padding: 18px;

    .info-grid {
        grid-template-columns: 1fr;
    }

    .info-list,
    .developer-details,
    .env-config,
    .quota-stats {
        grid-template-columns: 1fr;
    }


}
</style>
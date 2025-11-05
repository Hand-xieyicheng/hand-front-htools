<template>
    <div class="hand-page-container">

        <div class="page-header-box">
            <h2 class="page-header-title">Hand Admin账户维护</h2>
            <div class="page-header-button-options">
                <t-button size="small" theme="primary" @click="handAuthStore.getUserInfo('验证通过', '验证失败，请重新登陆'
                    )">验证登陆</t-button>
            </div>
        </div>
        <div class="page-content-box">
            <t-space style="width: 100%">
                <t-alert theme="info" title="请使用Admin账户登陆" message="系统将会使用到【值集配置】、【平台多语言】等功能，请确保使用admin账户登陆。" close-btn>
                    <!-- <template #operation>
                        <span @click="handleOperation">相关操作</span>
                    </template> -->
                </t-alert>
            </t-space>
            <div class="env-list-card">
                <div @click="handleSelectEnv(item.link)" v-for="item in envList" :key="item.value"
                    class="env-list-card-item 113-env-card"
                    :class="{ 'env-list-card-item-active': selectedEnv === item.link }">
                    <t-tag v-if="selectedEnv === item.link" class="env-list-card-item-tag" shape="mark" theme="primary">当前选中</t-tag>
                    <div class="env-list-card-item-logo">
                        <img :src="item.img" alt="">
                    </div>
                    <div class="env-list-card-item-content">
                        <h3>{{ item.label }}</h3>
                        <p>{{ item.link }}</p>
                    </div>
                </div>
            </div>
            <div class="hand-auth-button-options">
                <t-button theme="secondary" @click="handLogoutHand">退出登陆</t-button>
                <t-button @click="handLoginHand">跳转登陆</t-button>
            </div>
            <div class="hand-auth-token-box">
                <h4>当前登陆账户TOKEN信息</h4>
                <p>
                    <span>剩余有效时间:</span>
                    <span>{{ formatRemainingTime(handAuthStore.leftValidTime) }}</span>
                </p>
                <p>
                    <span>TOKEN:</span>
                    <span>{{ handAuthStore?.handAuth?.access_token || '-' }}</span>
                </p>
                <p>
                    <span>REFRESH TOKEN:</span>
                    <span>{{ handAuthStore?.handAuth?.refresh_token || '-' }}</span>
                </p>
            </div>
            <div class="hand-auth-token-box">
                <h4>用户信息:</h4>
                <p>
                    <span>LOGO:</span>
                    <span><img :src="handAuthStore?.handSelfData?.logo" style="background-color: black;" width="50px"
                            alt="" sizes="" srcset=""></span>
                </p>
                <p>
                    <span>用户名:</span>
                    <span>{{ handAuthStore?.handSelfData?.realName || '无' }}</span>
                </p>
                <p>
                    <span>用户角色:</span>
                    <span>{{ handAuthStore?.handSelfData?.currentRoleName || '无' }}</span>
                </p>
                <p>
                    <span>登陆账号:</span>
                    <span>{{ handAuthStore?.handSelfData?.loginName || '无' }}</span>
                </p>
                <p>
                    <span>email:</span>
                    <span>{{ handAuthStore?.handSelfData?.email || '无' }}</span>
                </p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useHandAuthStore } from '@/stores/handLogin';
import defaultLogo from '@/assets/113_logo.png';
import moment from 'moment';
const handAuthStore = useHandAuthStore();
onMounted(() => {
    handAuthStore?.clearTimer?.();
    handAuthStore?.startTimer?.();
    // 获取用户数据
    handAuthStore?.getUserInfo?.();
})
onUnmounted(() => {
    handAuthStore?.clearTimer?.();
})
const envList = [
    {
        label: '113环境',
        value: '113',
        link: 'http://xhi-api-dev.hand-china.com',
        img: 'http://172.22.4.113:9000/hd-public/hpfm05/0/BUILD_AIGC_STORAGE_CODE/37a79fb165b94f3cba033b0ee0bc4299@%E6%B1%89%E5%BE%97logo%E7%99%BD%E5%BA%95.png'
    },
    {
        label: 'POC环境',
        value: 'poc',
        link: 'https://gw.poc.hzero.jp',
        img: 'https://minio.poc.hzero.jp/hz-public/hpfm05/0/DEFAULT/5773fa32cfe043ada7f1a7905d25e766@hzero.png'
    },
    {
        label: 'GBG POC',
        value: 'gbg',
        link: 'https://gbgpoc-api.zenlead-global.com',
        img: defaultLogo
    }
]
const selectedEnv = ref(handAuthStore?.handEnv || '');
const handLoginHand = async () => {
    // 设置当前环境
    handAuthStore.setHandEnv(selectedEnv.value);
    window.location.href = `${selectedEnv.value}/oauth/oauth/authorize?response_type=token&client_id=localhost&redirect_uri=http%3A%2F%2Flocalhost:5173%2FhandPage%3FredirectUrlIdentifies%3Dc81e728d9d4c2f636f067f89cc14862c`;
}
const handLogoutHand = async () => {
    handAuthStore.clearHandAuth();
    handAuthStore.clearTimer();
}
// 选择环境
const handleSelectEnv = (env) => {
    selectedEnv.value = env;
}
const formatRemainingTime = (seconds) => {
    // 创建当前时间的moment对象
    const now = moment();
    // 计算过期时间（当前时间 + 剩余秒数）
    const expiryTime = moment(now).add(seconds, 'seconds');

    // 计算时间差（毫秒）
    const diffMs = expiryTime.diff(now);
    // 转换为moment duration对象
    const duration = moment.duration(diffMs);

    // 提取时、分、秒
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const secs = duration.seconds();

    // 格式化输出（补零处理）
    return `${hours} 小时 ${minutes} 分 ${secs} 秒`;
}

</script>

<style scoped lang="less">
.hand-page-container {
    .env-list-card {
        display: flex;
        flex-direction: row;
        gap: 16px;
        margin: 16px 0;

        .env-list-card-item {
            width: 260px;
            display: flex;
            flex-direction: row;
            gap: 16px;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            align-items: center;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            filter: grayscale(100%);

            .env-list-card-item-tag {
                position: absolute;
                top: 2px;
                left: -5px;
            }

            &:hover {
                border-color: var(--td-brand-color);
                color: var(--td-brand-color);
                filter: grayscale(0%);
            }

            h3,
            p {
                margin: 0;
                padding: 0;
            }

            h3 {
                font-size: 16px;
            }

            p {
                font-size: 12px;
                color: #999;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100%;
            }

            .env-list-card-item-logo {
                width: 50px;

                img {
                    width: 50px;
                    height: 50px;
                }
            }

            .env-list-card-item-content {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: calc(100% - 70px);
            }

            &-active {
                border-color: var(--td-brand-color);
                color: var(--td-brand-color);
                filter: grayscale(0%);
            }
        }

    }

    .hand-auth-button-options {
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: flex-end;
    }

    .hand-auth-token-box {
        margin-top: 16px;
        padding: 16px;
        border: 1px dashed var(--td-brand-color);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        h4 {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            padding: 0 0 10px 0;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        p {
            font-size: 14px;
            color: #333;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        span:first-child {
            color: #9c9c9c;
            display: inline-block;
            width: 150px;
        }

        span {
            font-size: 14px;
            color: #333;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }
}
</style>
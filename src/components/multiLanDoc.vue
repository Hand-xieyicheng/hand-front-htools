<template>
    <div>
        <t-drawer visible="visible" header="标题名称" :on-overlay-click="handleOverlayClick" :placement="placement"
            @cancel="handleCancel">
            <p>抽屉的内容</p>
        </t-drawer>
    </div>
</template>

<script setup>
// 1. 定义接收父组件的参数（必传/可选、类型、默认值）
const props = defineProps({
    // 控制抽屉显示/隐藏（必传，双向绑定）
    visible: {
        type: Boolean,
        required: true, // 父组件必须传递该参数
        default: false
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

// 点击遮罩层：通知父组件关闭抽屉（更新visible）
const handleOverlayClick = () => {
    emit('update:visible', false); // 触发双向绑定更新
};

// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
};
</script>
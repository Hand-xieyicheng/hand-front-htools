<template>
    <div class="copy-field-modal-container">
        <t-dialog header="多行文本复制" cancelBtn="关闭" :closeBtn="false" :confirmBtn="null" width="80%"
            :onOpened="handleOpened" :visible="visible" @cancel="handleCancel">
            <div class="copy-field-content">
                <div class="copy-field-content-item">
                    <table class="multi-language-table">
                        <tr>
                            <th style="text-align: center; width: 80px;font-size: 12px;">描述
                                <t-icon @click="copyToClipboard('label')" name="copy" style="font-size: 12px; margin-left: 5px;" />

                            </th>
                            <th style="text-align: center; width: 80px;font-size: 12px;">字段编码
                                <t-icon @click="copyToClipboard('filed')" name="copy" style="font-size: 12px; margin-left: 5px;" />

                            </th>
                            <th style="text-align: center; width: 80px;font-size: 12px;">字段编码(文档格式)
                                <t-icon @click="copyToClipboard('newLinefiled')" name="copy" style="font-size: 12px; margin-left: 5px;" />
                            </th>
                        </tr>
                        <tr v-for="item in dataSource" :key="item.filed">
                            <td>{{ item.label }}</td>
                            <td>{{ item.filed }}</td>
                            <td style="text-align: center; white-space: pre-line;">{{ item.newLinefiled }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const dataSource = ref([]);
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
    }
});
// 2. 定义向父组件传递事件的方法（子传父）
const emit = defineEmits(['update:visible', 'cancel', 'overlay-click']);
const handleOpened = () => {
    dataSource.value = JSON.parse(JSON.stringify(props.dataStructure));
    // 将数据xhifai.universalGen.button.synData处理为（xhifai.universalGen）\n button.synData格式
    dataSource.value.forEach(item => {
        item.newLinefiled = '(' + item.filed.split('.')[0] + '.' + item.filed.split('.')[1] + ')\n' + item.filed.split('.').filter((item, index) => index > 1).join('.');
    });
    console.log(props.dataStructure);
};
// 点击取消按钮：通知父组件关闭抽屉
const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel'); // 额外触发cancel事件，供父组件自定义逻辑
};
// 复制表格一整列数据到excel
const copyToClipboard = (field) => {
    const columnData = dataSource.value.map(item => item[field]).join('\n');
    navigator.clipboard.writeText(columnData).then(() => {
        MessagePlugin.success('复制成功');
    }).catch(err => {
        MessagePlugin.error('复制失败');
    });
};
</script>
<style scoped lang="less">
.copy-field-modal-container {
    .multi-language-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
}
    .copy-field-header {
        display: flex;
        align-items: center;
        margin-left: 30px;
        position: relative;

        .copy-field-header-icon {
            position: absolute;
            left: calc(-50% - 50px);
            top: -200px;
        }
    }
    .copy-field-content{
        max-height: 50vh;
        overflow: auto;
    }
}
</style>

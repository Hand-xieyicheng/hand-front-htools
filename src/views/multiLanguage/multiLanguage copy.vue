<template>
  <div class="multi-language-container">
    <div class="multi-language-module">
      <div class="multi-language-module-item">
        模块：<t-select v-model="module" :options="moduleOptions" placeholder="请选择模块" clearable @focus="onFocus"
          @blur="onBlur"></t-select>
      </div>
      <div class="multi-language-module-item">
        类型：<t-select v-model="type" :options="typeOptions" placeholder="请选择类型" clearable @focus="onFocus"
          @blur="onBlur"></t-select>
      </div>
      <div class="multi-language-module-item">
        Common字段：
        <div>
          <t-button variant="text" theme="primary" size="small">
            <template #icon><browse-icon /></template>
            查看</t-button>
          <t-button variant="text" theme="primary" size="small">
            <template #icon><refresh-icon /></template>
            更新</t-button>
        </div>
      </div>
    </div>
    <div class="multi-language-wrapper">
      <div class="multi-language-item">

        <h4>中文列表
          <t-button variant="text" theme="primary" size="small" @click="generateFileds">
            <template #icon><refresh-icon /></template>
            多字段导入</t-button>
          <t-button variant="text" theme="primary" size="small" @click="generateFileds">
            <template #icon><add-icon /></template>
            生成字段</t-button>
          <t-button variant="text" theme="primary" size="small" @click="generateFileds(true)">
            <template #icon><add-icon /></template>
            快速生成</t-button>
        </h4>
        <t-textarea v-model="languageToTranslate" :placeholder="`示例：
UT自动化实施	
项目	
UT Case编码	
UT Case名称	
分类	
规则编码	
生成语言	
状态	
生成时间	
生成者`" name="description" :autosize="{ minRows: 30, maxRows: 50 }" />
      </div>
      <div class="multi-language-item">
        <h4>多语言字段<t-button variant="text" theme="primary" size="small">
            <template #icon><copy-icon /></template>
            复制</t-button><t-button variant="text" theme="primary" size="small">
            <template #icon><add-icon /></template>
            生成翻译</t-button></h4>
        <table class="multi-language-table">
          <tr v-for="item in dataStructure" :key="item.filed">
            <td style="width: 80px;font-size: 12px;">{{ item.label }}</td>
            <td><t-input v-model="item.filed" placeholder="请输入Field ID" /></td>
          </tr>
        </table>
      </div>
      <div class="multi-language-item">
        <h4>翻译<t-button variant="text" theme="primary" size="small">
            <template #icon><send-icon /></template>
            同步至系统</t-button>
          <t-button variant="text" theme="primary" size="small">
            <template #icon><catalog-icon /></template>
            查看文档格式</t-button>
        </h4>

        <t-collapse @change="handlePanelChange">
          <t-collapse-panel v-for="item in dataStructure" :key="item.filed" :header="item.label">
            <table class="multi-language-table">
              <tr v-for="lang in item.multiLanguage" :key="lang.id">
                <td style="width: 40px;">{{ lang.label }}</td>
                <td><t-input v-model="lang.value" placeholder="请输入翻译" /></td>
              </tr>
            </table>
          </t-collapse-panel>
        </t-collapse>
      </div>
    </div>
    <div class="multi-language-footer">
      <t-button theme="primary">清除缓存</t-button>
      <t-button theme="primary">暂存历史</t-button>
      <t-button theme="secondary">历史记录</t-button>
    </div>
    <div class="multi-language-footer">
      <quickLink />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import quickLink from '@/components/quickLink.vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getFiledIdByAi, getFiledIdAndTranslateByAi } from '@/services/multiLan';

import { SendIcon, AddIcon, CopyIcon, CatalogIcon, BrowseIcon, RefreshIcon } from 'tdesign-icons-vue-next';
const languageToTranslate = ref(`UT自动化实施	
项目	
UT Case编码	
UT Case名称	
分类	
规则编码	
生成语言	
状态	
生成时间	
生成者	`);
const chineseList = ref([]);
const module = ref('');
const type = ref('');
const currentItem = ref([1]);

const moduleOptions = [
  { label: 'Case生成(hfat.utCase)', value: 'hfat.utCase' },
];

const typeOptions = [
  { label: 'model', value: 'model' },
  { label: 'view', value: 'view' },
  { label: 'button', value: 'button' },
];

// 数据结构定义
const dataStructure = ref([
  {
    label: 'UT自动化实施',
    filed: 'hfat.utCase.view.utAutomationImplementation',
    multiLanguage: [
      {
        label: '中文',
        id: 'zh-CN',
        value: 'UT自动化实施',
      },
      {
        label: '英文',
        id: 'en-US',
        value: 'UT automation implementation',
      },
      {
        label: '日文',
        id: 'ja-JP',
        value: 'プロジェクト',
      },
      {
        label: '韩文',
        id: 'ko-KR',
        value: '프로젝트',
      },
      {
        label: '法文',
        id: 'fr-FR',
        value: 'Projet',
      },
      {
        label: '德文',
        id: 'de-DE',
        value: 'Projekt',
      },
    ],
  }, {
    label: '项目',
    filed: 'hfat.utCase.view.project',
    multiLanguage: [
      {
        label: '中文',
        id: 'zh-CN',
        value: '项目',
      },
      {
        label: '英文',
        id: 'en-US',
        value: 'Project',
      },
      {
        label: '日文',
        id: 'ja-JP',
        value: 'プロジェクト',
      },
      {
        label: '韩文',
        id: 'ko-KR',
        value: '프로젝트',
      },
      {
        label: '法文',
        id: 'fr-FR',
        value: 'Projet',
      },
      {
        label: '德文',
        id: 'de-DE',
        value: 'Projekt',
      },
    ],
  },
])
// 根据中文列表生成多语言字段列表
const generateFileds = (translate = false) => {
  try {
    if (!module?.value || !type?.value) {
      MessagePlugin.info('请选择模块及类型等必要字段')
      return
    } else if (!languageToTranslate?.value) {
      MessagePlugin.info('请输入中文列表模块')
      return
    } else {
      // 格式化中文列表，去除前后空格
      const tempChineseList = languageToTranslate?.value.split("\n").map(item => item.trim().replace(/\t/g, ""));;
      console.log("chineseList", tempChineseList);
      chineseList.value = tempChineseList;
      if (translate) {
        // 调用ai接口，实现多语言字段的生成及其翻译
        getFiledIdAndTranslateByAi({ chineseList: tempChineseList, module: module.value, type: type.value }).then(res => {
          if (res.status === "success") {
            // 合并多语言字段列表
            dataStructure.value = res.data;
            MessagePlugin.success('多语言字段生成成功！')
          } else {
            MessagePlugin.error(res.msg || '多语言字段生成失败！')
          }
        })
      } else {
        // 调用ai接口，实现多语言字段的生成
        getFiledIdByAi({ chineseList: tempChineseList, module: module.value, type: type.value }).then(res => {
          if (res.status === "success") {
            // 合并多语言字段列表
            dataStructure.value = res.data;
            MessagePlugin.success('多语言字段生成成功！')
          } else {
            MessagePlugin.error(res.msg || '多语言字段生成失败！')
          }
        })
      }

    }
  } catch {
    MessagePlugin.info('数据格式转换错误！请输入正确的格式。')
  }
}

const handlePanelChange = (val) => {
  currentItem.value = val;
};
</script>
<style scoped lang="less">
.multi-language-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.multi-language-container {
  width: 100%;

  h4 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    padding: 0 0 10px 0;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 4px;

    /deep/.t-button .t-icon+.t-button__text:not(:empty) {
      margin-left: 4px !important;
    }
  }

  .multi-language-item {
    flex: 1;
    border: 1px dashed #f2f3ff;
    padding: 16px;
    border-radius: 4px;
  }

  .multi-language-module {
    background-color: #f2f3ff;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  .multi-language-module-item {
    flex: 1;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

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

  .multi-language-footer {
    margin-top: 16px;
  }
}
</style>

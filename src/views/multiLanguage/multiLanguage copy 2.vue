<template>
  <div class="multi-language-container">
    <div class="multi-language-options">
      <t-button size="small" theme="secondary">清除缓存与数据</t-button>
      <t-button size="small" theme="secondary">存入历史</t-button>
      <t-button size="small" theme="primary">历史记录</t-button>
    </div>
    <div class="multi-language-module">
      <div class="multi-language-module-item">
        项目：<t-select v-model="system" :options="systemOptions" placeholder="请选择项目" clearable @blur="onBlur"></t-select>
      </div>
      <div class="multi-language-module-item">
        模块：<t-select v-model="module" :options="moduleOptions" placeholder="请选择模块" clearable @blur="onBlur"></t-select>
      </div>
      <div class="multi-language-module-item">
        Common字段：
        <div style="margin-top: 4px;">
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
          <t-popup content="在已存在中文和多语言字段情况下，需要生成翻译时使用。" show-arrow destroy-on-close>
            <t-popconfirm theme="default" placement="right-bottom" confirm-btn="解析" @confirm="handleConfirmParse">
              <template #content>
                <div class="multi-language-import-popup-title">请按文档格式复制黏贴数据到下方文本域。</div>
                <t-textarea :autosize="{ minRows: 20, maxRows: 20 }" v-model="languageToParse" :placeholder="languageToParsePlaceholder" name="description" />
              </template>
              <t-button variant="text" theme="primary" size="small">
                <template #icon><arrow-down-rectangle-icon /></template>
                字段导入</t-button>
            </t-popconfirm>
          </t-popup>
          <t-popup content="将中文数组生成多语言字段，不翻译数据。" show-arrow destroy-on-close>
            <t-button variant="text" theme="primary" size="small" @click="() => generateFileds(false)">
              <template #icon><add-icon /></template>
              生成字段</t-button>
          </t-popup>
          <t-popup content="将中文数组生成多语言字段，并翻译数据。" show-arrow destroy-on-close>
            <t-button variant="text" theme="primary" size="small" @click="() => generateFileds(true)">
              <template #icon><logo-stackblitz-icon /></template>
              生成字段及翻译</t-button>
          </t-popup>
        </h4>
        <div class="multi-language-content-box">
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
生成者`" name="description" :autosize="{ minRows: 20, maxRows: 20 }" />
        </div>
      </div>
      <div class="multi-language-item">
        <t-loading size="large" :loading="loadingFiled" show-overlay>
          <h4>多语言字段<t-button :disabled="!dataStructure.length" variant="text" theme="primary" size="small">
              <template #icon><copy-icon /></template>
              多字段复制</t-button><t-button :disabled="!dataStructure.length" variant="text" theme="primary" size="small">
              <template #icon><add-icon /></template>
              生成翻译</t-button></h4>
          <div class="multi-language-content-box" v-if="dataStructure.length > 0">
            <table class="multi-language-table">
              <tr v-for="item in dataStructure" :key="item.filed">
                <td style="width: 80px;font-size: 12px;">{{ item.label }}</td>
                <td>
                  <div class="custom-input-container">
                    <t-input v-model="item.filed" placeholder="请输入Field ID" />
                    <t-popup content="复制原格式" show-arrow destroy-on-close>
                      <copy-icon class="custom-icon" :fill-color='"transparent"' :stroke-color='"currentColor"'
                        :stroke-width="2" @click="() => copyToClipboard(item.filed)" />
                    </t-popup>
                    <t-popup content="复制文档格式" show-arrow destroy-on-close>
                      <file-copy-icon class="custom-icon" :fill-color='"transparent"' :stroke-color='"currentColor"'
                        :stroke-width="2" @click="() => copyToDocFormatClipboard(item.filed)" />
                    </t-popup>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="multi-language-no-data" v-else>
            <t-empty />
          </div>
        </t-loading>
      </div>
      <div class="multi-language-item">
        <t-loading size="large" :loading="loadingTranslate" show-overlay>
          <h4>翻译<t-button :disabled="!dataStructure.length" variant="text" theme="primary" size="small">
              <template #icon><send-icon /></template>
              同步至系统</t-button>
            <t-button @click="() => generateDocumentFileds()" :disabled="!dataStructure.length" variant="text"
              theme="primary" size="small">
              <template #icon><catalog-icon /></template>
              复制文档格式</t-button>
            <t-button @click="() => expandAll()" :disabled="!dataStructure.length" variant="text" theme="primary"
              size="small">
              <template #icon><chevron-down-icon /></template>
              展开</t-button>
            <t-button @click="() => collapseAll()" :disabled="!dataStructure.length" variant="text" theme="primary"
              size="small">
              <template #icon><chevron-right-icon /></template>
              折叠</t-button>
          </h4>
          <div class="multi-language-content-box multi-language-collapse" v-if="dataStructure.length > 0">
            <t-collapse @change="handlePanelChange" v-model="activePanels">
              <t-collapse-panel v-for="item in dataStructure" :value="item.filedId" :key="item.filed"
                :header="item.label">
                <div style="color: #42c05d;font-size: 12px; margin-bottom: 8px;">编码：{{ item.filed }}</div>
                <table class="multi-language-table">
                  <tr v-for="lang in item.multiLanguage" :key="lang.id">
                    <td style="width: 90px;font-size: 12px;">{{ lang.label }}</td>
                    <td>
                      <div class="custom-input-container">
                        <t-input v-model="lang.value" placeholder="请输入翻译" />
                        <t-popup content="复制翻译" show-arrow destroy-on-close>
                          <copy-icon class="custom-icon" :fill-color='"transparent"' :stroke-color='"currentColor"'
                            :stroke-width="2" @click="() => copyToClipboard(lang.value)" />
                        </t-popup>
                      </div>
                    </td>
                  </tr>
                </table>
              </t-collapse-panel>
            </t-collapse>
          </div>
          <div class="multi-language-no-data" v-else>
            <t-empty />
          </div>
        </t-loading>
      </div>
    </div>
    <div class="multi-language-footer">
      <quickLink />
    </div>
    <t-dialog v-model:visible="multiLanDocVisible" header="多语言文档" width="80vw" cancel-btn="关闭" confirm-btn="复制">
      <table class="multi-language-table">
        <tr>
          <th style="width: 80px;font-size: 12px;">模板代码</th>
          <th style="width: 80px;font-size: 12px;">代码</th>
          <th style="width: 80px;font-size: 12px;">描述(中文)</th>
          <th style="width: 80px;font-size: 12px;">描述(English)</th>
          <th style="width: 80px;font-size: 12px;">描述(日本語)</th>
          <th style="width: 80px;font-size: 12px;">描述(繁体中文(香港))</th>
          <th style="width: 80px;font-size: 12px;">描述(繁体中文(台湾))</th>
          <th style="width: 80px;font-size: 12px;">唯一性</th>
        </tr>
        <tr v-for="item in dataStructure" :key="item.filed">
          <td>{{ system }}.{{ module }}</td>
          <td>{{ item?.filed?.split('.')?.slice(-2)?.join('.') ?? item.filed }}</td>
          <td v-for="value in item.multiLanguage">{{ value.value }}</td>
          <td>{{ item?.filed }}</td>
        </tr>
      </table>
    </t-dialog>
  </div>
</template>
<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ref } from 'vue';
import quickLink from '@/components/quickLink.vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getFiledIdByAi, getFiledIdAndTranslateByAi } from '@/services/multiLan';

import { SendIcon, AddIcon, CopyIcon, CatalogIcon, BrowseIcon, RefreshIcon, ArrowDownRectangleIcon, LogoStackblitzIcon, ChevronDownIcon, ChevronRightIcon, FileCopyIcon } from 'tdesign-icons-vue-next';
const languageToParsePlaceholder = `示例：
同步数据		"（xhifai.universalGen）
button.synData"		
导出		"（hzero.common）
button.export"		
新建		"（hzero.common）
button.add"		`;
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
const languageToParse = ref(`同步数据		"（xhifai.universalGen）
button.synData"		
导出		"（hzero.common）
button.export"		
新建		"（hzero.common）
button.add"		`);

const chineseList = ref([]);
const module = ref('utCase');
const system = ref('hfat');
const currentItem = ref([1]);
const loadingFiled = ref(false);
const loadingTranslate = ref(false);
const multiLanDocVisible = ref(false);
const activePanels = ref([]);

const moduleOptions = [
  { label: 'Case生成(utCase)', value: 'utCase' },
];

const systemOptions = [
  { label: 'xhifai', value: 'xhifai' },
  { label: 'hfat', value: 'hfat' },
];

// 数据结构定义
const dataStructure = ref([
  {
    "label": "UT自动化实施",
    "filed": "hfat.utCase.model.utAutomationImplementation",
    "filedId": 1,
    "multiLanguage": [
      {
        "label": "中文",
        "id": "zh-CN",
        "value": "UT自动化实施"
      },
      {
        "label": "英文",
        "id": "en-US",
        "value": "UT Automation Implementation"
      },
      {
        "label": "日文",
        "id": "ja-JP",
        "value": "UT自動化実施"
      },
      {
        "label": "繁体中文（台湾）",
        "id": "zh-TW",
        "value": "UT自動化實施"
      },
      {
        "label": "繁体中文（香港）",
        "id": "zh-HK",
        "value": "UT自動化實施"
      }
    ]
  },
  {
    "label": "项目",
    "filed": "hfat.utCase.model.project",
    "filedId": 2,
    "multiLanguage": [
      {
        "label": "中文",
        "id": "zh-CN",
        "value": "项目"
      },
      {
        "label": "英文",
        "id": "en-US",
        "value": "Project"
      },
      {
        "label": "日文",
        "id": "ja-JP",
        "value": "プロジェクト"
      },
      {
        "label": "繁体中文（台湾）",
        "id": "zh-TW",
        "value": "專案"
      },
      {
        "label": "繁体中文（香港）",
        "id": "zh-HK",
        "value": "項目"
      }
    ]
  },
])
// 根据中文列表生成多语言字段列表
const generateFileds = (translate = false) => {
  try {
    if (!system?.value || !module?.value) {
      MessagePlugin.info('请选择系统及模块等必要字段')
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
        loadingTranslate.value = true;
        loadingFiled.value = true;
        // 调用ai接口，实现多语言字段的生成及其翻译
        getFiledIdAndTranslateByAi({ chineseList: tempChineseList, module: module.value, system: system.value }).then(res => {
          if (res.status === "success") {
            loadingTranslate.value = false;
            loadingFiled.value = false;
            // 合并多语言字段列表
            dataStructure.value = res.data;
            MessagePlugin.success('多语言字段生成成功！')
          } else {
            loadingTranslate.value = false;
            loadingFiled.value = false;
            MessagePlugin.error(res.msg || '多语言字段生成失败！')
          }
        }).catch(() => {
          loadingTranslate.value = false;
          loadingFiled.value = false;
        })
      } else {
        loadingFiled.value = true;
        // 调用ai接口，实现多语言字段的生成
        getFiledIdByAi({ chineseList: tempChineseList, module: module.value, system: system.value }).then(res => {
          if (res.status === "success") {
            loadingFiled.value = false;
            // 合并多语言字段列表
            dataStructure.value = res.data;
            MessagePlugin.success('多语言字段生成成功！')
          } else {
            loadingFiled.value = false;
            MessagePlugin.error(res.msg || '多语言字段生成失败！')
          }
        }).catch(() => {
          loadingFiled.value = false;
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

// 打开文档格式弹窗
const generateDocumentFileds = () => {
  if (!dataStructure?.value?.length) {
    MessagePlugin.info('请先生成多语言字段！')
    return
  } else {
    // 打开文档格式弹窗
    multiLanDocVisible.value = true;
  }
}

// 解析数据为指定格式，将数据解析到dataStructure中
const handleConfirmParse = () => {
  if (!languageToParse?.value) {
    MessagePlugin.info('请输入要解析的数据！')
    return
  }
  try {
    // 按行分割数据
    const lines = languageToParse.value.split("\t\t\n");
    const result = [];
    const labels = [];
    // 每三条为一组进行解析
    for (let i = 0; i < lines.length; i++) {
      labels.push(lines[i]?.trim().split("\t\t")[0]);
      // 添加到结果数组
      result.push({
        "label": lines[i]?.trim().split("\t\t")[0],
        "filed": lines[i]?.trim().split("\t\t")[1].replace("）\n", ".").replace("（", "").replaceAll("\"", ""),
        "filedId": i + 1, //数据唯一标识符，数字递增即可
        "multiLanguage": []
      });
    }
    // 更新数据结构
    dataStructure.value = result;
    languageToTranslate.value = labels.join("\n");
    MessagePlugin.success('数据解析成功！');
    languageToParse.value = "";
  } catch (error) {
    console.error('解析错误:', error);
    MessagePlugin.error('数据格式转换错误！请检查输入格式是否正确。');
  }
}

// 将text转换成文档格式，再复制
const copyToDocFormatClipboard = (text) => {
  if (text) {
    let docFormat = "";
    const docFormatArr = text.split(".");
    docFormatArr.forEach((item, index) => {
      if (index === 0) {
        docFormat += "（" + item.trim() + ".";
      } else if (index === 1) {
        docFormat += item.trim() + "）\n";
      } else if (index === 2) {
        docFormat += item.trim();
      } else {
        docFormat += '.' + item.trim();
      }
    })
    copyToClipboard(docFormat);
  } else {
    MessagePlugin.info('请输入要复制的内容！')
  }
}

const copyToClipboard = (text) => {
  if (text) {
    // 1. 替换input为textarea，textarea支持多行文本和\n换行符
    const textarea = document.createElement('textarea');
    textarea.value = text; // 直接赋值保留\n换行符
    // 2. 隐藏textarea（避免影响页面布局，比display:none更稳定）
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    // 3. 选中textarea所有内容（支持多行选中）
    textarea.select();
    // 4. 处理iOS设备兼容：确保全选（部分iOS需额外触发setSelectionRange）
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      // 5. 执行复制（document.execCommand已废弃，改用Clipboard API优先）
      const result = document.execCommand('copy');
      if (result) {
        MessagePlugin.success('复制成功！');
      } else {
        // 备用方案：使用Clipboard API（现代浏览器推荐）
        navigator.clipboard.writeText(text).then(() => {
          MessagePlugin.success('复制成功！');
        });
      }
    } catch (err) {
      // 兼容低版本浏览器，兜底提示
      MessagePlugin.error('复制失败，请手动复制');
      console.error('复制错误：', err);
    } finally {
      // 6. 无论成功失败，都移除textarea
      document.body.removeChild(textarea);
    }
  } else {
    MessagePlugin.info('无内容可复制');
  }
}

// 展开所有折叠面板
const expandAll = () => {
  activePanels.value = dataStructure.value.map(item => item.filedId);
}

// 折叠所有折叠面板
const collapseAll = () => {
  activePanels.value = [];
}
</script>
<style>
.multi-language-import-popup-title {
  margin-bottom: 16px;
  font-weight: 600;
  width: 1000px;
}
</style>
<style scoped lang="less">
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

.multi-language-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 16px;
  min-height: calc(100vh - 640px);

  /deep/.t-collapse-panel__wrapper .t-collapse-panel__body {
    background: #f2f3ff63;
  }

  .multi-language-content-box {
    height: calc(100% - 34px);

    .t-textarea {
      height: 100%;

      /deep/.t-textarea__inner {
        height: 100% !important;
      }
    }
  }
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
    background: #fafaff;
    border: 1px dashed #4856ff63;
    padding: 16px;
    border-radius: 4px;
  }

  .multi-language-module {
    background-color: #f2f3ff63;
    border: 1px dashed #4856ff63;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }

  .multi-language-module-item {
    flex: 1;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;

  }

  /deep/.t-collapse-panel__wrapper .t-collapse-panel__content {
    padding: 10px;
  }

  .multi-language-footer {
    margin-top: 16px;
  }

  .multi-language-options {
    padding: 16px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
  }

  .multi-language-no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 12px;
    color: #999;
  }

  .custom-input-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .custom-icon {
      cursor: pointer;
      color: #999;
    }
  }


}
</style>

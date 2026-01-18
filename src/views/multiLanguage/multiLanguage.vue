<template>
  <div class="multi-language-container">
    <div class="page-header-box">
      <h2 class="page-header-title">编码及翻译生成
      </h2>
      <t-affix :offset-top="56">
        <div class="page-header-button-options">
          <t-button size="small" theme="secondary" @click="resetData"><template #icon><t-icon
                name="rollback" /></template>重置数据</t-button>
          <t-button size="small" theme="success" @click="saveToHistory"><template #icon><t-icon
                name="save" /></template>
            存入历史</t-button>
          <t-button size="small" theme="primary" @click="openHistoryModal"><template #icon><t-icon
                name="article" /></template>历史记录</t-button>
        </div>
      </t-affix>
    </div>
    <div class="page-content-box" style="margin-bottom: 16px;">

      <div class="multi-language-module">
        <div class="multi-language-module-item">
          <span>环境：</span><t-select v-model="env" :options="handAuthStoreNew.envOptions" placeholder="请选择环境" clearable></t-select>
          <a class="to-maintenance" href="/handPageNew" target="_blank">去登陆</a>
        </div>
        <div class="multi-language-module-item">
          <span>项目：</span><t-select v-model="system" :options="systemOptions" placeholder="请选择项目" clearable></t-select>
          <a class="to-maintenance" href="/projectMaintenance" target="_blank">去维护</a>
        </div>
        <div class="multi-language-module-item">
          <span>模块：</span><t-select v-model="module" :options="moduleOptions" placeholder="请选择模块" clearable></t-select>
          <a class="to-maintenance" href="/moduleMaintenance" target="_blank">去维护</a>
        </div>
        <!-- <div class="multi-language-module-item">
        <span>Common字段：</span>
        <div style="margin-top: 4px;">
          <t-button variant="text" theme="primary" size="small">
            <template #icon><browse-icon /></template>
查看</t-button>
</div>
</div> -->
      </div>
    </div>
    <div class="page-content-box">


      <div class="multi-language-wrapper">
        <div class="multi-language-item" style="flex: 0.7;">
          <h4>文本
            <t-popup content="在已存在文本列表多语言字段情况下，需要生成翻译时使用。" show-arrow destroy-on-close>
              <t-popconfirm theme="default" placement="right-bottom" confirm-btn="解析" @confirm="handleConfirmParse">
                <template #content>
                  <div class="multi-language-import-popup-title">请按文档格式复制黏贴数据到下方文本域。</div>
                  <t-textarea :autosize="{ minRows: 20, maxRows: 20 }" v-model="multiLanStore.languageToParse"
                    :placeholder="languageToParsePlaceholder" name="description" />
                </template>
                <t-button variant="text" theme="primary" size="small">
                  <template #icon><arrow-down-rectangle-icon /></template>
                  字段导入</t-button>
              </t-popconfirm>
            </t-popup>
            <t-popup content="将文本数组生成多语言字段，不翻译数据。" show-arrow destroy-on-close>
              <t-button variant="text" theme="primary" size="small" @click="() => generateFileds('generateId')">
                <template #icon><add-icon /></template>
                生成字段</t-button>
            </t-popup>
            <t-popup content="将文本数组生成多语言字段，并翻译数据。" show-arrow destroy-on-close>
              <t-button theme="success" size="small" style="font-weight: bold;"
                @click="() => generateFileds('generateIdAndTranslate')">
                <template #icon><logo-stackblitz-icon class="animate__animated animate__tada" /></template>
                一键生成</t-button>
            </t-popup>
          </h4>
          <div class="multi-language-content-box">
            <t-textarea v-model="languageToTranslate" :placeholder="`〈《请从文档中复制字段列数据》〉
示例：
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
            <h4>多语言字段<t-button @click="openMultiFeildCopyModal" :disabled="!multiLanStore?.dataStructure?.length"
                variant="text" theme="primary" size="small">
                <template #icon><copy-icon /></template>
                多行文本复制</t-button><t-button @click="() => generateFileds('generateTranslate')"
                :disabled="!multiLanStore?.dataStructure?.length" variant="text" theme="primary" size="small">
                <template #icon><add-icon /></template>
                生成翻译</t-button></h4>
            <div class="multi-language-content-box" v-if="multiLanStore?.dataStructure?.length > 0">
              <table class="multi-language-table">
                <tbody>
                  <tr v-for="item in multiLanStore?.dataStructure" :key="item.filed">
                    <td style="width: 80px;font-size: 12px; min-width: 50px;">
                      {{ item.label }}
                    </td>
                    <td style="width: 36px;text-align: center;">
                      <t-tag v-if="item.status === 1" variant="outline" size="small" theme="success">公</t-tag>
                      <t-tag v-else-if="item.status === 2" variant="outline" size="small" theme="warning">新</t-tag>
                      <t-tag v-else-if="item.status === 3" variant="outline" size="small" theme="primary">存</t-tag>
                    </td>
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
                </tbody>
              </table>
            </div>
            <div class="multi-language-no-data" v-else>
              <t-empty />
            </div>
          </t-loading>
        </div>
        <div class="multi-language-item">
          <t-loading size="large" :loading="loadingTranslate" show-overlay>
            <h4>翻译<t-button @click="openSyncToSystemModal"
                :disabled="!multiLanStore?.dataStructure?.length || !env" variant="text"
                theme="primary" size="small">
                <template #icon><send-icon /></template>
                同步至系统</t-button>
              <t-button @click="() => generateDocumentFileds()" :disabled="!multiLanStore?.dataStructure?.length"
                variant="text" theme="primary" size="small">
                <template #icon><catalog-icon /></template>
                复制文档格式</t-button>
              <t-button @click="() => expandAll()" :disabled="!multiLanStore?.dataStructure?.length" variant="text"
                theme="primary" size="small">
                <template #icon><chevron-down-icon /></template>
                展开</t-button>
              <t-button @click="() => collapseAll()" :disabled="!multiLanStore?.dataStructure?.length" variant="text"
                theme="primary" size="small">
                <template #icon><chevron-right-icon /></template>
                折叠</t-button>
            </h4>
            <div class="multi-language-content-box multi-language-collapse"
              v-if="multiLanStore?.dataStructure?.length > 0">
              <t-collapse @change="handlePanelChange" v-model="activePanels">
                <t-collapse-panel v-for="item in multiLanStore?.dataStructure" :value="item.filedId" :key="item.filed">
                  <template #header>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 12px;margin-right: 4px;">{{ item.label }}</span>
                      <t-tag v-if="item.status === 1" variant="outline" size="small" theme="success">公</t-tag>
                      <t-tag v-else-if="item.status === 2" variant="outline" size="small" theme="warning">新</t-tag>
                      <t-tag v-else-if="item.status === 3" variant="outline" size="small" theme="primary">存</t-tag>
                    </div>
                  </template>
                  <div style="color: #42c05d;font-size: 12px; margin-bottom: 8px;">编码：{{ item.filed }}</div>
                  <table v-if="item.status !== 1" class="multi-language-table">
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
                  <div v-else class="multi-language-common-field">公共字段</div>
                </t-collapse-panel>
              </t-collapse>
            </div>
            <div class="multi-language-no-data" v-else>
              <t-empty />
            </div>
          </t-loading>
        </div>
      </div>
    </div>


        <div class="multi-language-module-item multi-language-module-item-tags">
          <t-tag variant="outline" size="small" theme="success">公</t-tag>
          <span style="margin-right: 10px;">系统公共字段，不可编辑与覆盖</span>
          <t-tag variant="outline" size="small" theme="warning">新</t-tag>
          <span style="margin-right: 10px;">新字段</span>
          <t-tag variant="outline" size="small" theme="primary">存</t-tag>
          <span style="margin-right: 10px;">已存在字段，可覆盖数据</span>
        </div>
    <div class="multi-language-footer">
      <quickLink />
    </div>
    <docCopy :system="system" :module="module" :dataStructure="multiLanStore?.dataStructure"
      v-model:visible="multiLanDocVisible" ref="docCopyRef" />
    <generateFeildModal :envData="handAuthStoreNew.envList.find(item => item.id === Number(env))" :system="system" :module="module" :setDataStructure="setDataStructure"
      :generateType="generateType" :dataStructure="multiLanStore?.dataStructure"
      v-model:visible="generateFiledsModalVisible" ref="generateFeildModalRef" />
    <multiFeildCopyModal :dataStructure="multiLanStore?.dataStructure" v-model:visible="multiFeildCopyModalVisible"
      ref="multiFeildCopyModalRef" />
    <syncToSystemModal :envData="handAuthStoreNew.envList.find(item => item.id === Number(env))" :setDataStructure="setDataStructure" :saveToHistory="saveToHistory" :system="system"
      :module="module" :dataStructure="multiLanStore?.dataStructure" v-model:visible="syncToSystemModalVisible"
      ref="syncToSystemModalRef" />
    <historyModal v-model:visible="historyModalVisible" @update:applyData="handleApplyData" ref="historyModalRef" />
  </div>
</template>
<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ref, reactive, onMounted } from 'vue';
import quickLink from '@/components/quickLink.vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getFiledIdByAi, getFiledIdAndTranslateByAi, getTranslateByAi, saveHistory } from '@/services/multiLan';
import generateFeildModal from './components/generateFeildModal.vue';
import multiFeildCopyModal from './components/multiFeildCopyModal.vue';
import syncToSystemModal from './components/syncToSystemModal.vue';
import docCopy from './components/docCopy.vue';
import historyModal from './components/historyModal.vue';
import { useMultiLanStore } from '@/stores/multiLan';
import { getProjectList } from '@/services/project';
import { getModuleList } from '@/services/module';
import { copyToClipboard } from '@/utils/tools';
import { useHandAuthStoreNew } from '@/stores/handLoginNew';
import router from '@/router';

import 'animate.css';
import { SendIcon, AddIcon, CopyIcon, CatalogIcon, BrowseIcon, RefreshIcon, ArrowDownRectangleIcon, LogoStackblitzIcon, ChevronDownIcon, ChevronRightIcon, FileCopyIcon } from 'tdesign-icons-vue-next';
const languageToParsePlaceholder = `《〈请从文档中复制两列数据到文本域中进行解析〉》
示例：
同步数据		"（xhifai.universalGen）
button.synData"		
导出		"（hzero.common）
button.export"		
新建		"（hzero.common）
button.add"		`;
const languageToTranslate = ref(``);
const multiLanStore = useMultiLanStore();
const handAuthStoreNew = useHandAuthStoreNew();
const module = ref('');
const system = ref('');
const env = ref('');
const currentItem = ref([1]);
const loadingFiled = ref(false);
const loadingTranslate = ref(false);
const multiLanDocVisible = ref(false);
const activePanels = ref([]);
const generateFiledsModalVisible = ref(false);
const generateType = ref('generateId');
const multiFeildCopyModalVisible = ref(false);
const syncToSystemModalVisible = ref(false);
const historyModalVisible = ref(false);
const moduleOptions = ref([]);
const systemOptions = ref([]);

// 组件挂载时获取项目列表
onMounted(() => {
  getProjectDataList();
  getModuleDataList();
})

// 获取项目列表
const getProjectDataList = async () => {
  try {
    const res = await getProjectList({ status: 1, pageSize: 1000 });
    if (res?.status === "success") {
      systemOptions.value = res?.data?.list?.map(item => ({
        content: (h) => `${item.project_name}【${item.project_code}】`,
        label: item.project_name,
        value: item.project_code
      })) || [];
    }
  } catch {
    MessagePlugin.info('获取项目列表失败！')
  }
}
// 获取模块列表
const getModuleDataList = async () => {
  try {
    const res = await getModuleList({ status: 1, pageSize: 1000 });
    if (res?.status === "success") {
      moduleOptions.value = res?.data?.list?.map(item => ({
        content: (h) => `${item.module_name}【${item.module_code}】`,
        label: item.module_name,
        value: item.module_code
      })) || [];
    }
  } catch {
    MessagePlugin.info('获取模块列表失败！')
  }
}

// 设定dataStructure的值
const setDataStructure = (value) => {
  multiLanStore.setDataStructure(value);
}

// 打开生成多语言字段弹窗
const openGenerateFileds = () => {
  generateFiledsModalVisible.value = true;
}

// 切换生成多语言字段弹窗
const toggleGenerateFiledsModal = (flag = false) => {
  generateFiledsModalVisible.value = flag;
}

// 打开历史记录弹窗
const openHistoryModal = () => {
  historyModalVisible.value = true;
}

// 打开同步至系统弹窗
const openSyncToSystemModal = () => {
  syncToSystemModalVisible.value = true;
}

// 根据中文列表生成多语言字段列表
const generateFileds = (genType = 'generateId') => {
  try {
    if(genType === 'generateIdAndTranslate' && !languageToTranslate?.value){
      MessagePlugin.info('请输入要生成多语言字段的文本列表')
      return
    } else if ((!system?.value || !module?.value || !env?.value) && genType !== "generateTranslate") {
      MessagePlugin.info('请选择系统、模块、环境等必要字段')
      return
    } else if (!languageToTranslate?.value && !multiLanStore?.dataStructure?.length) {
      MessagePlugin.info('请输入要生成多语言字段的文本列表')
      return
    } else {
      if (genType !== "generateTranslate") {
        // 格式化中文列表，去除前后空格
        const tempChineseList = languageToTranslate?.value.split("\n").map(item => item.trim().replace(/\t/g, ""));;
        console.log("chineseList", tempChineseList);
        multiLanStore.setDataStructure(tempChineseList?.map((item, index) => ({
          "label": item,
          "filed": "",
          "filedId": index + 1,
          "multiLanguage": []
        })) || []);
      }
      // 调用ai接口，实现多语言字段的生成及其翻译
      generateType.value = genType;
      openGenerateFileds();
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
  if (!multiLanStore?.dataStructure?.length) {
    MessagePlugin.info('请先生成多语言字段！')
    return
  } else {
    // 打开文档格式弹窗
    multiLanDocVisible.value = true;
  }
}

// 打开多语言字段复制弹窗
const openMultiFeildCopyModal = () => {
  if (!multiLanStore?.dataStructure?.length) {
    MessagePlugin.info('请先生成多语言字段！')
    return
  } else {
    // 打开多语言字段复制弹窗
    multiFeildCopyModalVisible.value = true;
  }
}



// 解析数据为指定格式，将数据解析到dataStructure中
const handleConfirmParse = () => {
  if (!multiLanStore?.languageToParse) {
    MessagePlugin.info('请输入要解析的数据！')
    return
  }
  try {
    // 按行分割数据
    const lines = multiLanStore.languageToParse.split("\t\t\n");
    const result = [];
    const labels = [];
    // 每三条为一组进行解析
    for (let i = 0; i < lines.length; i++) {
      labels.push(lines[i]?.trim().split("\t\t")[0]);
      // 添加到结果数组
      result.push({
        "label": lines[i]?.trim().split("\t\t")[0],
        "filed": lines[i]?.trim().split("\t\t")[1].replace("）\n", ".").replace(")\n", ".").replace("（", "").replace("(", "").replace(")", ".").replace("）", ".").replaceAll("\"", ""),
        "filedId": i + 1, //数据唯一标识符，数字递增即可
        "multiLanguage": []
      });
    }
    // 更新数据结构
    multiLanStore.setDataStructure(result);
    languageToTranslate.value = labels.join("\n");
    MessagePlugin.success('数据解析成功！');
    multiLanStore.setLanguageToParse("");
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

// 展开所有折叠面板
const expandAll = () => {
  activePanels.value = multiLanStore?.dataStructure?.map(item => item.filedId);
}

// 折叠所有折叠面板
const collapseAll = () => {
  activePanels.value = [];
}

// 生成翻译
const generateTranslate = () => {
  if (!multiLanStore?.dataStructure?.length) {
    MessagePlugin.info('请先生成多语言字段！')
    return
  } else {

  }
}

// 数据存入历史记录
const saveToHistory = async () => {
  if (!multiLanStore?.dataStructure?.length) {
    MessagePlugin.info('请先生成多语言字段！')
    return
  } else {
    try {
      const res = await saveHistory({
        project_code: system.value,
        module_code: module.value,
        chinese_list: JSON.stringify(languageToTranslate.value),
        multilingual_json: JSON.stringify(multiLanStore?.dataStructure)
      });
      if (res.status === 'success') {
        MessagePlugin.success('存入历史记录成功！');
      } else {
        MessagePlugin.error(res.msg);
      }
    } catch (error) {
      MessagePlugin.error(error.message);
    }
  }
}
// 应用暂存的数据
const handleApplyData = (row) => {
  system.value = row.project_code;
  module.value = row.module_code;
  languageToTranslate.value = row.chinese_list;
  multiLanStore.setDataStructure(row.multilingual_json);
  multiLanStore.setLanguageToParse(row.chinese_list);
  MessagePlugin.success('应用暂存数据成功！');
}

// 重置数据
const resetData = () => {
  system.value = "";
  module.value = "";
  languageToTranslate.value = "";
  multiLanStore.setDataStructure([]);
  MessagePlugin.success('数据重置成功！');
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
.multi-language-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 16px;
  min-height: calc(100vh - 616px);

  .multi-language-content-box {
    height: calc(100% - 34px);

    .t-textarea {
      height: 100%;

      :deep(.t-textarea__inner) {
        height: 100% !important;
        border: 1px dashed #4856ff63;
      }
    }
  }
}

.multi-language-common-field {
  display: flex;
  padding: 32px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 12px;
  color: #999;
  background-color: #fff;
  margin-bottom: 8px;
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

    :deep(.t-button .t-icon+.t-button__text:not(:empty)) {
      margin-left: 4px !important;
    }

  }

  .multi-language-item {
    flex: 1;
    // background: #fafaff;
    border: 1px dashed #dcdcdc63;
    padding: 16px;
    border-radius: 4px;

    h4 {
      white-space: nowrap;
    }
  }

  .multi-language-module {
    // background-color: #f2f3ff63;
    // border: 1px dashed #4856ff63;
    padding: 0 16px 0 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    gap: 24px;
  }

  .multi-language-module-item-tags {
    font-size: 12px !important;
    gap: 6px !important;
    margin-top: 16px;
    margin-left: 16px;
  }

  .multi-language-module-item {
    // flex: 1;
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 4px;

    span {
      display: inline-block;
      white-space: nowrap;
      // width: 100px;
    }

    .to-maintenance {
      font-size: 10px;
      text-decoration: none;
      white-space: nowrap;
      color: var(--td-brand-color);
      cursor: pointer;
      margin-left: 8px;
    }
  }

  :deep(.t-collapse-panel__wrapper .t-collapse-panel__content) {
    padding: 10px;
  }

  .multi-language-footer {
    margin-top: 16px;
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

}
</style>

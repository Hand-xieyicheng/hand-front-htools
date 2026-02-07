<template>
  <div class="list-view-container">
    <div class="page-header-box">
      <h2 class="page-header-title">独立值集迁移</h2>
    </div>
    <div class="common-flex" style="margin-bottom: 16px;">
      <div class="">
          <span>期初环境：</span><t-select v-model="startEnv" :options="handAuthStoreNew.envOptions" placeholder="请选择环境" clearable></t-select>
        </div>
        <t-icon name="arrow-right" style="margin-top: 20px;color: #000;"></t-icon>
        <div class="multi-language-module-item">
          <span>导入环境：</span><t-select v-model="toEnv" :options="handAuthStoreNew.envOptions" placeholder="请选择环境" clearable></t-select>
        </div>
    </div>
    <div class="list-view-content" style="margin-bottom: 16px;">
      <div class="query-box">
        <t-input :size="!valueTree ? 'large' : 'normal'" v-model="valueSetCode" placeholder="请输入值集编码" />
        <t-button v-show="valueTree" :size="!valueTree ? 'large' : 'normal'" theme="primary" @click="resetQuery">
          <template #icon>
            <refresh-icon></refresh-icon>
          </template>
          重置
        </t-button>
        <t-button :disabled="!startEnv || !toEnv || !valueSetCode" :size="!valueTree ? 'large' : 'normal'" :loading="headerLoading" theme="primary" @click="queryData">
          <template #icon>
            <search-icon></search-icon>
          </template>
          查询
        </t-button>
      </div>
      <t-loading :loading="headerLoading">
        <div v-if="valueTree" class="detail-box">
          <t-descriptions bordered :column="3">
            <t-descriptions-item label="值集名称">{{ valueTree?.lovName }}</t-descriptions-item>
            <t-descriptions-item label="值集类型">{{ valueTree?.lovTypeMeaning }}</t-descriptions-item>
            <t-descriptions-item label="租户">{{ valueTree?.tenantName }}</t-descriptions-item>
          </t-descriptions>
        </div>
      </t-loading>
      <div class="item-box">
        <div v-if="valueTree" class="item-box-btn-box">
          <!-- <t-button theme="primary" @click="addItem">新增</t-button> -->
          <t-button theme="success" @click="generateSync">导入</t-button>
        </div>
        <div class="item-box-item-box"
          :style="{ backgroundColor: backgroundColorList[index % backgroundColorList.length] }"
          v-for="(node, index) in valueTree?.children ?? []" :key="index">
          <t-loading v-if="node.loading" style="margin-right: 8px;"></t-loading>
          <div class="item-box-item-meaning">
            <span class="item-box-item-meaning-index">{{ index + 1 }}.</span>
            <t-input-adornment prepend="值">
              <t-input v-model="node.value" placeholder="请输入值" />
            </t-input-adornment>
            <t-input-adornment prepend="含义">
              <t-input v-model="node.meaning" placeholder="请输入含义" />
            </t-input-adornment>
          </div>
          <div class="item-box-item">
            <div class="item-box-item-lang" v-for="(lang, langIndex) in node.languages" :key="langIndex">
              <span>{{ lang.name }}:
                <t-input v-model="lang.value" placeholder="请输入翻译" />
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { SearchIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { getLovHeader, getLovRows, getLovRowsLanguages, setLovHeader, setLovLine } from '@/services/lov';
import { useHandAuthStoreNew } from '@/stores/handLoginNew';

const handAuthStoreNew = useHandAuthStoreNew();
const backgroundColorList = [
  '#f2f3ff',
  '#fff5e6',
  '#fff0f0',
  '#f0f9e8',
  '#e8f5e9',
  '#f5f5f5',
  '#eaf5ff',
];
// 
const startEnv = ref("")
const toEnv = ref("")
// 固定的多语言类型
const languageTypes = ref([
  { name: '中文', code: 'zh-CN', value: '' },
  { name: '英文', code: 'en-US', value: '' },
  { name: '日文', code: 'ja-JP', value: '' },
  { name: '繁体中文香港', code: 'zh-HK', value: '' },
  { name: '繁体中文台湾', code: 'zh-TW', value: '' },
]);

// 值集编码
const valueSetCode = ref('');
const valueTree = ref(null);
const headerLoading = ref(false);

// 获取值集头信息和行信息
const queryData = async () => {
  if (!valueSetCode.value.trim()) {
    MessagePlugin.error('请输入值集编码');
    return;
  }
  try {
    headerLoading.value = true;
    // 先获取值集头信息
    const headerResponse = await getLovHeader(valueSetCode.value.trim(), handAuthStoreNew.envList.find(item => item.id === Number(startEnv.value)));
    headerLoading.value = false;
    if (headerResponse?.empty) {
      MessagePlugin.error(headerResponse.msg || '获取值集头信息失败');
      return;
    } else if (headerResponse?.content?.length === 0) {
      MessagePlugin.error('值集头信息为空,请先新增值集头信息');
      return;
    } else if (headerResponse?.content?.length > 0) {
      // 值集头信息存在
      valueTree.value = headerResponse?.content?.[0];
      // 再获取值集行信息
      const rowsResponse = await getLovRows(valueTree.value.lovId, handAuthStoreNew.envList.find(item => item.id === Number(startEnv.value)));
      if (rowsResponse.empty) {
        MessagePlugin.error(rowsResponse.msg || '获取值集行信息失败');
        return;
      } else {
        // 处理行数据，填充到子节点列表
        valueTree.value.children = rowsResponse?.content ?? [];
        for (let i = 0; i < valueTree.value.children.length; i++) {
          const row = valueTree.value.children[i];
          row.loading = true;
          const languagesResponse = await getLovRowsLanguages(row._token, handAuthStoreNew.envList.find(item => item.id === Number(startEnv.value)));
          row.loading = false;
          valueTree.value.children[i].languages = languagesResponse instanceof Array ? languagesResponse : []; // 初始化多语言值为空
        }
        MessagePlugin.success('数据查询成功');
        // 循环便历行数据，获取多语言数据
        // valueTree.value.children = valueTree.value.children.content.map(async (node, index) => {
        //   if (languagesResponse.empty) {
        //     MessagePlugin.error(languagesResponse.msg || '获取多语言数据失败');
        //     return node;
        //   } else {
        //     // 处理多语言数据，填充到子节点列表
        //     node.languages = languagesResponse?.content?.map(lang => ({
        //       type: lang.name,
        //       value: lang.value,
        //       code: lang.code,
        //     }));
        //     return node;
        //   }
        // });
        console.log('valueTree', valueTree.value);
      }
    }
  } catch (error) {
    headerLoading.value = false;
    MessagePlugin.error(error.message || '查询数据失败');
  }
};

// 重置查询
const resetQuery = () => {
  valueSetCode.value = '';
  valueTree.value = null;
  MessagePlugin.info('查询已重置');
};

// 新增子节点
const addItem = () => {
  valueTree.value.children.push({
    meaning: '',
    value: '',
    orderSeq: valueTree.value.children.length + 1, // 默认排序号为节点索引+1
    languages: JSON.parse(JSON.stringify(languageTypes.value)),
  });
};

// 删除子节点
const removeChildNode = (index) => {
  valueTree.value.children.splice(index, 1);

  // 重新排序
  valueTree.value.children.forEach((node, i) => {
    node.orderSeq = i + 1;
  });

  MessagePlugin.success('节点删除成功');
};

// 重置表单
const resetForm = () => {
  valueSetCode.value = '';
  valueTree.value.children = [];
  MessagePlugin.info('表单已重置');
};

// 提交表单
const submitForm = () => {
  // 表单验证
  const hasInvalidNode = valueTree.value.children.some(node => {
    return !node.meaning.trim() || !node.value.trim() || !node.orderSeq;
  });

  if (hasInvalidNode) {
    MessagePlugin.error('请完善所有节点的名称、值和排序号');
    return;
  }

  // 验证多语言值（可选，根据实际需求决定是否必填）
  const hasEmptyLangValue = valueTree.value.children.some(node => {
    return node.languages.some(lang => !lang.value.trim());
  });

  if (hasEmptyLangValue) {
    MessagePlugin.warning('部分多语言值为空，是否继续提交？', {
      type: 'confirm',
      onConfirm: () => handleSubmit(),
    });
  } else {
    handleSubmit();
  }
};

// 处理提交逻辑
const handleSubmit = () => {
  const submitData = {
    valueSetCode: valueSetCode.value.trim(),
    nodes: childNodes.value.map(node => ({
      meaning: node.meaning.trim(),
      value: node.value.trim(),
      orderSeq: Number(node.orderSeq),
      languages: node.languages.map((lang, index) => ({
        type: languageTypes.value[index].name,
        value: lang.value.trim(),
      })),
    })),
  };

  // 模拟接口提交
  console.log('提交数据：', submitData);
  MessagePlugin.success('表单提交成功');

};

/**
 * 同步至系统
 * 1. 先判断系统是否存在该值集
 * 2. 存在则update数据
 * 3. 不存在则新增数据
 */
const generateSync = async () => {
  // 1. 先判断系统是否存在该值集
  let nowHeaderData = null;
  let lovHeaderResponse = await getLovHeader(valueSetCode.value.trim(), 
handAuthStoreNew.envList.find(item => item.id === Number(toEnv.value)));
  console.log('lovHeaderResponse', lovHeaderResponse);
  if(lovHeaderResponse.empty){
    // 3. 不存在则新增数据
    console.log("valueTree", valueTree)
    let lovAddHeaderResponse = await setLovHeader(
      {
            "lovName": valueTree.value.lovName,
            "lovCode": valueSetCode.value.trim(),
            "lovTypeCode": "IDP",
            "_tls": {
                "lovName": {
                    "zh_CN": valueTree.value.lovName,
                    "en_US": valueTree.value.lovName,
                    "ja_JP": valueTree.value.lovName,
                    "cht_CN": valueTree.value.lovName,
                    "zh_TW": valueTree.value.lovName
                },
                "description": {}
            },
      },
      handAuthStoreNew.envList.find(item => item.id === Number(toEnv.value))
    );
    if(lovAddHeaderResponse.lovCode){
      MessagePlugin.success("值集头创建成功");
      nowHeaderData = lovAddHeaderResponse;
    } else {
      MessagePlugin.error(lovAddHeaderResponse.message);
    }
  } else {
    // 存在头部就是这个数据了
    nowHeaderData = lovHeaderResponse?.content?.[0] ?? null;
    // 删除行内的所有数据
  }
  // 添加所有行
  for (let index = 0; index < valueTree.value.children.length; index++) {
    const element = valueTree.value.children[index];
    let res = await setLovLine(
      {
        "value": element.value,
            "meaning": element.meaning,
            "orderSeq": element.orderSeq,
            "enabledFlag": element.enabledFlag,
            "lovId": nowHeaderData.lovId,
            "lovCode": nowHeaderData.lovCode,
            "tenantId": nowHeaderData.tenantId,
            "_tls": {
    "meaning": {
        "zh_CN": element.languages.find(item => item.code === "zh_CN")?.value ?? undefined,
        "en_US": element.languages.find(item => item.code === "en_US")?.value ?? undefined,
        "ja_JP": element.languages.find(item => item.code === "ja_JP")?.value ?? undefined,
        "cht_CN": element.languages.find(item => item.code === "cht_CN")?.value ?? undefined,
        "zh_TW":  element.languages.find(item => item.code === "zh_TW")?.value ?? undefined,
    },
    "description": {}
}
      },
      handAuthStoreNew.envList.find(item => item.id === Number(toEnv.value))
    )
    if(res._token){
      MessagePlugin.success(`值集行${index + 1}创建成功`);
    } else {
      MessagePlugin.error(res.message);
    }
  }
}
</script>

<style scoped lang="less">
.list-view-content-box {
  background-color: #fff;
  min-height: 100%;
  padding: 16px;
  border-radius: 4px;
  transition: border-radius 1s ease, width 1s ease, height 1s ease, background 1s ease, padding 1s ease-in;

  .page-header-box {
    padding: 6px 0 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .page-header-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .page-header-button-options {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 10px;
    }
  }

}

.list-view-container {
  background-color: #fff;
  min-height: 100%;
  padding: 16px;
  border-radius: 4px;

  .query-box {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .detail-box {
    margin-top: 16px;
  }

  .item-box {
    margin-top: 16px;

    .item-box-btn-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 16px;
    }
  }

  .item-box-item-meaning {
    padding: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    .item-box-item-meaning-index {
      font-size: 12px;
      color: var(--td-brand-color);
      font-weight: 600;
      background-color: #f2f3ff;
      padding: 8px;
      border-radius: 4px;
    }
  }

  .item-box-item-box {
    padding: 16px;
    border-radius: 4px;
    background-color: #f9f9f9;
    margin-bottom: 16px;
  }

  .item-box-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .item-box-item-lang {
      flex: 1;

      span {
        font-size: 10px;
        color: #999;
      }
    }
  }
}

.list-view-content-box-null {
  width: 60%;
  margin: 10% auto;
  padding: 50px;
  border-radius: 16px;
  background-color: #fff;
  transition: border-radius 1s ease, width 1s ease, height 1s ease, background 1s ease, padding 1s ease-in;

  .query-box {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
}

.common-flex{
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
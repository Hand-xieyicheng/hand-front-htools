
import { MessagePlugin } from 'tdesign-vue-next';
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
export { copyToClipboard }

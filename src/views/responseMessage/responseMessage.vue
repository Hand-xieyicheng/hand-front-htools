<template>
  <div class="chat-container">
    <!-- <div class="message-list" ref="messageListRef">
      <div v-for="(msg, index) in sortedMessageList" :key="msg.id" :class="['message-item', msg.position]"
        :style="{ animationDelay: `${msg.animationDelay}s` }">
        <div class="avatar">
          <img :src="`https://picsum.photos/seed/${msg.id}/40/40`" alt="用户头像" class="avatar-img" />
        </div>
        <div class="bubble">
          <p class="bubble-content">{{ msg.content }}</p>
        </div>
      </div>
    </div>

    <div class="input-area">
      <textarea v-model="inputContent" class="input-box" placeholder="输入消息..."
        @keydown.enter.prevent="handleSend"></textarea>
      <button class="send-btn" @click="handleSend">发送</button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';

// 消息列表数据（存储所有消息，包含初始化和新增）
const messageList = ref([]);
// DOM 引用
const messageListRef = ref(null);
// 输入框内容
const inputContent = ref('');
// 消息ID计数器（初始值设为较大数字，避免与初始化消息ID冲突）
let msgId = 100;
// 初始化消息数量（可调整）
const initMessageCount = 1000;

/**
 * 生成随机初始化消息内容
 */
const generateRandomContent = () => {
  const contentList = [
    "你好呀！很高兴认识你～",
    "今天天气真不错，适合出门散步呢",
    "这个气泡动画效果看起来好有趣！",
  ];
  return contentList[Math.floor(Math.random() * contentList.length)];
};

/**
 * 初始化消息列表
 */
const initMessages = () => {
  const initMessages = [];
  // 生成初始化消息，ID从1开始，动画延迟依次递增1秒
  for (let i = 0; i < initMessageCount; i++) {
    initMessages.push({
      id: i + 1,
      content: generateRandomContent(),
      position: Math.random() > 0.5 ? 'left' : 'right',
      animationDelay: i * 1, // 初始化消息间隔1秒
      isNew: false // 标记是否为新增消息
    });
  }
  messageList.value = initMessages;
};

/**
 * 处理发送消息（插队到最新）
 */
const handleSend = () => {
  const content = inputContent.value.trim();
  if (!content) return;

  // 新增消息：ID自增，动画延迟为0（立即执行），标记为新增
  const newMsg = {
    id: msgId++,
    content,
    position: Math.random() > 0.5 ? 'left' : 'right',
    animationDelay: 0, // 新增消息插队，无延迟
    isNew: true
  };

  // 插入到消息列表最前面（插队到最新）
  messageList.value.unshift(newMsg);

  // 重新计算所有非新增消息的动画延迟（保持排队效果）
  //   messageList.value.forEach((msg, index) => {
  //     if (!msg.isNew) {
  //       // 非新增消息的延迟 = 索引 * 1秒（确保排队顺序）
  //       msg.animationDelay = index * 2;
  //     }
  //   });

  // 清空输入框
  inputContent.value = '';

  // 滚动到底部，确保新增消息可见
  //   nextTick(() => {
  //     scrollToBottom();
  //   });
};

/**
 * 滚动到容器底部
 */
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

/**
 * 排序后的消息列表（确保显示顺序正确）
 * 新增消息始终在最前面（最新），初始化消息按ID顺序排列
 */
const sortedMessageList = computed(() => {
  // 深拷贝避免修改原数据
  return [...messageList.value].sort((a, b) => {
    // 新增消息排在前面
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    // 同类型消息按ID降序（最新的在前面）
    return b.id - a.id;
  });
});

// 组件挂载后初始化消息并滚动到底部
onMounted(() => {
  initMessages();
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style lang="less" scoped>
// 主容器样式
.chat-container {
  width: 100%;
  height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

// 消息列表容器：隐藏滚动条，设置相对定位用于动画参考
.message-list {
  flex: 1;
  overflow-y: auto;
  position: relative;
  // 隐藏滚动条（兼容主流浏览器）
  -ms-overflow-style: none;
  /* IE 和 Edge */
  scrollbar-width: none;
  /* Firefox */

  // 隐藏 WebKit 内核浏览器滚动条
  &::-webkit-scrollbar {
    display: none;
  }
}

// 消息项容器：设置绝对定位，确保气泡从底部开始弹出
.message-item {
  display: flex;
  position: absolute;
  bottom: 20px; // 与容器内边距一致，从底部开始
  animation: bubbleAnimation 6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px); // 初始位置在底部外侧
  z-index: 1; // 确保后出现的消息在上面

  // 左侧消息：靠左定位
  &.left {
    left: 20px;
    align-items: flex-end;

    .bubble {
      background: #ffffff;
      border-top-left-radius: 0;
      margin-right: 8px;
    }
  }

  // 右侧消息：靠右定位
  &.right {
    right: 20px;
    flex-direction: row-reverse;
    align-items: flex-end;

    .bubble {
      background: #4f46e5;
      color: #ffffff;
      border-top-right-radius: 0;
      margin-left: 8px;
    }
  }

  // 新增消息特殊样式（可选，用于区分）
  &:has(.bubble-content):nth-child(1) {
    z-index: 10; // 最新消息层级最高
  }
}

// 头像样式
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 毛玻璃果冻气泡核心样式 */
.bubble {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  z-index: 0;
  padding: 3px;
  /* 边框厚度 */
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  /* 毛玻璃模糊核心 */
  background: rgba(255, 255, 255, 0.15);
  /* 基础透明背景 */
}

/* 外层渐变流动边框 */
.bubble::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 8px;
  z-index: -2;
  background: linear-gradient(45deg,
      #8B5CF6,
      /* 紫 */
      #EC4899,
      /* 粉 */
      #06B6D4,
      /* 青 */
      #8B5CF6
      /* 回到紫色形成循环 */
    );
  background-size: 400% 400%;
  animation: wave 8s linear infinite;
  will-change: background-position;
  filter: blur(2px);
  /* 边框轻微模糊，增强毛玻璃融合感 */
}

/* 内层毛玻璃背景 */
.bubble::after {
  content: '';
  position: absolute;
  inset: 3px;
  /* 与 padding 一致，控制边框宽度 */
  background: rgba(255, 255, 255, 0.7);
  /* 毛玻璃底色（透明+白色） */
  border-radius: 8px;
  z-index: -1;
  backdrop-filter: blur(8px);
  /* 内层模糊，增强通透感 */
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  /* 毛玻璃阴影 */
}

/* 悬停增强效果 */
.bubble:hover::before {
  animation-duration: 4s;
  /* 加速流动 */
  filter: blur(3px);
}

.bubble:hover {
  animation: bounceSoft 2s ease-in-out infinite;
  /* 果冻弹性 */
  background: rgba(255, 255, 255, 0.25);
  /* 悬停时更通透 */
}

/* 内容容器（增强毛玻璃层次感） */
.bubble-content {
  position: relative;
  z-index: 1;
  border-radius: 8px;
  padding: 10px;
  background: transparent;
  /* 继承毛玻璃背景 */
  color: #333;
  /* 文字颜色，深色背景可改为白色 */
  margin: 0;
  word-break: break-word;
  font-size: 14px;
}

/* 动画关键帧 */
@keyframes wave {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes bounceSoft {

  0%,
  100% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.02);
  }

  75% {
    transform: scale(0.98);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .bubble {
    border-radius: 18px;
    padding: 2px;
  }

  .bubble::before {
    inset: -4px;
    border-radius: 22px;
  }

  .bubble::after {
    inset: 2px;
    border-radius: 17px;
  }

  .bubble-content {
    border-radius: 16px;
    padding: 10px;
  }
}


// 输入区域
.input-area {
  display: flex;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background-color: #ffffff;

  .input-box {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    resize: none;
    outline: none;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .send-btn {
    margin-left: 12px;
    padding: 0 24px;
    background-color: #4f46e5;
    color: #ffffff;
    border: none;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #4338ca;
    }

    &:disabled {
      background-color: #a5b4fc;
      cursor: not-allowed;
    }
  }
}

// 气泡动画：从底部（容器底部）渐入，上升到中上部后淡出
@keyframes bubbleAnimation {
  0% {
    opacity: 0;
    transform: translateY(10vh); // 初始位置在底部外侧
  }

  20% {
    opacity: 1;
    transform: translateY(0); // 到达底部显示位置
  }

  70% {
    opacity: 1;
    // 上升到容器中上部（根据容器高度调整，这里按 90vh 高度计算，上升 200px 左右）
    transform: translateY(-50vh);
  }

  100% {
    opacity: 0;
    transform: translateY(-60vh); // 中上部完全消失
  }
}

// 响应式调整
@media (max-width: 768px) {
  .chat-container {
    height: calc(100vh - 40px);
    margin: 20px 0;
  }

  .bubble {
    max-width: 70vw;
  }

  // 移动端调整上升距离，适配屏幕高度
  @keyframes bubbleAnimation {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }

    20% {
      opacity: 1;
      transform: translateY(0);
    }

    70% {
      opacity: 1;
      transform: translateY(-50vh); // 移动端上升距离稍短
    }

    100% {
      opacity: 0;
      transform: translateY(-60vh);
    }
  }
}
</style>
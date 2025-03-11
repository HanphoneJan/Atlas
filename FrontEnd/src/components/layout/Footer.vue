<!-- 页脚组件 -->
<template>
  <el-footer class="footer">
    <span>访问量: {{ visitCount }}</span>
  </el-footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ENDPOINTS } from '@/constants/api';

const visitCount = ref(0);

/**
 * 在组件挂载时获取访问计数。
 * 通过调用指定的 API 端点获取访问计数，并将其存储在 visitCount 中。
 * 如果请求失败，将在控制台输出错误信息。
 */
onMounted(async () => {
  try {
    const response = await axios.get(ENDPOINTS.VISITCOUNT);
    console.log(response.data);
    visitCount.value = response.data.visitCount;
  } catch (error) {
    console.error('获取访问量失败:', error.message);
  }
});
</script>

<style scoped>
.footer {
  background-color: rgba(240,240,240,0.7);
  height: 4vh;
  text-align: center;
  padding: 4px 0;
  font-family:Courier,Kaiti, monospace,CustomFont;
}

.dark .footer {
  background-color:#051221;
}
</style>

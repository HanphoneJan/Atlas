<!-- 管理员界面框架 -->
<template>
  <div>
    <AdminNav />
  </div>
  <el-main>
      <router-view></router-view>
    </el-main>
</template>
  
<script setup lang = "ts">
import AdminNav from '@/components/layout/AdminNav.vue'; // 导入 AdminNav 组件
import { onMounted } from 'vue';
onMounted(() => {
    console.log('管理员界面挂载');
});
</script>
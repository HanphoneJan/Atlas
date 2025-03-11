<!-- 顶部导航栏组件 -->
<template>
  <div class="nav-container">
    <!-- /**
     * @property {String} activeIndex - 当前激活的菜单项索引。
     * @method handleSelect - 处理菜单项选择事件。
     * 菜单项包括：
     * - 照片墙
     * - 上传
     * - 博客
     * - 管理照片墙（仅在用户为管理员时显示）
     */ -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">照片墙</el-menu-item>
      <el-menu-item index="2">上传</el-menu-item>
      <el-menu-item index="3">博客</el-menu-item>
      <el-menu-item index="4" v-show="userStore.isAdmin">管理照片墙</el-menu-item>
    </el-menu>

      <div class="search_input">
        <!-- /**
         * 搜索输入框组件
         * @description 该组件用于用户输入搜索内容，支持聚焦和失去焦点事件。
         * @events
         * @focus 触发时调用 checkInput 方法
         * @blur 触发时调用 notSearching 方法
         * @input 触发时调用 searchItems 方法
         * v-model {String} searchInput - 绑定的搜索输入值
         */ -->
        <el-input
                @focus="checkInput"
                @blur="notSearching()"
                class="search"
                placeholder="请输入内容"
                prefix-icon="Search"
                v-model="searchInput"
                @input="searchItems" 
                size="small"
                clearable>
        </el-input>
    <!-- 搜索完成后显示的列表 -->
    <ul v-if="!searching && searchList.length" class="search-suggestions">
      <li
        v-for="item in searchList"
        :key="item.id"
        @click="getItemInfo(item.path)"
      >
        <a>{{ item.title }}</a>
      </li>
    </ul>
    </div>
    <el-button class="login-button" @click="handleLogin">登录</el-button> <!-- 独立的登录按钮 -->
    <el-button class="theme-toggle-button" @click="toggleTheme">
      <!-- 切换主题按钮图标,is-loading使其具有旋转效果 -->
      <el-icon class="is-loading" v-if="userStore.theme === 'dark'">
        <Moon />
      </el-icon>
      <el-icon class="is-loading" v-else>
        <Sunny />
      </el-icon>
    </el-button> <!-- 切换主题按钮 -->
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/store';
import axios from 'axios';
import { ENDPOINTS } from '@/constants/api';
const userStore = useUserStore();
const activeIndex = ref('1'); 
const router = useRouter();
const searching = ref(false);
const searchInput = ref('');
const searchList = ref([]);

//监听 theme 状态变化，应用到 HTML 上
watchEffect(() => {
  const htmlClassList = document.documentElement.classList
  if (userStore.theme=== 'dark') {
    document.documentElement.classList.add('dark-theme');
    htmlClassList.add('dark') 
  } else {
    document.documentElement.classList.remove('dark-theme');
    htmlClassList.remove('dark')
  }
});

// 图集项接口定义，描述每个图集项的结构
interface AtlasItem {
  id: number;
  path:string;
  author: string;
  title: string;
}

const routeMap = {
  '1': '/index',
  '2': '/upload',
  '3': '/blog',
  '4': '/admin',
};

// 处理导航选择事件，根据选择的键推送相应的路由并更新用户状态管理中的页面名称。
const handleSelect = (key) => {
  const route = routeMap[key];
  const pageName = route.slice(1); // 从路由中提取页面名称
  if (route) {
    router.push(route);
    userStore.changePage(pageName); // 修改页面名称
  } else {
    console.warn(`没有找到路由: ${key}`);
  }
};

const handleLogin = () => {
  router.push('/login'); // 登录页面跳转逻辑
};

/**
 * 切换主题的函数
 * 根据当前主题状态，在'light'和'dark'之间切换，并相应地更新文档元素的类名以应用主题样式。
 * 同时，通过用户存储（userStore）更改主题设置，并在控制台输出当前主题。
 */
const toggleTheme = () => {
  if(userStore.theme === 'dark'){
    userStore.changeTheme('light');
  } else {
    userStore.changeTheme('dark');
  }
};

// 实时搜索
const searchItems = async () => {
  // 如果输入框为空，清空搜索列表并停止搜索状态
  if (!searchInput.value.trim()) {
    searchList.value = [];
    searching.value = false;
    return;
  }
  // 设置正在搜索状态
  searching.value = true; 
  try {
    // 获取搜索结果
    searchList.value = await fetchSearchResults(searchInput.value);
  } catch (error) {
    console.error("搜索错误:", error.message);
    searchList.value = [];
  } finally {
    searching.value = false; // 无论成功或失败，停止搜索状态
  }
};

// 搜索 API 请求
const fetchSearchResults = async (query: string) => {
  try {
    // 准备要发送到服务器的数据
    const postData = { query: query };
    // 发送 POST 请求到后台
    const response = await axios.post(ENDPOINTS.SEARCH, postData);
    // 如果后台响应成功，处理数据
    if (response.data.status === 830) {
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // 返回筛选后的数据
      return data;
    }
    return [];
  } catch (error) {
    console.error('获取图集数据失败:', error.message);
    return [];
  }
};

// 获取单个项目详细信息
const getItemInfo = (path: string) => {
  window.location.href = path; // 跳转到目标路径
  searching.value = false; // 停止搜索状态
  searchList.value = []; // 清空搜索列表
};

// 处理输入框聚焦，启动搜索
const checkInput = () => {
  searching.value = true;
};

// 处理输入框失去焦点，延时停止搜索状态
let timeout; // 用于存储定时器ID，防止多次失焦重复调用
/**
 * notSearching 函数用于延时清除搜索状态。
 * 在失去焦点时，避免立即停止搜索，提供更好的用户体验。
 * 该函数会在 200 毫秒后将 searching 状态设置为 false，并清空 searchList。
 */
const notSearching = () => {
  // 使用延时清除搜索状态，避免在失焦时立即触发停止
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searching.value = false; // 停止搜索状态
    searchList.value = []; // 清空搜索列表
  }, 200);
};


</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d0ffff;
  padding: 0 20px;
  flex-wrap: wrap;
  margin: 0;
  font-family:Courier,Kaiti, monospace,CustomFont;
  font-size:larger;
  font-weight: 700;
}

.el-menu-demo {
  background-color: #d0ffff;
  color: #000000;
  flex: 1;
  min-width: 200px;
  border:none;
}

.el-menu-demo .el-menu-item {
  color: #000000;
}

.el-menu-demo .el-menu-item:hover {
  background-color: #1f2d3d;
}

.login-button {
  font-family:Courier,Kaiti, monospace,CustomFont ;
  border: none;
  margin-left: 20px;
  font-weight: 700;
  padding-top: 10px;
}

.login-button:hover {
  background-color: #3a4a5a;
}

/* 切换主题按钮 */
.theme-toggle-button { 
  border: none;
  margin-left: 20px;
  font-size: 18px; /* 调整图标大小 */
}

.theme-toggle-button:hover {
  background-color: #3a4a5a;
}


/* 搜索框样式 */
.search-image {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    padding-left: 20px;
    padding-right: 20px;
  }

.search-suggestions {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 40px;
  width: 100%;
  max-width: 190px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10; /* 确保搜索结果列表在顶部 */
  border-radius: 2%;
}

/* 搜索选项样式 */
.search-suggestions li {
  padding: 6px;
  font-size: 14px; /* 调整字体大小 */
  cursor: pointer;
}

.search-suggestions li:hover {
  background-color: #f5f5f5;
}

.dark-theme .search-suggestions li:hover{
  background-color: #191313;
}

/* 暗夜模式样式 */
.dark-theme .nav-container{
  background-color: #0F3057; /* 背景色 */
  color: #fff; /* 文字颜色 */
} 

.dark-theme .el-menu-demo {
  background-color: #0F3057; /* 导航栏背景色 */
}

.dark-theme .el-menu-demo .el-menu-item {
  color: #fff;
}

.dark-theme .el-menu-demo .el-menu-item:hover {
  background-color: #0F3057;
} 

/* 移动端隐藏搜索框 */
@media screen and (max-width: 768px) {
  .nav-container {
     padding:0 10px;
  }

  .search_input {
    display: none;
  }

  .login-button {
  margin-left: 10px;
}
}
</style>

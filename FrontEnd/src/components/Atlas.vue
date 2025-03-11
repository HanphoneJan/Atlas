<!-- 照片墙页面，欢迎页面，轮播图，标签选择器和照片墙组成 -->
<template>
  <!-- 欢迎页面内容 -->
  <transition name="fade" mode="out-in">
    <div key="welcome-page">
      <el-row style="height: 95vh" class="welcome-row">
        <el-col :span="24" style="height: 100%">
          <el-card shadow="hover" class="welcome">
            <h1 class="tit">
              {{ welcomeTitle }}
              <div class="border"></div>
            </h1>
            <h2 class="intro">{{ intro }}</h2>
            <!-- 点击箭头触发 startRead 函数 -->
            <div class="bounce down" @click="handleClick">
              <!-- vue3引入icon要这样用 -->
              <el-icon style="color:white;"><ArrowDownBold /></el-icon> 
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 轮播图组件 -->
      <SlideShow />
  <!-- 标签选择器 -->
  <div class="tag-filter">
    <div>

     <div  class="tags-container">
      <div class="tags-title">
      标签
     </div>
      <el-tag
        v-for="(tag, index) in sortedTags"
        :key="tag.id"
        :type="selectedTags.includes(tag.id) ? 'success' : 'info'"
        size="default"
        :closable="selectedTags.includes(tag.id)"
        @click="toggleTag(tag.id)"
        @close="handleClose(index)"
        class="tag-item"
        clearable="false"
      >
        {{ tag.name }}
      </el-tag>
     </div>
    </div>
  </div>

      <div class="atlas-container" id="atlas-container">
        <div class="masonry-columns">
          <div 
            v-for="item in filteredAtlasData" 
            :key="item.id" 
            class="grid-item"
            >
            <el-card :body-style="{ padding: '0px' }" >
        <el-image 
          :src="item.path" 
          class="image" 
          lazy 
          preview-teleported 
          :preview-src-list="[item.path]"
        />
              <div>
                <span class="img-title">标题：{{ item.title }} 作者：{{ item.author }}</span>
                 <div class="likesWarpper">
                  <el-icon id="heart-icon" @click="handleLikes(item)">
                    <img :src="item.isLiked ? RedHeartIcon : HeartIcon" alt="heart" style="width: 1em; height: 1em;">
                  </el-icon>

                </div>
                <div class="likes" >点赞：{{ item.likes }}</div>
              </div>
              <div class="img-description">
                <span>简介：{{ item.description }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import axios from 'axios';
import { ENDPOINTS } from '@/constants/api';
import SlideShow from './layout/SlideShow.vue';
import HeartIcon from '@/assets/heart.svg';
import RedHeartIcon from '@/assets/redheart.svg';
// 标签接口定义，描述每个标签的结构
interface Tag {
  id: number | null;
  name: string;
}
// 图集项接口定义，描述每个图集项的结构
interface AtlasItem {
  id: number;
  path: string;
  author: string;
  title: string;
  description: string;
  likes: number;
  type: number;
  upload_time: string;
  isLiked: boolean;
  tags:Tag[];
  username: string;
}
//标签列表
const tagsList = ref<Tag[]>([]);
// 存储从 API 获取的图集数据
const atlasData = ref<AtlasItem[]>([]);
// 用于存储按点赞量排序后的图集数据
const sortedAtlasData  = ref<AtlasItem[]>([]);
const selectedTags = ref<number[]>([]); // 用于存储选中的标签 id
// 定时器存储，类型使用 ReturnType<typeof setTimeout>，保证类型正确
let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
// 用于显示照片墙的简介
const intro = ref('这是寒枫的照片墙，你可以自由上传图片！');
const welcomeTitle = ref('欢迎来到寒枫の照片墙');
//组件挂载时执行
onMounted(async () => {
  // 获取标签列表
  getTag();
  // 加载图集数据
  atlasShow();
  // 自动执行 startRead 如果 3 秒内没有点击
  startReadTimeout();
});

// 计算排序后的标签列表：选中的标签排在前面
const sortedTags = computed(() => {
  return [
    ...tagsList.value.filter((tag) => selectedTags.value.includes(tag.id)),
    ...tagsList.value.filter((tag) => !selectedTags.value.includes(tag.id)),
  ];
});

// 切换标签的选中状态
const toggleTag = (tagId) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter((id) => id !== tagId);
  } else {
    selectedTags.value.push(tagId);
  }
};

// 关闭标签（仅限于选中的标签）
const handleClose = (index) => {
  selectedTags.value.splice(index, 1);
};

// 获取图集数据
const atlasShow = async ()=>{
  try {
    // 向后端请求图集数据
    const response = await axios.get(ENDPOINTS.SHOW);
    if (response.data.status === 830) {
      atlasData.value = response.data.data;
      //按照点赞量进行排序
      sortedAtlasData.value = [...atlasData.value].sort((b, a) => a.likes - b.likes);
    }
  } catch (error) {
    console.error('获取图集数据失败：', error.message);
  }
}

// 获取标签列表
const getTag = async()=>{
  try {
    // 向后端请求图集数据
    const response = await axios.get(ENDPOINTS.GETTAG);
    if (response.data.status === 830) {
      tagsList.value = response.data.data;
    }
  } catch (error) {
    console.error('获取标签列表失败:', error.message);
  }
}

// 过滤图集数据，仅显示选中的标签对应的图集
const filteredAtlasData = computed(() => {
  // 确保 selectedTags 是普通数组，并且所有 ID 转换为 Number
  const rawSelectedTags = selectedTags.value.map(id => Number(id)); 
  console.log('选中的标签:', rawSelectedTags); // 确保它是普通数组
  if (rawSelectedTags.length === 0) {
    return sortedAtlasData.value;
  }
  const result = sortedAtlasData.value.filter(item => {
    // 只有当 item.tags **包含所有 selectedTags** 时才返回 true
    const isMatch = rawSelectedTags.every(tagId => 
      item.tags.some(tag => tag.id !== null && Number(tag.id) === tagId)
    );
    console.log(`检查图集项 ${item.id}, 是否符合所有选中标签:`, isMatch);
    return isMatch;
  });
  return result;
});

// 启动阅读并滚动到指定位置
const startRead = () => {
  const atlasContainer = document.getElementById('atlas-container');
  if (atlasContainer) {
    // 平滑滚动到图集内容区域
    atlasContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// 处理点击事件，清除定时器并手动触发 startRead
const handleClick = () => {
  // 清除定时器，避免自动滚动触发
  clearTimeout(timerId);
  startRead(); // 手动触发滚动
};

// 设置自动启动定时器，若 3 秒内没有点击，则自动滚动
const startReadTimeout = () => {
  timerId = setTimeout(() => {
    startRead(); // 自动触发滚动
  }, 3000); // 3秒后自动执行 startRead
};

// 点赞处理函数
const handleLikes = (item: AtlasItem) => {
  // 判断当前是否已经点赞，防止重复点赞
  if (item.isLiked) {
    return;
  }
  axios.post(ENDPOINTS.LIKES, { id: item.id }).then(response => {
    if (response.data.status === 830) {
      item.isLiked = true; // 点赞成功，更新图标颜色
      item.likes++; // 更新点赞数
      console.log(response.data.message);
    } else {
      console.error('点赞失败:', response.data.message);
    }
  }).catch(error => {
    console.error('点赞失败:', error.message);
  });
};

watchEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      welcomeTitle.value = '寒枫の照片墙';
    } else {
      welcomeTitle.value = '欢迎来到寒枫の照片墙';
    }
  };
  handleResize(); // 初始化时调用一次
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

</script>

<style scoped>

/* 设置背景图片和样式 */
.welcome-row {
  background-image: url('@/assets/chiikawa.webp'); /* 设置背景图片路径 */
  background-size: cover;
  background-position: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 欢迎卡片样式 */
.welcome {
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 100%;
  position: relative;
}

/* 边框动画样式 */
.border {
  width: 812px;
  height: 112px;
  position: absolute;
  top: -6px;
  left: -6px;
  border: 3px solid white;
  box-sizing: border-box;
  /* clipMe效果是一个边框动画，可以自行调整 */ 
  animation: clipMe 5s linear infinite;
}

/* 标题样式 */
.tit {
  box-sizing: border-box;
  position: relative;
  width: 800px;
  height: 100px;
  line-height: 100px;
  box-shadow: inset 0 0 0 1px white;
  margin: 40px auto;
  margin-top: 80px;
  color: rgb(77, 77, 77,1);
  text-align: center;
  font-size: 50px;
  font-weight: normal;
  letter-spacing: 10px;
  font-family:Courier,Kaiti, monospace,CustomFont;
}

/* 简介文本样式 */
.intro {
  letter-spacing: 5px;
  line-height: 50px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  font-weight: normal;
  color: rgba(77,77,77,1);
  font-family:Courier,Kaiti, monospace,CustomFont;
}

/* 向下箭头样式，包含动画效果 */
.down {
  animation: bounce 2s infinite;
  animation-duration: 3s;
  font-size: 25px;
  position: absolute;
  bottom: 8vmin;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #fff;
}

/* 向下箭头鼠标放置效果 */
.down:hover {
  animation: none;
  cursor: pointer;
  box-shadow: 0 0 20px 0 white;
  transition: all .2s;
}

/* 标签选择器容器 */
.tag-filter {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width:auto;
  font-family:Courier,Kaiti, monospace,CustomFont;
  font-size: medium;
  color: #333;
  margin-top: 8px;
  margin-bottom: 8px;
}
/* 标签选择器样式 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tags-title{
 padding: 1px 2px;
}

/* 单个标签样式 */
.tag-item {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 14px;
  padding: 6px 12px;
}
.tag-item:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.tag-item.el-tag--success {
  background:  #d0ffff;
  color: #333;
  border: none;
}
.tag-item.el-tag--info {
  background: #ebebeb;
  color: #333;
  border: none;
}


/* Masonry布局,图集样式，非常重要！！！ */
/* 在这里我认为masonry布局比el-col,el-row布局和grid布局都更好，能够灵活适应图片长度 */
.masonry-columns {
  column-count: 4; /* 默认4列 */
  column-gap: 20px;
}
.masonry-item {
  break-inside: avoid; /* 重要：防止元素被分割 */
  margin-bottom: 100px;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .masonry-columns { column-count: 3; }
}
@media (max-width: 992px) {
  .masonry-columns { column-count: 2; }
}
@media (max-width: 768px) {
  .masonry-columns { column-count: 1; }
}

.masonry-item {
  transition: transform 0.3s, box-shadow 0.3s;
}

.masonry-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 卡片之间的间距 */
.el-card{
  margin-bottom: 12px;
}

/* 卡片内部样式 */
.image{
  width: 100%;
  height: auto;
  object-fit:contain;
  background-color: #f0f0f0;
  min-height: 200px; /* 占位高度 */
}
/* 卡片标题 */
.img-title{
  height: 10%;
  font-family: Courier,Kaiti, monospace,CustomFont;
  font-size:medium;
}
.img-description{
  height: 10%;
  margin-bottom: 0.4em;
  font-size:medium;
  font-family: Courier,Kaiti, monospace,CustomFont;
}
/* 点赞图标 */
#heart-icon{
  font-size:1.5em;
  float: right;
  margin-right: 1em;
  margin-top: 0.1em;
  justify-self: center;
}
.likes{
  font-family: Courier,Kaiti, monospace,CustomFont;
  font-size: medium;
}



/* 动画过渡效果 */
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

/* 边框动画 */
@keyframes clipMe {
  0%, 100% {
    clip: rect(0px, 806px, 6px, 0px);
  }

  25% {
    clip: rect(0px, 6px, 112px, 0px);
  }

  50% {
    clip: rect(112px, 812px, 112px, 0px);
  }

  75% {
    clip: rect(0px, 812px, 112px, 806px);
  }
}

/* 向下动画效果 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translate(-50%, 0);
  }
  40% {
    transform: translate(-50%, -30px);
  }
  60% {
    transform: translate(-50%, -15px);
  }
}

/* 过场动画响应式调整  */
@media screen and (max-width: 768px) {

  .welcome-row {
    background-image: url('@/assets/chiikawa3.jpg');
  }

    .welcome {
      width: 100%;

      .border {
        display: none;
      }

      .tit {
        font-size: 2rem;
        width: 100%;
        line-height: 50px;
        letter-spacing: 2px;
        height: auto;
      }

      .intro {
        font-size: 1rem;
        line-height: 30px;
      }
    }
  }


/* 自定义黑夜样式 */
/* 换背景图片和主题色 */
  .dark-theme .welcome-row{
    background-image: url('@/assets/bg_1.jpg'); /* 设置背景图片路径 */
  }
  .dark-theme .welcome{
    background-color: rgba(0, 0, 0, 0.1);
  }
  .dark-theme .tit{
    color: white;
  }
  .dark-theme .intro{
    color: white;
  }
  .dark-theme .tags-container {
  background: #2a2a2a;
 }
 .dark-theme .tag-filter{
  color: #e6dddd;
  background-color: #171515;
 }
 .dark-theme .tag-item.el-tag--success {
  background: linear-gradient(135deg, #1b4044, #085048);
  color: #fff;

}
 .dark-theme .tag-item.el-tag--info {
  color:#e6dddd;
  background: #141e20;
}

</style>
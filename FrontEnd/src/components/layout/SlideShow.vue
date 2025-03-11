<!-- 轮播图组件 -->
<template>
  <!-- /**
   * 该组件使用 Element UI 的 el-carousel 和 el-carousel-item 组件实现一个自动播放的轮播图。
   * @property {number} interval - 轮播图切换的时间间隔，单位为毫秒，默认为 5000。
   * @property {Array} images - 轮播图显示的图片数组，每个图片对象应包含 id 和 img 属性。
   */ -->
  <el-carousel :interval="5000" arrow="always" id="carousel">
    <el-carousel-item v-for="item in images" :key="item.id">
      <img :src="item.img" class="carousel-image" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const images = ref([]);

// 获取图片数据，可以改为从后端获取
onMounted(async () => {
  // 生成图片URI
  for (let i = 1; i <= 4; i++) {
    const imgUrl = `https://www.hanphone.top/storage/atlas/bg_${i}.jpg`; // 图片地址
    images.value.push({ id: i, img: imgUrl });
  }
});
</script>

<style scoped>
/* 轮播图整体样式 */
#carousel {
  width: 100%;
  height: 60vh; /* 图片占据的高度*/
  border-top:4px solid #e3e3e3;
  border-bottom:4px solid #e3e3e3;
}
:deep(.el-carousel__container) {
    height:100%;
} 
/* 轮播图图片样式 */
.carousel-image {
  width: 100%;
  height: 100%;
  /* 保持图片比例 */
  object-fit: scale-down;  
}

@media screen and (max-width: 768px) {
  /* 调整移动端轮播图高度 */
  #carousel {
    height: 40vh;
  }
}
/* 暗夜模式 */
.dark #carousel {
  border-top:4px solid #333;
  border-bottom:4px solid #333;
}
</style>

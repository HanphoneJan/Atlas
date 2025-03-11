<template>
    <div class="upload-wrapper">
      <div class="upload-container">
          <el-form ref="uploadForm" :model="form" label-width="120px">
              <el-form-item label="照片">
                  <el-upload
                      list-type="picture-card"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                       v-model:file-list="fileList"
                      :before-upload="beforeUpload"
                      :auto-upload="false"
                      >
                      <el-icon><Plus /></el-icon>
                  </el-upload>
                  <!-- 使用 ElImageViewer 组件实现图片预览-->
              <el-image-viewer
                v-if="previewVisible"
                :url-list="previewUrlList"
                :initial-index="previewIndex"
                @close="previewVisible = false"
              />
              </el-form-item>
              <el-form-item label="照片名字">
                  <el-input v-model="form.title" placeholder="请输入照片名字"></el-input>
              </el-form-item>
              <el-form-item label="照片作者">
                  <el-input v-model="form.author" placeholder="请输入照片作者"></el-input>
              </el-form-item>
              <el-form-item label="照片说明">
                  <el-input v-model="form.description" placeholder="请输入照片说明"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button @click="submitForm">提交</el-button>
                  <el-button @click="resetForm">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useUserStore } from '@/store/store';
import axios from 'axios';
import {  ElImageViewer, ElMessage } from 'element-plus';
import { ENDPOINTS } from '@/constants/api';
const userStore = useUserStore();
const form = ref<{ title?: string; author?: string; description: string }>({
      title: '',
      author: '',
      description: '',
});
const fileList = ref<Array<any>>([]);  // 上传的文件列表
  
/**
 * 在上传文件之前进行验证。 
 * @param {any} file - 要上传的文件对象。
 * @returns {boolean} - 如果文件是图片且大小不超过100MB，返回true；否则返回false。
 * @throws {ElMessage.error} - 如果文件类型不是图片，或文件大小超过限制，将显示错误消息。
 */
const beforeUpload = (file: any) => {
  const isImage = file.type.startsWith('image/');
  const isLtM = file.size / 1024 / 1024 < 100; // 限制文件大小

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
  }
  if (!isLtM) {
    ElMessage.error('文件大小不能超过100MB!');
  }
  return isImage && isLtM;
};

// 图片预览相关状态
const previewVisible = ref(false); // 是否显示预览
const previewUrlList = ref<string[]>([]); // 预览的图片 URL 列表
const previewIndex = ref(0); // 当前预览的图片索引

// 图片预览处理
/**
 * 处理文件预览的函数
 * @param {any} file - 需要预览的文件对象
 * 此函数会根据传入的文件对象设置预览的图片 URL 列表和当前预览的图片索引，并显示预览界面。
 */
const handlePreview = (file: any) => {
  // 设置预览的图片 URL 列表
  previewUrlList.value = fileList.value.map((f) => f.url);
  // 设置当前预览的图片索引
  previewIndex.value = fileList.value.findIndex((f) => f.uid === file.uid);
  // 显示预览
  previewVisible.value = true;
};

/**
 * 处理文件移除操作
 * @param {any} file - 要移除的文件对象
 * @param {Array<any>} files - 当前文件列表
 * 从文件列表中移除指定的文件，并显示相应的提示信息。
 * 如果文件成功移除，将显示成功消息；如果未找到文件，将显示警告消息。
 */
const handleRemove = (file: any, files: Array<any>) => {
  // 从 fileList 中移除该文件
  const index = fileList.value.findIndex((f) => f.uid === file.uid);
  if (index !== -1) {
    fileList.value.splice(index, 1);
    ElMessage.success('文件删除成功');
  } else {
    ElMessage.warning('文件未找到');
  }
};

  
/**
 * 提交表单数据并上传文件
 * 此函数用于验证表单输入和文件列表，确保所有必填项均已填写，并且上传的文件数量在允许范围内。
 * 如果验证通过，将构建一个 FormData 对象并通过 Axios 向服务器发送 POST 请求。
 */
const submitForm = () => {
  // 验证表单输入和文件列表
  if (!form.value.title || !form.value.author || !form.value.description) {
    ElMessage.error('请填写所有必填项!');
    return;
  }
  if (fileList.value.length === 0) {
    ElMessage.error('请上传至少一张图片!');
    return;
  }
  if (fileList.value.length > 0) {
    ElMessage.error('一次性上传文件不能超过十张!');
    return;
  }
  // 构建 FormData 对象
  const formData = new FormData();
  fileList.value.forEach(file => {
          formData.append('files[]', file.raw);
  });
  console.log('formData:', form.value);
  formData.append('title', form.value.title || '未命名');
  formData.append('author', form.value.author || '佚名');
  formData.append('description', form.value.description || '无');
  formData.append('username', userStore.username || '游客');
  // 发送 POST 请求
      axios.post(ENDPOINTS.UPLOAD, formData,{
        headers: {
              'Content-Type': 'multipart/form-data',
          },
      })
      .then(response => {
              if (response.data.status === 830) {
                  ElMessage.success('提交成功');
                  resetForm();
              } else {
                  ElMessage.error('提交失败');
                  console.log('提交失败:' + response.data.message);
              }
          })
      .catch(error => {
              ElMessage.error('提交出错');
              console.error('提交出错:' , error.message);
      });
};
  
/**
 * 重置表单字段和文件列表。
 * 将表单中的标题、作者和描述字段清空，并清空文件列表。
 */
const resetForm = () => {
      form.value.title = '';
      form.value.author = '';
      form.value.description = '';
      fileList.value = [];
};
  
//监听 theme 状态变化，应用到 HTML 上
watchEffect(() => {
  if (userStore.theme=== 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light-theme');
  }
});
</script>
  
<style scoped>
/* 整个页面的背景图片 */
.upload-wrapper {
  background-image: url('@/assets/chiikawa.webp'); /* 设置背景图片路径 */
  background-size: cover;
  background-position: center;
  height: 90vh; /* 让背景覆盖整个视窗 */
  display: flex;
  justify-content: center; /* 让容器水平居中 */
  align-items: center;
}
  
/* 上传表单容器 */
.upload-container {
  max-width: 600px;
  width: 100%; /* 使容器自适应宽度 */
  padding: 20px;
  height: 50vh;
  background-color: transparent; /* 使容器透明 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px); /* 添加毛玻璃效果，blur(10px) 设定模糊度 */
  border-radius: 8px;
  margin-top: 1vh;
  display: flex;
  align-items: center;
}

/* 聚焦时的边框颜色 */
.el-input.is-focus {
  border-color: #007bff; /* 聚焦时边框颜色 (深蓝) */
  box-shadow: 0 0 2px rgba(0, 123, 255, 0.6); /* 聚焦时的阴影效果 */
}

/* 输入框文本的样式 */
.el-input__inner {
  color: #94b6e0; /* 设置文本颜色 */
}

:deep(.el-form-item__label){
  font-size: 16px;
  font-weight: 600;
}


/* 光标颜色 */
.el-input__inner:focus {
  color: #007bff; /* 聚焦时文本颜色 */
  border-color: #007bff; /* 聚焦时边框颜色 */
}

/* 设置输入框清除按钮的样式 */
.el-input__suffix .el-input__clear {
  color: #007bff; /* 清除按钮的颜色 */
  transition: color 0.2s ease;
}


.el-button{
  font-family:Courier,Kaiti, monospace,CustomFont;
  font-weight: 600;
  padding-top: 12px;
}

/* 响应式设计，当屏幕宽度小于768px时 */
@media (max-width: 768px) {
  .upload-wrapper {
      background-image: url('@/assets/chiikawa3.jpg'); /* 设置背景图片路径 */
  }

  .upload-container {
    padding: 10px;
    height: 100vh; /* 让背景覆盖整个视窗 */
    backdrop-filter: blur(3px);
   }
  
  .el-form-item__label {
    flex: 0 0 100px;
  }
}

/* 深色主题样式 */
.dark-theme .upload-wrapper{
  background-image: url('@/assets/bg_1.jpg'); /* 设置背景图片路径 */
}
</style>
  
<template>
  <div class="table-container">
    <el-table :data="atlasData" class="responsive-table" border>
      <!-- /**
       * @description 表格列用于展示图片。
       * @component AdminAtlas.vue
       * @slot default - 自定义插槽，显示每行数据的图片。
       * @param {Object} scope - 当前行的数据上下文。
       * @param {string} scope.row.path - 图片的路径，用于显示和预览。
       */ -->
      <el-table-column label="图片">
        <template #default="scope">
          <el-image
            :src="scope.row.path"
            class="image-preview"
            :preview-src-list="[scope.row.path]"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="90px" sortable></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="description" label="简介"></el-table-column>
      <el-table-column prop="upload_time" label="上传时间" sortable></el-table-column>
      <!-- 根据点赞数排序 -->
      <el-table-column prop="likes" label="点赞数" width="100px" :sortable="true" :sort-method="likesSort"></el-table-column>
      <!-- 根据审核状态排序 -->
      <!-- /**
       * @description 渲染审核状态列，使用 el-switch 组件来切换状态。
       * @param {Object} row - 当前行的数据对象。
       * @param {string} row.type - 当前行的审核状态，'1' 表示通过，'0' 表示不通过。
       * @event change - 当开关状态改变时触发，调用 photoStateChanged 方法。
       */ -->
      <el-table-column label="审核状态" width="110px" :sortable="true" :sort-method="typeSort">
        <template #default="{ row }">
          <el-switch
            :model-value="row.type"
            :active-value="'1'"
            :inactive-value="'0'"
            @change="(newValue) => photoStateChanged(row, newValue)"
          />
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="tags">
  <template #default="scope">
    <!-- 显示已有标签 -->
    <el-tag size="default" v-for="(tag, i) in scope.row.tags" :key="tag.id" closable
            @close="handleClose(i, scope.row)">
      {{ tag.name }}
    </el-tag>
    <!-- 新标签输入框 -->
    <el-input size="small" style="width: 100px;" class="input-new-tag" v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue" ref="saveTagInput"
              @keyup.enter="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
    </el-input>
    <!-- 新标签按钮 -->
    <el-button v-else size="small" class="button-new-tag" @click="showInput(scope.row)">
      + 新标签
      </el-button>
      </template>
    </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #default="scope">
          <div class="btn-group">
            <el-button @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" title="编辑图集项" destroy-on-close>
    <el-form :model="currentItem">
      <el-form-item label="作者">
        <el-input v-model="currentItem.author"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="currentItem.title"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="currentItem.description"></el-input>
      </el-form-item>
      <el-form-item label="点赞量">
        <el-input v-model="currentItem.likes"></el-input>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-input v-model="currentItem.type"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="currentItem.username"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref,  onMounted, nextTick } from 'vue';
import axios from 'axios';
import { ENDPOINTS } from '@/constants/api';
import { useUserStore } from '@/store/store';
import { ElMessage,ElMessageBox } from 'element-plus';

const userStore = useUserStore();
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
// 存储从 API 获取的图集数据
const atlasData = ref<AtlasItem[]>([]);
const dialogVisible = ref(false);  // 是否显示编辑图集项的对话框
const currentItem = ref<AtlasItem | null>(null);
const saveTagInput = ref(null);  // 保存输入框的引用，以便在失去焦点时触发确认输入标签的事件

// 加载图集数据
onMounted(async () => {
  try {
    const response = await axios.get<{ data: AtlasItem[] }>(ENDPOINTS.ADMINSHOW, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.status === 200) {  
      atlasData.value = response.data.data; // 存储从 API 获取的图集数据
    } else {
      console.error('错误的数据结构:', response.data);
    }
  } catch (error) {
    console.error('获取图集数据失败:', error.message);
  }
});

// 显示输入框以添加新标签
const showInput = (row) => {
      row.inputVisible = true; // 显示输入框
      nextTick(() => {
        if (saveTagInput.value) {
          saveTagInput.value.focus(); // 聚焦输入框
        }
      });
};

// 确认输入标签，失去焦点或按下回车键时触发
const handleInputConfirm = async (row) => {
  // 验证输入框是否为空
  if (!row.inputValue) {  
          row.inputValue = '';
          row.inputVisible = false;
          return
      }
  const inputValue = row.inputValue.trim();
  if (inputValue !== "") {
    // 添加标签到本地
    row.tags.push({ id: Date.now(), name: inputValue });
    // 发送请求到后台添加新标签
    try {
      const response = await axios.post(ENDPOINTS.ADDTAG, {
        filesId: row.id,   // 图片的id
        tagName: inputValue // 新标签的name
      });
      row.inputValue = ""; // 清空输入框
      row.inputVisible = false; // 隐藏输入框，显示新标签按钮
      if (response.data.status === 830) {
        ElMessage.success('标签添加成功');
      } else {
        row.tags.pop(); // 删除新增失败的标签
        ElMessage.error('标签添加失败');
      }
    } catch (error) {
      row.inputValue = ""; // 清空输入框
      row.inputVisible = false; // 隐藏输入框，显示新标签按钮
      row.tags.pop(); // 删除新增失败的标签
      ElMessage.error('请求失败');
    }
  }
};

/**
 * 处理关闭标签的操作。
 * @param {number} index - 标签在 tags 数组中的索引。
 * @param {Object} row - 当前行的数据对象，包含标签信息。
 * @returns {Promise<void>} - 返回一个 Promise，表示操作的异步结果。
 * @throws {Error} - 如果删除标签的请求失败，将抛出错误。
 * @description 
 * 此函数会弹出确认对话框，询问用户是否确认删除标签。
 * 如果用户确认，发送删除请求到服务器，并根据响应结果更新本地标签列表。
 * 如果用户取消操作，则显示取消删除的提示信息。
 */
const handleClose = async (index, row) => {   
  try {
    const confirmResult = await ElMessageBox.confirm(
      '此操作将永久删除该标签, 是否继续',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    if(confirmResult === 'confirm') {
      const tag = row.tags[index];
    const response = await axios.post(ENDPOINTS.DELETEPHOTOTAG, {
      filesId: row.id, // 图片的id
      tagId: tag.id // 标签的id
    });

    if (response.data.status === 830) {
      row.tags.splice(index, 1); // 删除本地标签
      ElMessage.success('标签删除成功');
    } else {
      ElMessage.error('标签删除失败');
    }
    }else{
      ElMessage.success('已取消删除');}
  } catch (error) {
        // 如果用户点击了取消或关闭对话框,则不弹出警告
        if (error !== 'cancel' && error !== 'close') {
      console.error('删除标签失败：', error.message);
      ElMessage.error('删除失败');
  }
  }
};

/**
 * 处理照片状态变化的异步函数。
 * @param {Object} row - 当前行的数据对象，包含照片信息。
 * @param {string} newValue - 新的照片类型值。
 * 该函数首先保存旧的照片类型值，然后乐观更新 UI。接着，向服务器发送请求以更改照片类型。
 * 如果请求成功且状态为 830，显示成功消息；否则，恢复旧值并显示错误消息。
 * 在请求出错的情况下，也会恢复旧值并提示用户服务器繁忙。
 */
const photoStateChanged = async (row, newValue) => {
  // 保存旧值
  const oldValue = row.type;
  // 先乐观更新 UI
  row.type = newValue;
  try {
    const { data: res } = await axios.post(ENDPOINTS.CHANGEPHOTOTYPE, { photo: row });
    if (res.status !== 830) {
      // 审核失败，恢复旧值
      row.type = oldValue;
      ElMessage.error("审核失败");
    } else {
      ElMessage.success("审核成功");
    }
  } catch (error) {
    // 请求出错，恢复旧值
    row.type = oldValue;
    ElMessage.error("请求出错！服务器繁忙，请稍后再试。");
  }
};

// 自定义点赞数状态排序逻辑
const likesSort = (a: AtlasItem, b: AtlasItem) => {
  return Number(a.likes) - Number(b.likes); // 确保 likes 是数字进行排序
};
// 自定义审核状态排序逻辑
const typeSort = (a: AtlasItem, b: AtlasItem) => {
  return Number(a.type) - Number(b.type); // 确保 type 是数字进行排序
};

// 编辑图集项
const handleEdit = async (item: AtlasItem) => {
  currentItem.value = { ...item };
  dialogVisible.value = true;
  await nextTick(); // 强制 DOM 更新，避免 ResizeObserver 报错
};

/**
 * 保存编辑后的项目数据。
 * 该函数会检查当前项目是否存在，如果存在，则通过 Axios 向服务器发送更新请求。
 * 请求成功后，会更新本地数据并关闭对话框，同时显示成功消息。
 * 如果请求失败，则会在控制台输出错误信息，并显示失败消息。
 * @async
 * @function saveEdit
 * @returns {Promise<void>} 无返回值
 */
const saveEdit = async () => {
  if (currentItem.value) {
    try {
      const response = await axios.post(ENDPOINTS.ADMINUPDATE, currentItem.value, {
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        }
      });
      if (response.data.status === 830) {
        const index = atlasData.value.findIndex(item => item.id === currentItem.value!.id);
        if (index !== -1) {
          atlasData.value[index] = { ...currentItem.value };
        }
        dialogVisible.value = false;
        ElMessage.success('更新成功');
      } else {
        console.error('图片数据更新失败:', response.data.message);
        ElMessage.error('更新失败');
      }
    } catch (error) {
      console.error('图片数据更新出错:', error.message);
      ElMessage.error('更新失败');
    }
  }
};


/**
 * 处理删除操作的函数 
 * @param {AtlasItem} item - 要删除的照片项
 * @returns {Promise<void>} - 无返回值
 * @throws {Error} - 如果删除操作失败，将抛出错误
 * 此函数会弹出确认对话框，询问用户是否确认删除照片。
 * 如果用户确认，将发送删除请求，并根据响应结果更新状态和提示用户。
 * 如果用户取消操作或关闭对话框，将不会执行删除操作。
 */
const handleDelete = async (item: AtlasItem) => {
  // 弹出对话框
  try {
    const confirmResult = await ElMessageBox.confirm(
      '此操作将永久删除该照片, 是否继续',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 如果用户点击了确定
    if (confirmResult === 'confirm') {
      const response = await axios.post(ENDPOINTS.DELETEPHOTO,  {
      fileId: item.id, // 图片的id 
    },{
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });

      if (response.data.status === 830) {
        atlasData.value = atlasData.value.filter((i) => i.id !== item.id);
        ElMessage.success('删除成功');
      } else {
        console.error('删除图片失败:', response.data.message);
        ElMessage.error('删除失败');
      }
    } else {
      ElMessage.info('已取消删除');
    }
  } catch (error) {
    // 如果用户点击了取消或关闭对话框,则不弹出警告
    if (error !== 'cancel' && error !== 'close') {
      console.error('删除失败:', error.message);
      ElMessage.error('删除失败');
    }
  }
};
</script>

<style scoped>
/* 让表格在小屏幕上支持滚动 */
.table-container {
  overflow-x: auto;
  font-family: Courier,Kaiti, monospace,CustomFont;
}

/* 让图片保持一定尺寸 */
.image-preview {
  height:160px;

  width: auto;
  min-width: 160px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
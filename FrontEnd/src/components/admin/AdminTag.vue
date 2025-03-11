<template>
    <div>
      <el-card shadow="never">
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
          <el-button type="primary" @click="createTagDialogFormVisible = true">新建标签</el-button>
        </div>
        <!-- /**
         * AdminTag 组件用于展示标签列表。
         * 每个标签以卡片形式展示，包含标签名称和图片数量。
         * 提供编辑和删除标签的功能。
         * @component
         * @props
         * tagList {Array} - 标签对象数组，每个对象包含 id, name 和 number 属性。
         */ -->
        <el-row :gutter="20">
          <el-col :sm="8" :lg="6" v-for="tag in tagList" :key="tag.id" style="margin-bottom: 20px;">
            <el-card shadow="hover" style="position:relative;border: 2px solid #eee;text-align: left">
              <div class="op" style="position: absolute;right: 5px;top: 5px">
                <el-button @click="editTagById(tag.id)" :icon="Edit" style="color: #3a8ee6;margin-right: 5px"></el-button>
                <el-button @click="deleteTagById(tag.id)" :icon="Delete" style="color: red"></el-button>
              </div>
              <b> 标签名称 <span style="color: #3a8ee6">{{ tag.name }}</span></b> <br>
              <p style="margin-bottom: 0">图片数量 <span style="color: #2ac06d">{{ tag.number }}</span></p>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <!-- /**
       * @description 修改标签对话框组件
       * @component AdminTag
       * @property {Boolean} createTagDialogFormVisible - 控制对话框的显示与隐藏
       * @property {Object} createTagForm - 表单数据模型
       * @property {Object} createTagFormRules - 表单验证规则
       * @method backPage - 关闭对话框，返回上一页
       * @method createTag - 提交表单数据以创建新标签
       */ -->
      <el-dialog title="修改标签" v-model="createTagDialogFormVisible">
        <el-form style="text-align: left" ref="createTagFormRef" :model="createTagForm" :rules="createTagFormRules" label-width="80px">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="createTagForm.name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="backPage">取消</el-button>
          <el-button type="primary" @click="createTag">提交</el-button>
        </template>
      </el-dialog>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ENDPOINTS } from '@/constants/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete,Edit } from '@element-plus/icons-vue';
const tagList = ref([]);
const createTagDialogFormVisible = ref(false);
const createTagFormRef = ref(null);
const createTagForm = ref({ name: '' });
const createTagFormRules = {
    name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
};
const tag = ref({ id: null, name: '' });
  
 /**
  * 比较函数，用于根据指定属性的长度对两个对象进行排序。
  * @param {string} property - 要比较的属性名。
  * @returns {function} 返回一个比较函数，适用于数组的排序方法。
  */
const compare = (property) => (a, b) => b[property].length - a[property].length;
  
/**
 * 异步获取标签列表的函数。
 * 该函数通过发送网络请求获取标签数据，并根据响应状态更新标签列表。
 * 如果请求成功且状态为 830，则将返回的数据赋值给 tagList；否则，显示错误信息。
 * 在请求失败时，会捕获错误并显示相应的提示信息。
 * @async
 * @function getFullTagList
 * @returns {Promise<void>} 无返回值
 */
const getFullTagList = async () => {
  try {
    // 发送请求获取标签数据
    const { data: res } = await axios.get(ENDPOINTS.GETADMINTAG);

    // 检查响应状态
    if (res.status === 830) {
      // 将返回的数据赋值给 tagList
      tagList.value = res.data;
      console.log('标签列表加载成功');
    } else {
      // 如果 status 不为 830，表示获取数据失败
      ElMessage.error('标签列表加载失败');
    }
  } catch (error) {
    // 捕获网络请求的错误
    console.error('获取标签列表失败:', error.message);
    ElMessage.error('获取标签列表失败，请稍后再试');
  }
};
  
const editTagById = (id) => {
  tag.value.id = id;
  createTagDialogFormVisible.value = true;
};
  
/**
 * 创建标签的异步函数。
 * 该函数首先验证表单，如果表单有效，则将标签名称设置为表单中的值。
 * 然后通过 POST 请求将标签数据发送到服务器。
 * 如果服务器返回状态为 830，表示创建成功，则关闭对话框，重置表单字段，并显示成功消息。
 * 最后，调用获取完整标签列表的函数以更新标签列表。
 */
const createTag = async () => {
    if (!createTagFormRef.value) return;
    createTagFormRef.value.validate(async (valid) => {
      if (!valid) return;
      tag.value.name = createTagForm.value.name;
      const { data: res } = await axios.post(ENDPOINTS.CREATETAG, { tag: tag.value });
      if (res.status === 830) {
        // 关闭对话框，重置表单字段，显示成功消息
        createTagDialogFormVisible.value = false;
        tag.value.id = null;
        createTagFormRef.value.resetFields();
        ElMessage.success("创建成功");
        await getFullTagList();
      }
    });
};
  
/**
 * 根据标签 ID 删除标签。
 * @param {string} tagId - 要删除的标签的 ID。
 * @throws {Error} 如果用户取消操作，则抛出错误。
 */
const deleteTagById = async (tagId) => {
    try {
      await ElMessageBox.confirm('此操作将永久删除该标签, 是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const { data: res } = await axios.post(ENDPOINTS.DELETETAG, { tagId });
      if (res.status === 830) {
        await getFullTagList();
      }
    } catch {
      ElMessage.info('已取消删除');
    }
};
  
const backPage = () => {
    createTagDialogFormVisible.value = false;
    createTagForm.value.name = '';
    createTagFormRef.value?.resetFields();
};

// 在组件挂载后获取完整标签列表
onMounted(getFullTagList);
</script>
  
<style scoped>
.op:hover {
  cursor: pointer;
}
.op i:hover {
  font-weight: bold;
  font-size: large;
}
</style>
  
<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="search" />
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="searchUser">查找用户</el-button>
        </el-col>
      </el-row>
      <!-- 这里是经过过滤的data，所以能够实时搜索显示 -->
      <el-table :data="paginatedUserList" border class="user-table">
        <el-table-column type="index" />
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="邮箱" prop="email" min-width="100px" />
        <!-- /**
         * @description 管理员状态切换列，使用 el-switch 组件来控制用户的管理员权限。
         * @param {Object} row - 当前行的数据对象，包含用户信息。
         * @param {boolean} row.is_admin - 用户是否为管理员的状态。
         * @param {string} row.username - 用户名，用于判断是否禁用开关。
         * @param {function} userStateChanged - 状态改变时的回调函数，接收新的状态值。
         更新失败不会改变状态。
         * @returns {void}
         */ -->
        <el-table-column label="管理员" min-width="70px">
          <template #default="{ row }">
            <el-switch 
              :model-value="row.is_admin" 
              :active-value="'1'" 
              :inactive-value="'0'" 
              :disabled="row.username === username"
              @change="(newValue) => userStateChanged(row, newValue)"
            />
          </template>
        </el-table-column>
        <!-- /**
         * 操作列，包含删除用户的按钮。
         * @param {Object} row - 当前行的数据对象，包含用户信息。
         * @param {string} row.username - 用户名，用于删除操作。
         */ -->
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="danger"
              :icon="Delete"
              @click="deleteUser(row.username)" 
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /**
       * 分页组件，用于在用户管理界面中显示分页信息。
       * @property {Number} currentPage - 当前页码。
       * @property {Number} pageSize - 每页显示的条目数。
       * @property {Number} total - 数据总条目数。
       * @event current-change - 当当前页码变化时触发的事件，调用 handlePageChange 方法。
       * @layout - 分页布局，包括总数、上一页、页码、下一页和跳转输入框。
       */ -->
      <el-pagination
        v-if="total > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
        class="pagination-center"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/store';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ENDPOINTS } from '@/constants/api';
import { Delete } from '@element-plus/icons-vue';

const userList = ref([]);
const search = ref('');
const username = useUserStore().username;
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示条数
const total = ref(0); // 总条数


// 获取用户列表
const getUserList = async () => {
  try {
    const { data: res } = await axios.get(ENDPOINTS.GETUSER);
    if (res.status === 830) {
      userList.value = res.data;
      total.value = res.data.length; // 获取总用户数
    } else {
      ElMessage.error("获取用户信息失败！");
    }
  } catch (error) {
    ElMessage.error("请求出错！");
  }
};

/**
 * 计算属性，用于根据搜索关键字过滤用户列表。
 * 如果没有搜索关键字，则返回原始用户列表。
 * 否则，使用正则表达式匹配用户的昵称或用户名，返回匹配的用户列表。
 * @computed {Array} filteredUserList - 过滤后的用户列表
 */
const filteredUserList = computed(() => {
  if (!search.value) return userList.value;
  const reg = new RegExp(search.value, 'i');
  return userList.value.filter(user => reg.test(user.nickname) || reg.test(user.username));
});

// 分页后的用户数据
const paginatedUserList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredUserList.value.slice(startIndex, startIndex + pageSize.value);
});

/**
 * 搜索用户并更新用户列表。
 * 当调用此函数时，将当前页重置为第一页，并根据输入的搜索条件过滤用户列表。
 * @function searchUser
 * @returns {void}
 */
const searchUser = () => {
  currentPage.value = 1; // 重置为第一页
  filteredUserList.value = userList.value.filter(user => user.username.includes(search.value));
};

const handlePageChange = (page) => {
  currentPage.value = page; // 更新当前页码
};

/**
 * 处理用户权限变更的异步函数。
 * @param {Object} row - 当前用户对象，包含用户信息。
 * @param {boolean} newValue - 新的权限值，表示是否为管理员。
 * @returns {Promise<void>} - 无返回值。
 * @throws {Error} - 如果请求失败，将会抛出错误。
 * 函数会尝试更新用户的权限，并根据响应结果显示相应的提示信息。
 * 如果请求失败或返回的状态不符合预期，将会恢复到旧的权限值。
 */
const userStateChanged = async (row, newValue) => {
  const oldValue = row.is_admin;
  row.is_admin = newValue;
  try {
    const { data: res } = await axios.post(ENDPOINTS.CHANGEUSER, { user: row });
    if (res.status !== 830) {
      row.is_admin = oldValue;
      ElMessage.error("修改权限失败");
    } else {
      ElMessage.success("修改权限成功");
    }
  } catch (error) {
    row.is_admin = oldValue;
    ElMessage.error("请求出错！");
  }
};

/**
 * 删除指定用户名的用户。
 * 在确认后，向服务器发送删除请求。
 * 如果删除成功，显示成功消息并更新用户列表；如果失败，显示错误消息。
 * @param {string} username - 要删除的用户的用户名。
 * @returns {Promise<void>} - 无返回值。
 * @throws {Error} - 如果用户取消删除操作，将抛出错误。
 */
const deleteUser = async (username) => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该用户, 是否继续', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    });

    const { data: res } = await axios.post(ENDPOINTS.DELETEUSER, { username });
    if (res.code !== 200) {
      ElMessage.error('删除用户失败！');
    } else {
      ElMessage.success('删除用户成功！');
      getUserList();
    }
  } catch (error) {
    ElMessage.info('已取消删除');
  }
};

onMounted(getUserList);
</script>

<style scoped>
.user-table {
  margin-top: 20px;
}

/* 添加分页居中样式 */
.pagination-center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

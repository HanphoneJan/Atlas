import { createApp } from 'vue' //// 导入Vue框架的核心功能，用于创建Vue应用实例
import App from './App.vue' // 导入项目的根组件App.vue
import ElementPlus from 'element-plus' // 导入Element Plus 
import 'element-plus/dist/index.css' //导入Element Plus的样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入Element Plus的图标
import 'element-plus/theme-chalk/dark/css-vars.css'  //暗夜样式表，在body中添加class="dark"切换到暗夜模式
import axios from 'axios';// 导入axios
import router from './router/router'; // 导入Vue Router配置
import Viewer from 'v-viewer';  //基于 Vue 框架的高性能图像查看组件库
import 'viewerjs/dist/viewer.css';  //导入viewerjs的样式
import { createPinia } from 'pinia';  // 导入Pinia状态管理插件
import { createI18n } from 'vue-i18n'; // 导入Vue I18n国际化插件
import { useUserStore } from './store/store'
import langList  from './utils/langList';  // 导入支持的语言列表
import zhCn from 'element-plus/es/locale/lang/zh-cn';  // 引入 Element Plus 中文包
import en from 'element-plus/es/locale/lang/en';  // 引入 Element Plus 英文包
import './styles/global.css';  // 导入全局样式表
const app = createApp(App);
// 创建一个axios实例
const axiosInstance = axios.create();
// 添加请求拦截器, 用于在请求头的Authorization中添加token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);
// 将axios实例挂载到Vue应用实例上
app.config.globalProperties.$axios = axiosInstance;

// 官方文档：使用app.use()方法安装Element Plus的图标到Vue应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用Vue的createApp函数创建一个应用实例，传入根组件App
const pinia = createPinia();
app.use(pinia);  // 使用Pinia状态管理插件

const messages = {
  'zh-cn': zhCn,
  'en': en,
};
// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 必须设置false,使用 Composition API
  locale: 'zh-cn', // 默认语言
  fallbackLocale: 'en', // 当语言包中没有对应语言时，使用该语言
  globalInjection: true, // 全局注册 $t 方法以便在模板中使用
  allowComposition: true, // 允许组合式 API 的使用
  messages,  // 语言包，必选
});
// 选择语言
let localLang: any = localStorage.getItem("lang") || navigator.language;
if (!langList.includes(localLang)) {
    // 如果本地存储的语言不在支持的语言列表中，则默认使用 "zh-cn"
    localLang = "zh-cn";
    // 将最终选择的语言存储到本地存储
  useUserStore().changeLanguage(localLang);
  i18n.global.locale.value = localLang;
}
app.use(i18n); // 使用 i18n

app.use(router); // 使用Vue Router
app.use(Viewer); // 使用Viewer
app.use(ElementPlus, {
  locale: zhCn,
}); // 使用Element Plus,不设置locale会默认为英文

// 将Vue应用实例挂载到HTML页面中id为'app'的元素上，启动Vue应用
app.mount('#app');
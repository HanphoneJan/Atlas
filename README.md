# 寒枫的照片墙

项目更新时间：2025年3月

项目展示：[寒枫的照片墙](https://www.hanphone.top/atlas/)

## 项目架构

### 核心定位

专注于个人摄影作品的展示与图片分享。

### 技术架构

**前端体系**

- 渐进式框架：Vue 3.2 + Composition API + Vite 4.0 构建现代化SPA
- UI组件库：Element-Plus 2.3 + SCSS定制主题
- 增强特性：
  - PWA渐进式应用（Service Worker离线缓存/Web Manifest）
  - 动态资源加载（Vite异步模块拆包）

**服务端架构**

- 基础框架：PHP 8.1 + 自主开发MVC架构
- 接口规范：RESTful API + JWT鉴权
- 数据处理：
  - MySQL 8.0 关系型存储

**移动端封装**

- Android WebView封装的APP

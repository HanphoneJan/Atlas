import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
//存储用户信息
  state: () => ({
    isLoggedIn: localStorage.getItem('token') !== null, // 从 localStorage 初始化登录状态
    username: localStorage.getItem('username') || null, 
    isAdmin: localStorage.getItem('is_admin') === 'true', // 从 localStorage 初始化管理员状态
    token: localStorage.getItem('token') || null, // 从 localStorage 初始化 token
    pageName: localStorage.getItem('pageName') || 'index',  //当前页面
    theme:localStorage.getItem('theme') || 'light',  //自定义黑暗主题
    language: localStorage.getItem('language') || 'zh-cn', //语言
  }),
  //提供方法
  actions: {
    changePage(pageName: string) {
      this.pageName = pageName; // 使用 this 访问 store 的 state
      localStorage.setItem('pageName', pageName);
    },
    changeTheme(theme: string) {
      this.theme = theme; // 使用 this 访问 store 的 state
      localStorage.setItem('theme', theme);
    },
    changeLanguage(language: string) {
      this.language = language; // 使用 this 访问 store 的 state
      localStorage.setItem('language', language);
    },
    login(user: string, admin: boolean = false, userToken: string) {
      this.isLoggedIn = true;
      this.username = user;
      this.isAdmin = admin;
      this.token = userToken;
      localStorage.setItem('username', user);
      localStorage.setItem('is_admin', admin.toString());
      localStorage.setItem('token', userToken);
    },
    /**
     * 退出登录方法。
     * 此方法会清除用户的登录状态和相关信息，包括用户名、管理员权限、令牌和用户ID。
     * 同时，它还会从本地存储中移除相应的用户信息，以确保用户完全退出。
     */
    logout() {
      this.isLoggedIn = false;
      this.username = null;
      this.isAdmin = false;
      this.token = null;
      localStorage.removeItem('username');
      localStorage.removeItem('is_admin');
      localStorage.removeItem('token');
    }
  }
});
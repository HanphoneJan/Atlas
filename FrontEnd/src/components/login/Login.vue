<!-- 登录与注册界面一体，具有切换动画 -->
<template>
    <div class="login-wrapper">
      <div class="login-container">
        <!-- 登录表单 -->
        <!-- 使用transition组件实现登录表单的切换效果 -->
        <transition name="slide-login" mode="out-in">
        <div class="form sign-in" v-show="!isSignup">
          <h2 style="color:black;">欢迎回来</h2>
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="form-content">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="loginForm.username" autocomplete="off"/>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <!-- show-password用于显示密码 -->
              <el-input v-model="loginForm.password"  type="password" autocomplete="off"  
              show-password />
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <div id="captchaQuestion" style="color:black;" >请计算：{{ captchaQuestion }}</div>
                <el-input v-model="loginForm.captcha" autocomplete="off"/>
            </el-form-item>
          </el-form>
          <div class="buttonWrapper">
          <el-button type="primary" class="submit" @click="handleLogin">登 录</el-button>
          <el-button type="success" class="wechat-btn" @click="wechatLogin">使用 <span>微信</span> 帐号登录</el-button>
        </div>
          <p class="forgot-pass">
            <router-link to="/"  style="margin-right: 14px;">返回主页</router-link>
            <router-link to="/forgotpassword"> 忘记密码？</router-link>
          </p>
        </div>
        </transition>
        <!-- 过渡内容 -->
        <div  :style="subContentStyle" :class="['sub-content', { hidden: isSignup }]">
          <div class="img">
            <div class="imgText m-up" v-show="!isSignup">
              <h3>还未注册？</h3>
              <p>立即注册！</p>
            </div>
            <div class="imgText m-in" v-show="isSignup">
              <h3>已有帐号？</h3>
              <p>有帐号就登录吧,
               </p>
                <p> 好久不见了！</p>
            </div>
            <div class="imgBtn">
            <el-button type="primary" @click="toggleSignup" style="background-color: #f08c4e;" id="img_btn">
                <el-icon v-if="!isSignup">注册
                </el-icon>
             <el-icon v-else>
                登录
          </el-icon>
             </el-button>
            </div>
          </div>
        </div>
        <transition name="slide-register" mode="out-in">
        <!-- 注册表单 -->
        <div class="form sign-up" v-show="isSignup">
          <h2>立即注册</h2>
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="form-content">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="registerForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="registerForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="registerForm.password"  type="password" autocomplete="off" show-password/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword" autocomplete="off" show-password/>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="emailCode" >
                <el-input v-model="registerForm.emailCode" autocomplete="off"/>
                <el-button @click="sendEmailCode" :disabled="isSending" id="emailCode">发送验证码</el-button>
            </el-form-item>
          </el-form>
          <div class="buttonWrapper">
            <el-button type="primary" class="submit" @click="handleRegister">注 册</el-button>
            <el-button type="success" class="wechat-btn" @click="wechatRegister">使用 <span>微信</span> 帐号注册</el-button>
          </div>
      
        </div>
      </transition>
      </div>
    </div>

  </template>
  
<script setup lang="ts">
import { ref,computed } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useUserStore } from '../../store/store';
import { ENDPOINTS } from '@/constants/api';
import { Hide,View } from '@element-plus/icons-vue';

import { useRouter } from 'vue-router';
const userStore = useUserStore();
const router = useRouter();

const passwordVisible = ref(false);
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
  console.log(passwordVisible.value);
};


// 登录表单
const loginForm = ref({
    username: '',
    password: '',
    captcha: ''
});
const loginRules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
});
const loginFormRef = ref(null);  //登录表单是否有效

// 注册表单
const registerForm = ref({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    emailCode: ''
});
const isSignup = ref(false);  // 是否显示注册表单  
// 切换注册/登录的按钮
const toggleSignup = () => {
    isSignup.value = !isSignup.value;
    return { isSignup, toggleSignup };
};
// 根据 isSignup 的值动态设置 left 或 right
const subContentStyle = computed(() => ({
  // left: isSignup.value ? 'auto' : '0',
  // right: isSignup.value ? '0' : 'auto',
  
}));

/**
 * 生成一个简单的算术验证码。
 * 验证码由两个10到29之间的随机数和一个加号或减号组成。
 * 返回一个对象，包含生成的算术问题和正确答案。
 *
 * @returns {Object} 包含问题和答案的对象
 * @returns {string} returns.question - 生成的算术问题，例如 "15 + 7"
 * @returns {number} returns.answer - 算术问题的答案，例如 22
 */
 const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 10;
    const num2 = Math.floor(Math.random() * 10) + 10;
    const operator = '+' ;
    const question = `${num1} ${operator} ${num2}`;
    const answer =num1 + num2 ;
    return { question, answer };
};

const captcha = ref(generateCaptcha()); // 验证码
const captchaQuestion = ref(captcha.value.question);  // 验证码问题
 
/**
 * 处理登录逻辑的函数。
 * 首先验证登录表单的有效性，如果有效则检查验证码是否正确。
 * 如果验证码错误，显示错误消息并重新生成验证码。
 * 如果验证码正确，发送登录请求到服务器。
 * 根据服务器响应，如果登录成功，更新用户状态并重定向到首页。
 * 如果登录失败，显示相应的错误消息。
 */
 const handleLogin = () => {
    loginFormRef.value.validate((valid: boolean) => {
        if (valid) {
            if (parseInt(loginForm.value.captcha) !== captcha.value.answer) {
                ElMessage.error('验证码错误');
                captcha.value = generateCaptcha();
                captchaQuestion.value = captcha.value.question;
                return;
            }
            axios.post(ENDPOINTS.LOGIN, {
                username: loginForm.value.username,
                password: loginForm.value.password
            },{headers:{
              'Content-Type': 'application/json',
            }})
            .then(response => {
                if (response.data.status === 830) {
                    const { username, is_admin, token } = response.data;
                    userStore.login(username, is_admin, token);
                    ElMessage.success('登录成功');
                     router.push('/');
                } else {
                    ElMessage.error('登录失败，账号或密码错误');
                    console.log(response.data);
                }
            })
            .catch(error => {
                ElMessage.error('登录失败');
                console.error('登录出错', error.message);
            });
        } else {
            ElMessage.error('请正确填写信息');
            return false;
        }
    });
};

const registerFormRef = ref(null);  // 注册表单是否有效
//trigger: 'blur' 表示在输入框失去焦点时触发验证,change表示在输入框内容改变时触发验证,默认为change
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== registerForm.value.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();  // 传参为空，验证通过
            }
        }, trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    emailCode: [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ]
};

const isSending = ref(false);  // 是否发送验证码
const timer = ref(null);  // 定时器

/**
 * 发送验证码到注册邮箱的函数。
 * 在发送验证码时，如果正在发送，则会提示用户稍后再试。
 * 发送成功后，会启动计时器，并显示成功消息。
 * 如果发送失败，将显示错误消息并重置发送状态。
 * @function sendEmailCode
 */
const sendEmailCode = () => {
    if (isSending.value) {
        ElMessage.warning('请稍后再试');
        return;
    }
    isSending.value = true;
    axios.post(ENDPOINTS.SENDVERICATIONCODE, { email:registerForm.value.email })
        .then(response => {
            if (response.data.status === 830) {
                ElMessage.success('验证码已发送');
                startTimer();
            } else {
                ElMessage.error('发送验证码失败');
                isSending.value = false;
            }
        })
        .catch(error => {
            ElMessage.error('发送验证码失败');
            console.error('发送验证码出错',error.message);
            isSending.value = false;
        });
};

/**
 * 启动定时器，60秒后将 isSending 的值设置为 false。
 * 一分钟内不能重复发送验证码。
 * @function startTimer
 */
const startTimer = () => {
    timer.value = setTimeout(() => {
        isSending.value = false;
    }, 60000); // 60秒
};

/**
 * 处理用户注册的函数。
 * 此函数会验证注册表单的输入信息，如果有效，则发送注册请求到服务器。
 * 注册成功后，用户将被重定向到登录页面；如果失败，将显示相应的错误信息。
 * @returns {void} 无返回值
 */
const handleRegister = () => {
    registerFormRef.value.validate((valid: boolean) => {
        if (valid) {
            axios.post(ENDPOINTS.REGISTER, {
                username: registerForm.value.username,
                password: registerForm.value.password,
                email: registerForm.value.email,
                code: registerForm.value.emailCode
            },{
            withCredentials: true  // 确保跨域请求携带 cookie
            })
            .then(response => {
                if (response.data.status === 830) {
                    ElMessage.success('注册成功，自动跳转登录界面');
                    router.push('/login');  // 重定向到登录页面
                } else {
                    ElMessage.error('注册失败');
                    console.log(response.data);
                }
            })
            .catch(error => {
                ElMessage.error('注册失败，存在异常');
            });
        } else {
            ElMessage.error('请正确填写信息');
            return false;
        }
    });
};

const wechatLogin = () => {
    ElMessage.warning('暂不支持微信登录');
  };

const wechatRegister = () => {
    ElMessage.warning('暂不支持微信注册');
  };
</script>

<style scoped>
/* 登录wrapper */
.login-wrapper {
    display: flex;
    justify-content: center; 
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: rgb(249, 221, 205);
}
/* 验证码样式 */
#emailCode{
  color: #000;
  background-color: #fafafa;
}

/* PC端布局 */
@media screen and (min-width: 768px) {
.login-container {
  font-family: Kaiti,sans-serif;
  font-weight: 700;
  background-image: url('@/assets/bg_3.webp');
  background-size: cover;
  background-position: center;
  margin: 0;
  width: 60vw;
  padding: 20px;
  height: 60vh; 
  background-color: transparent; 
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3); 
  border-radius: 4px;
  display: flex;
  justify-content: center; 
  align-items: center;      
  position: relative;
}
  
/* 过渡内容 */
.sub-content{
  position:absolute;
  width: 25%;
  height: 100%;
  display: flex;
  margin-left: auto;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.3); /* 80% 透明度 */
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  left: 0%;
  transform: translateX(0);
  /* 添加过渡效果 */
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.sub-content.hidden {
  transform: translateX(300%); /* 滑动到右侧 */
}

/* 登录表单 */
.sign-in {
  right:0;
  height: 100%;
  width:75%;
  position: absolute;
  background-color: #fff;
  display: flex;
  /* 垂直布局 */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 注册表单 */
.sign-up {
  left:0;
  height: 100%;
  width:75%;
  position: absolute;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 动画效果 */
.slide-login-enter, .slide-login-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.slide-login-enter-active, .slide-login-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}
.slide-register-enter, .slide-register-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-register-enter-active, .slide-register-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}


/* 按钮样式 */
.buttonWrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
:deep(.el-form-item__label){
  /* 使用样式深度选择器覆盖默认字体颜色 */
  color:black ;
  font-size: medium;
}
.el-button{
  color:#fff;
  font-family: KaiTi,sans-serif;
  font-weight: 600;
}
}

/* 移动端页面布局，改为上下切换布局 */
@media screen and (max-width: 768px) {
  .login-container {
  font-family: Kaiti,sans-serif;
  font-weight: 700;
  background-image: url('@/assets/bg_3.webp');
  background-size: cover;
  background-position: center;
  margin: 0;
  width: 100vw;
  /* padding: 5vh 2vw; */
  height: 100vh; 
  background-color: transparent; 
  border-radius: 4px;
  display: flex;
  justify-content: center; 
  align-items: center;      
  position: relative;
}

  .sub-content{
  font-weight: 300;
  position:absolute;
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.9); 
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  top:0%;
  transform: translateY(0);
  /* 添加过渡效果 */
  transition: transform 0.5s ease, opacity 0.5s ease;
  }

  .sub-content.hidden {
  transform: translateY(400%); 
  }

  .sign-in {
  bottom:0;
  height: 80%;
  width:100%;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  /* 垂直布局 */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  }

  .sign-up {
  top:0;
  height: 80%;
  width:100%;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  }

/* 切换动画为竖直方向 */
.slide-login-enter, .slide-login-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.slide-login-enter-active, .slide-login-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}

.slide-register-enter, .slide-register-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-register-enter-active, .slide-register-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}

.buttonWrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
:deep(.el-form-item__label){
  /* 使用样式深度选择器覆盖默认字体颜色 */
  color:black ;
  font-size: medium;
}
.el-button{
  color:#fff;
  font-family: KaiTi,sans-serif;
  font-weight: 600;
}

#img_btn{
  color:rgb(35, 73, 77);
  background-color: rgba(255, 243, 107, 0.3) !important;
}
}

</style>

  
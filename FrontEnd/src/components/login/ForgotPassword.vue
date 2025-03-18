<!-- 找回密码界面，复用了登录注册界面 -->
<template>
    <div class="login-wrapper">
      <div class="login-container">
        <!-- 过渡内容 -->
        <div :class="['sub-content']">
          <div class="img">
            <div class="imgText m-up" >
              <h3>返回登录页面</h3>
              <p>立即登录！</p>
            </div>
            <el-button type="primary" @click="backLogin" style="background-color: #f08c4e;" id="img_btn">
                <el-icon>登录
                </el-icon>
             </el-button>
          </div>
        </div>
        <transition name="slide-register" mode="out-in">
        <!-- 注册表单 -->
        <div class="form sign-up" >
          <h2>找回密码</h2>
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="form-content">
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="registerForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="registerForm.password"  type="password" autocomplete="off" show-password/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword" autocomplete="off" show-password/>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <div id="captchaQuestion" style="color:black;" >请计算：{{ captchaQuestion }}</div>
                <el-input v-model="registerForm.captcha" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="emailCode" >
                <el-input v-model="registerForm.emailCode" autocomplete="off"/>
                <el-button @click="sendEmailCode" :disabled="isSending" id="emailCode">发送验证码</el-button>
            </el-form-item>
          </el-form>
          <div class="buttonWrapper">
            <el-button type="primary" class="submit" @click="resetForm">重置</el-button>
            <el-button type="primary" class="submit" @click="handleRegister">提交</el-button>
          </div>
      
        </div>
      </transition>
      </div>
    </div>

  </template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

import { ENDPOINTS } from '@/constants/api';
  // 表单数据
import { useRouter } from 'vue-router';

const router = useRouter();

const registerForm = ref({
    captcha: '',
    password: '',
    confirmPassword: '',
    email: '',
    emailCode: ''
});
  

/**
 * 生成一个简单的算术验证码。
 * 验证码由两个10到29之间的随机数和一个加号或减号组成。
 * 返回一个对象，包含生成的算术问题和正确答案。
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

const captcha = ref(generateCaptcha());  // 生成算术验证码
const captchaQuestion = ref(captcha.value.question);  // 算术问题

// 返回登录界面
const backLogin = () => {
    router.push('/login');
  }

const registerRules = {
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
                callback();
            }
        }, trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    emailCode: [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
};

const isSending = ref(false);
const timer = ref(null);

const resetForm=(e: Event) => {
    e.preventDefault();
    registerForm.value = {
        captcha: '',
        password: '',
        confirmPassword: '',
        email: '',
        emailCode: ''
    };
};

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
            ElMessage.error('发送验证码出错');
            console.error('发送验证码出错',error.message);
            isSending.value = false;
        });
};

const startTimer = () => {
    timer.value = setTimeout(() => {
        isSending.value = false;
    }, 60000); // 60秒
};

const registerFormRef = ref(null);

/**
 * 处理重置密码表单提交，验证输入信息并发送重置密码请求。
 * 该函数首先验证注册表单的有效性，然后检查验证码是否正确。
 * 如果验证通过，将通过 Axios 向服务器发送重置密码请求。
 * 根据服务器响应，显示相应的提示信息，并在成功时跳转到登录界面。
 * @function handleRegister
 */
const handleRegister = () => {
   console.log(registerForm.value);
    registerFormRef.value.validate((valid: boolean) => {
        if (valid) {
          if (parseInt(registerForm.value.captcha) !== captcha.value.answer) {
                ElMessage.error('验证码错误');
                captcha.value = generateCaptcha();
                captchaQuestion.value = captcha.value.question;
                return;
            }
            axios.post(ENDPOINTS.FORGOTPASSWORD, {
                password: registerForm.value.password,
                email: registerForm.value.email,
                code: registerForm.value.emailCode
            },{
            withCredentials: true  // 确保跨域请求携带 cookie
            })
            .then(response => {
                if (response.data.status === 830) {
                    ElMessage.success('重置密码成功，自动跳转登录界面');
                    router.push('/login');
                } else {
                    ElMessage.error('重置密码失败');
                    console.log('重置密码失败：' +response.data.message);
                }
            })
            .catch(error => {
                ElMessage.error('重置密码出错');
                console.error('重置密码失败：' +error.message);
            });
        } else {
            ElMessage.error('请正确填写信息');
            return false;
        }
    });
};
</script>

<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center; 
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: rgb(249, 221, 205);
}
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
  right: 0%;
}

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
  font-family: Courier,Kaiti, monospace,CustomFont;
}
.el-button{
  color:#fff;
  font-family: Courier,Kaiti, monospace,CustomFont;
  font-weight: 600;
}
}

/* 移动端布局 */
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
  bottom:0%;
  
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
  font-family: Courier,Kaiti, monospace,CustomFont;
  font-weight: 600;
}
}

</style>

  
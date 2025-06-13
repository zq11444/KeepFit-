<template>
    <div class="container">
        <div class="form-box" :style="{ transform: formTransform }">
            <!-- Register Form -->
            <div class="register-box" :class="{ hidden: !showRegister }">
                <h1>register</h1>
                <input type="text" placeholder="用户名" v-model="registerData.username">
                <input type="password" placeholder="密码" v-model="registerData.password">
                <input type="password" placeholder="确认密码" v-model="registerData.confirmPassword">
                <p class="error-message" v-if="registerError">{{ registerError }}</p>
                <button @click="handleRegister" :disabled="isRegistering">
                    {{ isRegistering ? '注册中...' : '注册' }}
                </button>
            </div>

            <!-- Login Form -->
            <div class="login-box" :class="{ hidden: showRegister }">
                <h1>login</h1>
                <input type="text" placeholder="用户名" v-model="loginData.username">
                <input type="password" placeholder="密码" v-model="loginData.password">
                <button @click="handleLogin">登录</button>
            </div>
        </div>

        <div class="con-box left">
            <h2>欢迎来到<span>KeepFit</span></h2>
            <img :src="logo" alt="logo">
            <p>已有账号</p>
            <button @click="showLogin">去登录</button>
        </div>

        <div class="con-box right">
            <h2>欢迎来到<span>健身之家</span></h2>
            <img :src="logo2" alt="">
            <p>没有账号？</p>
            <button @click="showRegisterForm">去注册</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/健身.png';
import logo2 from '@/assets/水果.png';
import axios from 'axios';
import { alert } from '@/utils/alert';
const router = useRouter();



const registerData = ref({
    username: '',
    password: '',
    confirmPassword: ''
});

const loginData = ref({
    username: '',
    password: ''
});

const showRegister = ref(false);
const formTransform = ref('translateX(0%)');
const isRegistering = ref(false);
const registerError = ref('');

const showRegisterForm = () => {
    formTransform.value = 'translateX(80%)';
    showRegister.value = true;
};

const showLogin = () => {
    formTransform.value = 'translateX(0%)';
    showRegister.value = false;
};

const handleRegister = async () => {
  // 验证输入
  if (!registerData.value.username || !registerData.value.password) {
    registerError.value = '请输入用户名和密码';
    return;
  }
  
  if (registerData.value.password !== registerData.value.confirmPassword) {
    registerError.value = '两次输入的密码不一致';
    return;
  }

  isRegistering.value = true;
  registerError.value = '';

  try {
    const requestData = {
      userName: registerData.value.username,
      passWord: registerData.value.password,
      confirmPassword: registerData.value.confirmPassword
    };

    const response = await axios.post('/api/auth/register', requestData);
    console.log('注册响应:', response.data);

    // 修改这里的判断逻辑
    if (response.status === 201) {
      // 清空注册表单
      registerData.value.username = '';
      registerData.value.password = '';
      registerData.value.confirmPassword = '';
      
      alert.success('注册成功！');  // 替换 alert
      
      // 确保调用切换到登录页面
      showLogin();
    } else {
      registerError.value = response.data?.message || '注册失败';
    }
  } catch (error) {
    console.error('Register error:', error);
    registerError.value = error.response?.data?.message || '注册失败，请稍后重试';
  } finally {
    isRegistering.value = false;
  }
};

// 添加请求配置
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const handleLogin = async () => {
    if (!loginData.value.username || !loginData.value.password) {
        alert.warning('请输入用户名和密码');  // 替换 alert
        return;
    }

    try {
        // 构造请求数据
        const requestData = {
            userName: loginData.value.username,
            passWord: loginData.value.password
        };

        console.log('发送登录请求:', requestData);

        const response = await axios.post('/api/auth/adminlogin', requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('登录响应:', response.data);

        if (response.data) {
            // 保存token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            alert.success('登录成功');  // 替换 alert
            router.push('/manager/Manager');
        }
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = '登录失败';
        
        if (error.response) {
            // 服务器返回错误响应
            errorMessage = error.response.data?.message || `登录失败(${error.response.status})`;
            console.log('错误响应:', error.response.data);
        } else if (error.request) {
            // 请求发送失败
            errorMessage = '网络连接失败，请检查服务器状态';
        } else {
            // 请求配置错误
            errorMessage = error.message;
        }
        
        alert.error(errorMessage);  // 替换 alert
    }
};
</script>

<style scoped>
#app {
    display: flex !important;
}

* {
    margin: 0;
    padding: 0;
}

.page-wrapper {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: linear-gradient(120deg, rgba(98, 82, 221, 0.1), transparent);
}


body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
}

.container {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    width: 650px;
    height: 415px;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(98, 82, 221, 0.15);
    position: relative;
}

.form-box {
    position: absolute;
    top: -10%;
    left: 5%;
    background-color: #6252dd;
    width: 320px;
    height: 500px;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(98, 82, 221, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transition: 0.5s ease-in-out;
}

.register-box,
.login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.hidden {
    display: none;
    transition: 0.5s;
}

h1 {
    text-align: center;
    margin-bottom: 25px;
    text-transform: uppercase;
    color: #fff;
    letter-spacing: 5px;
}

.password-input {
    color: white;
}

input {
    background-color: transparent;
    width: 70%;
    color: #fff;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    padding: 10px 0;
    text-indent: 10px;
    margin: 8px 0;
    font-size: 14px;
    letter-spacing: 2px;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.8);
}

input:focus {
    color: #fff;
    outline: none;
    border-bottom: 1px solid #fff;
    transition: 0.5s;
}

input:focus::placeholder {
    opacity: 0;
}

.form-box button {
    width: 70%;
    margin-top: 35px;
    background-color: #fff;
    outline: none;
    border-radius: 8px;
    padding: 13px;
    color: #6252dd;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.form-box button:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.con-box {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.con-box.left {
    left: -2%;
}

.con-box.right {
    right: -2%;
}

.con-box h2 {
    color: #6252dd;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 4px;
}

.con-box p {
    font-size: 12px;
    letter-spacing: 2px;
    color: #6252dd;
    text-align: center;
}

.con-box span {
    color: #6252dd;
    font-weight: bold;
}

.con-box img {
    width: 150px;
    height: 150px;
    opacity: 0.9;
    margin: 40px 0;
}

.con-box button {
    margin-top: 3%;
    background-color: transparent;
    color: #6252dd;
    border: 2px solid #6252dd;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.con-box button:hover {
    background-color: #6252dd;
    color: #fff;
    transform: translateY(-2px);
}

.error-message {
    color: #ff4747;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
    width: 70%;
}

.form-box button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
}
</style>
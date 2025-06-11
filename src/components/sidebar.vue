<template>
    <div class="shell" :class="{ 'collapsed': !isExpanded }" @mouseenter="expand" @mouseleave="collapse">
        <ul class="nav">
            <li v-for="(item, index) in navItems" :key="index"
                :class="{ active: isActive(item.path) && item.selectable }" @click="handleItemClick(item, index)">

                <router-link v-if="item.selectable" :to="item.path" custom v-slot="{ navigate, isActive }">
                    <div class="nav-link" @click="navigate">
                        <div class="dot"></div>
                        <div class="text">{{ item.text }}</div>
                    </div>
                </router-link>
                <div v-else class="nav-link title-item">
                    <div class="dot"></div>
                    <div class="text">{{ item.text }}</div>
                </div>
            </li>
        </ul>
        <div class="logout-btn" @click="handleLogout">
            <div class="nav-link">
                <div class="dot"></div>
                <div class="text">退出登录</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['update:active'])

const isExpanded = ref(false)

const navItems = [
    {
        text: 'KeepFit管理系统',
        id: 'logo',
        path: '',
        selectable: false
    },
    {
        text: '首页',
        id: 'home',
        path: '/manager/Manager',
        selectable: true
    },
    {
        text: '用户管理',
        id: 'users',
        path: '/manager/ManagerUser',
        selectable: true
    },
    {
        text: '教练管理',
        id: 'coaches',
        path: '/manager/ManagerCoach',
        selectable: true
    },
    {
        text: '课程管理',
        id: 'courses',
        path: '/manager/ManagerClass',
        selectable: true
    }
]

// 根据当前路由自动激活对应菜单项
const isActive = (path: string) => {
    return route.path === path
}

const handleItemClick = (item: any, index: number) => {
    if (item.selectable) {
        emit('update:active', index)
        router.push(item.path)
    }
}

const expand = () => {
    isExpanded.value = true
}

const collapse = () => {
    isExpanded.value = false
}

const handleLogout = () => {
    router.push('/')
}
</script>

<style scoped>
.shell {
    height: 100%;
    background: #6252dd;
    z-index: 9999;
    transition: all 0.5s;
    padding-left: 10px;
    overflow: hidden;
    width: 84px;
}

.shell.collapsed {
    width: 84px;
}

.shell.collapsed .text {
    width: 0;
    padding-left: 0;
    opacity: 0;
}

.shell:hover {
    width: 220px;
    /* 减小展开宽度 */
}

.shell:hover .text {
    width: 140px;
    /* 减小文本容器宽度 */
    padding-left: 15px;
    opacity: 1;
}

.nav {
    position: relative;
    height: 100vh;
    margin: 0;
    padding: 0;
    list-style: none;
}

.nav li {
    position: relative;
    padding: 5px;
    list-style: none;
    margin: 0;
}

.active {
    background: #ffffff;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    position: relative;
    z-index: 1;
}

.active .text {
    color: #6252dd;
    font-weight: 600;
}

.active .dot {
    background: linear-gradient(135deg, #6252dd 0%, #6252dd 100%);
    box-shadow: 0 0 8px rgba(98, 82, 221, 0.5);
    transform: scale(1.2);
}

.shell.collapsed .active {
    background: transparent;
}

.shell.collapsed .active::before,
.shell.collapsed .active::after {
    display: none;
}

.active::before {
    content: "";
    position: absolute;
    top: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-bottom-right-radius: 25px;
    box-shadow: 5px 5px 0 5px #ffffff;
    background: transparent;
    z-index: 0;
}

.active::after {
    content: "";
    position: absolute;
    bottom: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-top-right-radius: 25px;
    box-shadow: 5px -5px 0 5px #ffffff;
    background: transparent;
    z-index: 0;
}

#logo {
    margin: 40px 0 100px 0;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 15px;
    background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
}

.active .dot {
    background: linear-gradient(135deg, #6252dd 0%, #6252dd 100%);
    box-shadow: 0 0 8px rgba(98, 82, 221, 0.5);
    transform: scale(1.2);
}

.nav-link {
    position: relative;
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    padding: 10px 0;
}

.text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s;
    white-space: nowrap;
    width: 0;
    overflow: hidden;
}

.nav li:hover a .text {
    color: #ffffff;
}

.active a .icon::before {
    content: "";
    position: absolute;
    inset: 5px;
    width: 60px;
    background: #000000;
    border-radius: 50%;
    transition: 0.5s;
    border: 7px solid #ffffff;
    box-sizing: border-box;
}

.active .nav-link .text {
    color: #6252dd;
    font-weight: 600;
}

.nav li:hover .nav-link .text {
    color: #ffffff;
}

.active:hover .nav-link .text {
    color: #6252dd;
}

.title-link {
    padding-left: 15px;
}

.logout-btn {
    position: absolute;
    bottom: 30px;
    width: 100%;
    cursor: pointer;
    padding: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 20px;
}

.logout-btn .text {
    color: #ff6b6b;
    font-weight: 500;
}

.logout-btn:hover .nav-link .text {
    color: #ff4747;
}

.logout-btn .dot {
    background: linear-gradient(135deg, #ff4747 0%, #ff6b6b 100%);
    box-shadow: 0 0 8px rgba(255, 71, 71, 0.5);
    width: 8px;
    height: 8px;
}

.logout-btn:hover .dot {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8585 100%);
    transform: scale(1.2);
}

.shell:hover .logout-btn .nav-link {
    background: rgba(255, 71, 71, 0.1);
    border-radius: 8px;
    margin-right: 10px;
}

.title-item .dot {
    display: none;
}

.title-item .text {
    padding-left: 15px;
}
</style>
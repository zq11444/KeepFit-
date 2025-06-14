<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑用户信息"
        width="30%"
        :close-on-click-modal="false"
        class="custom-dialog"
    >
        <el-form :model="form" label-width="80px" ref="formRef">
            <el-form-item label="用户ID" required>
                <el-input v-model="form.uid" disabled />
            </el-form-item>
            <el-form-item 
                label="用户名" 
                prop="userName"
                :rules="rules.userName"
            >
                <el-input v-model="form.userName" placeholder="请输入用户名" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="loading">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import { alert } from '@/utils/alert'  // 修改这行

interface Props {
    modelValue: boolean
    user: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'update'])

const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const form = ref({
    uid: '',
    userName: ''
})

const rules = {
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在2到20个字符之间', trigger: 'blur' }
    ]
}

watch(() => props.modelValue, (val) => {
    dialogVisible.value = val
})

watch(() => dialogVisible.value, (val) => {
    emit('update:modelValue', val)
    if (val && props.user) {
        form.value = { ...props.user }
    }
})

const handleCancel = () => {
    dialogVisible.value = false
}

const handleConfirm = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                const response = await axios.put(`http://localhost:5000/api/manager/user_data/${form.value.uid}`, {
                    userName: form.value.userName
                });
                
                if (response.status === 200) {
                    // 更新数据
                    emit('update', {
                        uid: form.value.uid,
                        userName: form.value.userName
                    });
                    // 先关闭对话框
                    dialogVisible.value = false;
                    // 显示成功提示
                    setTimeout(() => {
                        alert.success('用户信息更新成功');
                    }, 100);
                }
            } catch (error) {
                console.error('更新用户失败:', error);
                alert.error(error.response?.data?.message || '更新失败，请重试');
            } finally {
                loading.value = false;
            }
        }
    })
}
</script>

<style scoped>
:deep(.el-dialog) {
    border-radius: 8px;
    overflow: hidden;
}

:deep(.el-dialog__header) {
    background: linear-gradient(120deg, #6252dd, #9747FF);
    padding: 20px;
    margin: 0;
}

:deep(.el-dialog__title) {
    color: white;
    font-weight: 600;
}

:deep(.el-dialog__body) {
    padding: 30px 20px;
}

:deep(.el-dialog__footer) {
    border-top: 1px solid #f0f0f0;
    padding: 15px 20px;
}

:deep(.el-button--primary) {
    background-color: #6252dd;
    border-color: #6252dd;
}

:deep(.el-button--primary:hover) {
    background-color: #7262ee;
    border-color: #7262ee;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}
</style>

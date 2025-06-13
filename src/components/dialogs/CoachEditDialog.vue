<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑教练信息"
        width="40%"
        :close-on-click-modal="false"
        class="custom-dialog"
    >
        <el-form :model="form" label-width="100px" ref="formRef">
            <el-form-item label="教练ID" required>
                <el-input v-model="form.cid" disabled />
            </el-form-item>
            <el-form-item 
                label="教练姓名" 
                prop="coachName"
                :rules="[{ required: true, message: '请输入教练姓名', trigger: 'blur' }]"
            >
                <el-input v-model="form.coachName" placeholder="请输入教练姓名" />
            </el-form-item>
            <el-form-item 
                label="简介" 
                prop="coachBrief"
            >
                <el-input type="textarea" v-model="form.coachBrief" placeholder="请输入教练简介" :rows="3" />
            </el-form-item>
            <el-form-item 
                label="专长" 
                prop="coachTag"
            >
                <el-input v-model="form.coachTag" placeholder="请输入专长领域" />
            </el-form-item>
            <el-form-item 
                label="等级" 
                prop="coachStar"
            >
                <el-select v-model="form.coachStar" placeholder="请选择教练等级" style="width: 100%">
                    <el-option label="一星教练" value="一星教练" />
                    <el-option label="二星教练" value="二星教练" />
                    <el-option label="三星教练" value="三星教练" />
                </el-select>
            </el-form-item>
            <el-form-item label="关注度">
                <el-input-number v-model="form.publicity" :min="0" />
            </el-form-item>
            <el-form-item label="评价数">
                <el-input-number v-model="form.comment" :min="0" />
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
    coach: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'update'])

const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const form = ref({
    cid: '',
    coachName: '',
    coachBrief: '',
    coachTag: '',
    coachStar: '',
    publicity: 0,
    comment: 0
})

watch(() => props.modelValue, (val) => {
    dialogVisible.value = val
})

watch(() => dialogVisible.value, (val) => {
    emit('update:modelValue', val)
    if (val && props.coach) {
        form.value = { ...props.coach }
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
                const response = await axios.put(`http://localhost:5000/api/manager/coach/${form.value.cid}`, {
                    coachName: form.value.coachName,
                    coachBrief: form.value.coachBrief,
                    coachTag: form.value.coachTag,
                    coachStar: form.value.coachStar,
                    publicity: form.value.publicity,
                    comment: form.value.comment
                })
                
                if (response.status === 200) {
                    alert.success('教练信息更新成功')  // 修改这行
                    emit('update', form.value)
                    dialogVisible.value = false
                }
            } catch (error) {
                console.error('更新教练信息失败:', error)
                alert.error(error.response?.data?.message || '更新失败，请重试')  // 修改这行
            } finally {
                loading.value = false
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

:deep(.el-input-number .el-input__inner) {
    text-align: left;
}
</style>

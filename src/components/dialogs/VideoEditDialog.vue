<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑视频"
    width="40%"
    :close-on-click-modal="false"
    class="custom-dialog"
  >
    <el-form v-if="form" :model="form" label-width="100px" ref="formRef">
      <el-form-item 
        label="教练" 
        prop="coach_id"
        :rules="[{ required: true, message: '请选择教练', trigger: 'change' }]"
      >
        <el-select v-model="form.coach_id" placeholder="请选择教练" style="width: 100%">
          <el-option 
            v-for="coach in coaches" 
            :key="coach.cid" 
            :label="coach.coachName" 
            :value="coach.cid" 
          />
        </el-select>
      </el-form-item>

      <el-form-item 
        label="视频标题" 
        prop="title"
        :rules="[{ required: true, message: '请输入视频标题', trigger: 'blur' }]"
      >
        <el-input v-model="form.title" placeholder="请输入视频标题" />
      </el-form-item>

      <el-form-item 
        label="视频类型" 
        prop="type"
        :rules="[{ required: true, message: '请选择视频类型', trigger: 'change' }]"
      >
        <el-select v-model="form.type" placeholder="请选择视频类型" style="width: 100%">
          <el-option label="有氧操" value="有氧操" />
          <el-option label="跳绳" value="跳绳" />
          <el-option label="八段锦" value="八段锦" />
          <el-option label="HIIT" value="HIIT" />
          <el-option label="舞蹈燃脂" value="舞蹈燃脂" />
          <el-option label="帕梅拉" value="帕梅拉" />
          <el-option label="腰腹减脂塑形" value="腰腹减脂塑形" />
          <el-option label="瑜伽" value="瑜伽" />
          <el-option label="跑步" value="跑步" />
          <el-option label="增肌" value="增肌" />
          <el-option label="冥想" value="冥想" />
          <el-option label="瘦腿" value="瘦腿" />
        </el-select>
      </el-form-item>

      <el-form-item 
        label="难度等级" 
        prop="hard"
        :rules="[{ required: true, message: '请选择难度等级', trigger: 'change' }]"
      >
        <el-select v-model="form.hard" placeholder="请选择难度等级" style="width: 100%">
          <el-option label="K1零基础" value="K1零基础" />
          <el-option label="K2初学" value="K2初学" />
          <el-option label="K3进阶" value="K3进阶" />
          <el-option label="K4强化" value="K4强化" />
          <el-option label="K5挑战" value="K5挑战" />
        </el-select>
      </el-form-item>

      <el-form-item 
        label="封面图片" 
        prop="pictureUrl"
        :rules="[{ required: true, message: '请输入封面图片链接', trigger: 'blur' }]"
      >
        <el-input v-model="form.pictureUrl" placeholder="请输入封面图片链接" />
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
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import { alert } from '@/utils/alert'

const props = defineProps<{
  modelValue: boolean
  video: any
  coaches: any[]
}>()

const emit = defineEmits(['update:modelValue', 'update'])

const loading = ref(false)
const formRef = ref<FormInstance>()

const form = ref<any>(null)

watch(() => props.video, (newVideo) => {
  if (newVideo) {
    form.value = { ...newVideo }
  }
}, { immediate: true })

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleCancel = () => {
  dialogVisible.value = false
}

const handleConfirm = async () => {
  if (!formRef.value || !form.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const response = await axios.put(`http://localhost:5000/api/manager/coachvideo/${form.value.videoid}`, form.value)
    
    if (response.status === 200) {
      emit('update', response.data)
    }
  } catch (error: any) {
    console.error('更新视频错误:', error)
    alert.error(error.response?.data?.message || '更新失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.el-dialog__header) {
  background: linear-gradient(120deg, #6252dd, #9747FF);
  padding: 20px;
  margin: 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.el-button--primary) {
  background-color: #6252dd;
  border-color: #6252dd;
}

:deep(.el-button--primary:hover) {
  background-color: #7262ee;
  border-color: #7262ee;
}
</style>

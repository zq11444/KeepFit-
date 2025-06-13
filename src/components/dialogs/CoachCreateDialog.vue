<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增教练"
    width="40%"
    :close-on-click-modal="false"
    class="custom-dialog"
  >
    <el-form :model="form" label-width="100px" ref="formRef">
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
        :rules="[{ required: true, message: '请输入教练简介', trigger: 'blur' }]"
      >
        <el-input type="textarea" v-model="form.coachBrief" placeholder="请输入教练简介" :rows="3" />
      </el-form-item>
      <el-form-item 
        label="专长" 
        prop="coachTag"
        :rules="[{ required: true, message: '请输入专长领域', trigger: 'blur' }]"
      >
        <el-input v-model="form.coachTag" placeholder="请输入专长领域，用,分隔" />
      </el-form-item>
      <el-form-item 
        label="等级" 
        prop="coachStar"
        :rules="[{ required: true, message: '请选择教练等级', trigger: 'change' }]"
      >
        <el-select v-model="form.coachStar" placeholder="请选择教练等级" style="width: 100%">
          <el-option label="一星教练" value="一星教练" />
          <el-option label="二星教练" value="二星教练" />
          <el-option label="三星教练" value="三星教练" />
        </el-select>
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
}>()

const emit = defineEmits(['update:modelValue', 'created'])

const loading = ref(false)
const formRef = ref<FormInstance>()

const form = ref({
  coachName: '',
  coachBrief: '',
  coachTag: '',
  coachStar: '',
  publicity: 0,
  comment: 0
})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  if (!val) {
    formRef.value?.resetFields()
  }
})

const handleCancel = () => {
  dialogVisible.value = false
}

const handleConfirm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const response = await axios.post('http://localhost:5000/api/manager/coach', form.value)
    
    if (response.status === 200) {
      const newCoach = response.data
      emit('created', {
        cid: newCoach.cid,
        coachName: newCoach.coachName,
        coachBrief: newCoach.coachBrief,
        coachTag: newCoach.coachTag,
        coachStar: newCoach.coachStar,
        publicity: newCoach.publicity || 0,
        comment: newCoach.comment || 0
      })
      formRef.value.resetFields()
      dialogVisible.value = false
      alert.success('添加教练成功')
    }
  } catch (error: any) {
    console.error('创建教练错误:', error)
    alert.error(error.response?.data?.message || '添加失败，请重试')
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
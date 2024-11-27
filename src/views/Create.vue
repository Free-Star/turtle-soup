<template>
  <div class="create-puzzle">
    <h2>创建新的海龟汤题目</h2>
    
    <el-form 
      :model="puzzleForm" 
      :rules="rules"
      ref="formRef"
      label-width="120px"
      class="puzzle-form"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="puzzleForm.title" placeholder="请输入题目标题"/>
      </el-form-item>
      
      <el-form-item label="提示信息" prop="hint">
        <el-input 
          v-model="puzzleForm.hint" 
          type="textarea" 
          rows="3"
          placeholder="请输入玩家看到的提示信息"
        />
      </el-form-item>
      
      <el-form-item label="真相" prop="truth">
        <el-input 
          v-model="puzzleForm.truth" 
          type="textarea" 
          rows="5"
          placeholder="请输入完整的故事真相"
        />
      </el-form-item>
      
      <el-form-item label="难度" prop="difficulty">
        <el-select v-model="puzzleForm.difficulty">
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="puzzleForm.type">
          <el-radio label="classic">经典题目</el-radio>
          <el-radio label="user">用户原创</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useGameStore()
const formRef = ref(null)

const puzzleForm = reactive({
  title: '',
  hint: '',
  truth: '',
  difficulty: 'medium',
  type: 'user'
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  hint: [
    { required: true, message: '请输入提示信息', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  truth: [
    { required: true, message: '请输入故事真相', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ]
}

const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      // 这里应该调用 store 的 action 来保存新题目
      // 现在先简单实现
      const newPuzzle = {
        ...puzzleForm,
        id: store.puzzles.length + 1,
        answered: false
      }
      
      store.puzzles.push(newPuzzle)
      ElMessage.success('创建成功！')
      router.push('/')
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.create-puzzle {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.puzzle-form {
  margin-top: 20px;
}
</style> 
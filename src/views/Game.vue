<template>
  <div class="game" v-if="currentPuzzle">
    <el-card class="hint-card">
      <template #header>
        <div class="card-header">
          <h2 class="title">{{ currentPuzzle.title }}</h2>
          <el-button 
            type="info" 
            size="small"
            class="hint-button"
            @click="getHint"
            :disabled="store.hintCount >= store.maxHints || currentPuzzle.answered"
          >
            获取提示 ({{ store.maxHints - store.hintCount }}/{{ store.maxHints }})
          </el-button>
        </div>
      </template>
      <p>{{ currentPuzzle.hint }}</p>
      <div v-if="store.hints.length" class="hints-section">
        <el-divider>提示信息</el-divider>
        <p v-for="(hint, index) in store.hints" :key="index" class="hint-text">
          {{ index + 1 }}. {{ hint }}
        </p>
      </div>
    </el-card>

    <div class="qa-section">
      <div class="questions">
        <el-timeline>
          <el-timeline-item
            v-for="(qa, index) in store.questions"
            :key="index"
            :type="getAnswerType(qa.answer)"
            class="qa-item"
          >
            <p class="question">问：{{ qa.question }}</p>
            <p class="answer">答：{{ qa.answer }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>

      <div class="ask-question">
        <el-input
          v-model="newQuestion"
          placeholder="请输入你的问题"
          :disabled="currentPuzzle.answered || store.isLoading"
          class="question-input"
        >
          <template #append>
            <el-button 
              @click="askQuestion" 
              :loading="store.isLoading"
              :disabled="!newQuestion || store.isLoading"
              class="ask-button"
            >
              提问
            </el-button>
          </template>
        </el-input>
      </div>

      <div class="actions">
        <div class="main-actions">
          <el-button 
            @click="store.toggleAnswerInput" 
            type="primary" 
            class="action-button"
            v-if="!currentPuzzle.answered"
          >
            猜测真相
          </el-button>
          
          <el-button
            @click="giveUp"
            type="danger"
            class="give-up-btn action-button"
            v-if="!currentPuzzle.answered && store.wrongGuesses >= 3"
          >
            <span>😅 需要帮助</span>
          </el-button>
        </div>
        
        <div v-if="store.wrongGuesses >= 2 && !currentPuzzle.answered" class="hint-message">
          <el-alert
            title="已经猜错多次啦，再猜一次就可以查看答案哦~"
            type="warning"
            :closable="false"
            show-icon
          />
        </div>
        
        <el-dialog
          v-model="store.showAnswerInput"
          title="提交你的答案"
          :width="isMobile ? '90%' : '50%'"
          :close-on-click-modal="false"
          :show-close="true"
          class="answer-dialog"
        >
          <el-input
            v-model="userAnswer"
            type="textarea"
            :rows="3"
            placeholder="请输入你认为的真相..."
            class="answer-textarea"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="store.toggleAnswerInput" class="dialog-button">取消</el-button>
              <el-button type="primary" @click="submitAnswer" :loading="isSubmitting" class="dialog-button">
                提交答案
              </el-button>
            </span>
          </template>
        </el-dialog>
        
        <div v-if="store.lastAnswerFeedback" class="feedback-message">
          <el-alert
            :title="store.lastAnswerFeedback"
            :type="currentPuzzle.answered ? 'success' : 'info'"
            :closable="false"
          />
        </div>
        
        <el-card v-if="currentPuzzle.answered" class="truth-card">
          <template #header>
            <div class="card-header">
              <h3>真相揭晓</h3>
            </div>
          </template>
          <p>{{ currentPuzzle.truth }}</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { ElMessage } from 'element-plus'

const route = useRoute()
const store = useGameStore()
const newQuestion = ref('')
const userAnswer = ref('')
const isSubmitting = ref(false)

const currentPuzzle = computed(() => store.currentPuzzle)

onMounted(() => {
  const puzzleId = parseInt(route.params.id)
  store.selectPuzzle(puzzleId)
})

const askQuestion = () => {
  if (newQuestion.value) {
    store.askQuestion(newQuestion.value)
    newQuestion.value = ''
  }
}

const giveUp = () => {
  store.giveUp()
}

const getHint = async () => {
  try {
    await store.getHint()
  } catch (error) {
    ElMessage.error('获取提示失败，请稍后重试')
  }
}

const getAnswerType = (answer) => {
  const types = {
    '是': 'success',
    '否': 'danger',
    '不相关': 'info'
  }
  return types[answer]
}

const submitAnswer = async () => {
  if (!userAnswer.value.trim()) {
    ElMessage.warning('请输入你的答案')
    return
  }
  
  isSubmitting.value = true
  try {
    await store.verifyAnswer(userAnswer.value)
    userAnswer.value = ''
  } catch (error) {
    ElMessage.error('提交答案失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 添加移动端检测
const isMobile = computed(() => {
  return window.innerWidth <= 768
})
</script>

<style scoped>
.game {
  max-width: 800px;
  margin: 0 auto;
  padding: 12px;
}

/* 卡片样式优化 */
.hint-card {
  margin-bottom: 16px;
}

.card-header {
  flex-wrap: wrap;
  gap: 10px;
}

.title {
  font-size: 1.2rem;
  margin: 0;
}

/* 问答区域样式优化 */
.questions {
  margin-bottom: 16px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 0 8px;
}

.qa-item {
  margin-bottom: 12px;
}

.question, .answer {
  margin: 4px 0;
  word-break: break-word;
}

/* 输入框样式优化 */
.question-input {
  margin-bottom: 16px;
}

/* 按钮样式优化 */
.action-button {
  min-width: 100px;
  height: 40px;
  font-size: 16px;
}

.give-up-btn {
  margin-left: 8px;
}

/* 弹窗样式优化 */
.answer-dialog :deep(.el-dialog) {
  margin: 20px auto !important;
}

.answer-textarea {
  margin-bottom: 16px;
}

.dialog-footer {
  width: 100%;
}

.dialog-button {
  flex: 1;
  max-width: 120px;
  height: 40px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .game {
    padding: 8px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .hint-button {
    width: 100%;
    margin-top: 8px;
  }
  
  .main-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-button {
    width: 100%;
    margin: 0;
  }
  
  .give-up-btn {
    margin-left: 0;
  }
  
  .dialog-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }
  
  .dialog-button {
    max-width: 100%;
  }
}
</style> 
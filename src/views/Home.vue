<template>
    <div class="home">
      <div class="page-header">
        <h1>海龟汤</h1>
        <p class="subtitle">一起来挑战智力推理游戏吧！</p>
      </div>
      
      <div class="puzzle-actions">
        <el-upload
          class="upload-demo"
          accept=".json"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
        >
          <el-button type="primary" class="action-btn">
            <el-icon><Upload /></el-icon>
            导入题库
          </el-button>
        </el-upload>
        <el-button type="success" @click="exportPuzzles" class="action-btn">
          <el-icon><Download /></el-icon>
          导出题库
        </el-button>
      </div>
      
      <div class="puzzle-grid">
        <el-card 
          v-for="puzzle in classicPuzzles" 
          :key="puzzle.id" 
          class="puzzle-card"
          :body-style="{ padding: '0' }"
        >
          <div class="card-cover" :class="puzzle.difficulty">
            <el-tag :type="getDifficultyType(puzzle.difficulty)" effect="dark" class="difficulty-tag">
              {{ getDifficultyText(puzzle.difficulty) }}
            </el-tag>
          </div>
          <div class="card-content">
            <h3>{{ puzzle.title }}</h3>
            <p class="hint-text">{{ puzzle.hint }}</p>
            <div class="card-footer">
              <button 
                @click="startGame(puzzle.id)" 
                class="start-btn"
              >
                <el-icon><CaretRight /></el-icon>
                <span>开始挑战</span>
              </button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStore } from '../stores/gameStore'
  import { ElMessage } from 'element-plus'
  
  // 导入图标组件
  import { Upload, Download, Plus, CaretRight } from '@element-plus/icons-vue'
  
  // 注册图标组件（如果需要全局注册）
  const components = {
    Upload,
    Download,
    Plus,
    CaretRight
  }
  
  const router = useRouter()
  const store = useGameStore()
  
  onMounted(async () => {
    await store.initPuzzles()
  })
  
  const classicPuzzles = computed(() => 
    store.puzzles.filter(p => p.type === 'classic')
  )
  
  const getDifficultyType = (difficulty) => {
    const types = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger'
    }
    return types[difficulty]
  }
  
  const startGame = (puzzleId) => {
    console.log('Starting game with puzzle ID:', puzzleId)
    if (!puzzleId && puzzleId !== 0) {
      ElMessage.warning('无效的游戏ID')
      return
    }
    router.push(`/game/${puzzleId}`)
  }
  
  const handleFileChange = async (file) => {
    try {
      await store.importPuzzles(file.raw)
      ElMessage.success('题库导入成功')
    } catch (error) {
      ElMessage.error('题库导入失败，请检查文件格式')
    }
  }
  
  const exportPuzzles = async () => {
    try {
      await store.exportPuzzles()
      ElMessage.success('题库导出成功')
    } catch (error) {
      ElMessage.error('题库导出失败')
    }
  }
  
  const getDifficultyText = (difficulty) => {
    const texts = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    }
    return texts[difficulty]
  }
  
  // 添加一个计算属性来检查谜题数据
  const debugPuzzles = computed(() => {
    console.log('Current puzzles:', store.puzzles)
    return store.puzzles
  })
  </script>
    <style scoped>
  .home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    padding-top: 40px;
    padding-bottom: 40px;
    min-height: 100vh;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    color: var(--text-primary);
    margin-bottom: 12px;
  }
  
  .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
  
  .puzzle-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    justify-content: center;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .puzzle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 24px;
  }
  
  .puzzle-card {
    transition: all 0.3s ease;
    overflow: hidden;
    background: #fff;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    width: 280px;
    margin: 0 auto;
  }
  
  .puzzle-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }
  
  .card-cover {
    height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 12px 0 0;
  }
  
  .difficulty-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 0.85rem;
    padding: 4px 12px;
    border-radius: 4px;
  }
  
  .card-cover.easy {
    background: linear-gradient(135deg, #54e2ae 0%, #10B981 100%);
  }
  
  .card-cover.medium {
    background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  }
  
  .card-cover.hard {
    background: linear-gradient(135deg, #844747 0%, #DC2626 100%);
  }
  
  .card-content {
    padding: 20px;
    background: #fff;
  }
  
  .card-content h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
    height: 40px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .hint-text {
    color: var(--text-regular);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 16px;
    height: 60px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .card-footer {
    padding: 0;
    margin-top: 20px;
  }
  
  .start-btn {
    width: 100%;
    height: 36px;
    border-radius: 8px;
    font-weight: 500;
    background-color: #5fd563;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    padding: 0 16px;
    font-size: 14px;
  }
  
  .start-btn:hover {
    transform: translateY(-2px);
    background-color: #45a049;
    opacity: 0.95;
  }
  
  .start-btn .el-icon {
    font-size: 16px;
  }
  
  .puzzle-tabs {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--shadow-base);
  }
  
  .action-btn {
    padding: 8px 20px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* 标签样式 */
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: var(--border-color);
  }
  
  :deep(.el-tabs__item) {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-regular);
    padding: 0 24px;
  }
  
  :deep(.el-tabs__item.is-active) {
    color: var(--primary-color);
  }
  
  :deep(.el-tabs__active-bar) {
    height: 3px;
    border-radius: 3px;
    background-color: var(--primary-color);
  }
  
  /* 动端适配 */
  @media (max-width: 768px) {
    .home {
      padding: 0 16px;
    }
    
    .page-header h1 {
      font-size: 2rem;
    }
    
    .puzzle-actions {
      flex-wrap: wrap;
    }
    
    .puzzle-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  :deep(.el-tabs__content) {
    background: transparent;
  }
  
  :deep(.el-tab-pane) {
    background: transparent;
  }
  
  :deep(.el-tabs__nav-wrap) {
    background: transparent;
  }
  
  :deep(.el-tabs__nav-scroll) {
    background: transparent;
  }
  </style>
  

import { defineStore } from 'pinia'
import { aiService } from '../services/aiService'
import { dbService } from '../services/dbService'

export const useGameStore = defineStore('game', {
  state: () => ({
    puzzles: [],
    currentPuzzle: null,
    questions: [],
    isLoading: false,
    hints: [],
    hintCount: 0,
    maxHints: 3,
    showAnswerInput: false,
    lastAnswerFeedback: null
  }),
  
  actions: {
    async initPuzzles() {
      try {
        const response = await fetch('/example_puzzles.json')
        if (!response.ok) {
          throw new Error('Failed to fetch puzzles')
        }
        const puzzles = await response.json()
        this.puzzles = puzzles.map((puzzle, index) => ({
          ...puzzle,
          id: index + 1
        }))
      } catch (error) {
        console.error('初始化题库失败:', error)
        this.puzzles = [{
          id: 1,
          title: '神秘的红房间',
          difficulty: 'easy',
          type: 'classic',
          hint: '一个男人走进红色的房间后死亡了',
          truth: '这是一个暗房，男人在冲洗照片时意外打翻了化学药品导致中毒身亡',
          answered: false,
          keywords: ['暗房', '照片', '化学药品', '中毒']
        }]
      }
    },
    
    async importPuzzles(file) {
      try {
        const text = await file.text()
        const puzzles = JSON.parse(text)
        await dbService.importPuzzles(puzzles)
        await this.initPuzzles() // 重新加载题库
        return true
      } catch (error) {
        console.error('导入题库失败:', error)
        throw error
      }
    },
    
    async exportPuzzles() {
      try {
        const puzzles = await dbService.exportPuzzles()
        const blob = new Blob([JSON.stringify(puzzles, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'turtle_soup_puzzles.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('导出题库失败:', error)
        throw error
      }
    },
    
    selectPuzzle(id) {
      this.currentPuzzle = this.puzzles.find(p => p.id === id)
      this.questions = []
      this.hints = []
      this.hintCount = 0
    },
    
    async askQuestion(question) {
      if (!this.currentPuzzle) return
      
      this.isLoading = true
      try {
        // 首先尝试使用 AI 判断
        const answer = await aiService.getAnswer(question, this.currentPuzzle)
        this.questions.push({ 
          question, 
          answer,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        // AI 服务失败时，使用关键词匹配作为备选方案
        const answer = this.getAnswerByKeywords(question)
        this.questions.push({ 
          question, 
          answer,
          timestamp: new Date().toISOString()
        })
      } finally {
        this.isLoading = false
      }
    },
    
    getAnswerByKeywords(question) {
      if (!this.currentPuzzle) return '不相关'
      
      const questionLower = question.toLowerCase()
      const { keywords, truth } = this.currentPuzzle
      
      // 检查是否包含关键词
      const hasKeyword = keywords.some(keyword => 
        questionLower.includes(keyword.toLowerCase())
      )
      
      if (!hasKeyword) return '不相关'
      
      // 检查问题是否与真相相符
      const truthLower = truth.toLowerCase()
      const isPositive = keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase()
        return questionLower.includes(keywordLower) && 
               truthLower.includes(keywordLower)
      })
      
      return isPositive ? '是' : '否'
    },
    
    giveUp() {
      if (this.currentPuzzle) {
        this.currentPuzzle.answered = true
      }
    },
    
    async createPuzzle(puzzle) {
      const newPuzzle = {
        ...puzzle,
        answered: false
      }
      const id = await dbService.addPuzzle(newPuzzle)
      newPuzzle.id = id
      this.puzzles = await dbService.getAllPuzzles()
      return newPuzzle
    },
    
    async getHint() {
      if (this.hintCount >= this.maxHints) return null
      
      try {
        const response = await aiService.getHint(this.currentPuzzle)
        this.hints.push(response)
        this.hintCount++
        return response
      } catch (error) {
        console.error('获取提示失败:', error)
        return null
      }
    },
    
    async verifyAnswer(answer) {
      if (!this.currentPuzzle) return
      
      try {
        const result = await aiService.verifyAnswer(answer, this.currentPuzzle)
        this.lastAnswerFeedback = result.feedback
        
        if (result.isCorrect) {
          this.currentPuzzle.answered = true
        }
        
        return result
      } catch (error) {
        console.error('验证答案失败:', error)
        throw error
      }
    },
    
    toggleAnswerInput() {
      this.showAnswerInput = !this.showAnswerInput
      this.lastAnswerFeedback = null
    }
  }
}) 
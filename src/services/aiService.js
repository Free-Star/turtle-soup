import axios from 'axios'

const API_KEY = import.meta.env.VITE_ARK_API_KEY
const MODEL_ID = import.meta.env.VITE_ARK_MODEL_ID
const API_URL = '/api/api/v3/chat/completions'

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器，处理可能的错误
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API 请求错误:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const aiService = {
  async getAnswer(question, puzzle) {
    try {
      const prompt = `
        你现在是一个海龟汤游戏的裁判。
        故事背景是：${puzzle.hint}
        完整真相是：${puzzle.truth}
        
        玩家提问：${question}
        
        请根据问题内容，只回答"是"、"否"或"不相关"。
        回答规则：
        1. 如果问题的答案符合真相，回答"是"
        2. 如果问题的答案与真相相反，回答"否"
        3. 如果问题与解开谜题无关，回答"不相关"
        
        请只回答这三个词中的一个，不要包含任何其他内容。
      `

      const response = await axiosInstance.post('', {
        model: MODEL_ID,
        messages: [
          {
            role: 'system',
            content: '你是一个海龟汤游戏的裁判，只能回答"是"、"否"或"不相关"。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const answer = response.data.choices[0].message.content.trim()
      return ['是', '否', '不相关'].includes(answer) ? answer : '不相关'
    } catch (error) {
      console.error('AI 服务错误:', error)
      if (error.message === 'Network Error') {
        return this.getAnswerByKeywords(question, puzzle)
      } else {
        return '不相关'
      }
    }
  },
  getAnswerByKeywords(question, puzzle) {
    const questionLower = question.toLowerCase()
    const { keywords, truth } = puzzle
    
    const hasKeyword = keywords.some(keyword => 
      questionLower.includes(keyword.toLowerCase())
    )
    
    if (!hasKeyword) return '不相关'
    
    const truthLower = truth.toLowerCase()
    const isPositive = keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase()
      return questionLower.includes(keywordLower) && 
             truthLower.includes(keywordLower)
    })
    
    return isPositive ? '是' : '否'
  },
  async getHint(puzzle) {
    try {
      const prompt = `
        基于以下故事：
        提示：${puzzle.hint}
        真相：${puzzle.truth}
        
        请生成一个有用的提示，帮助玩家思考。这个提示：
        1. 不能直接透露关键点，更不能透露真相
        2. 应该引导玩家思考正确的方向
        3. 提示要简短，不超过10个字
        
        请直接返回提示内容，不要包含任何其他文字。
      `

      const response = await axiosInstance.post('', {
        model: MODEL_ID,
        messages: [
          {
            role: 'system',
            content: '你是一个海龟汤游戏的提示生成器。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('获取提示失败:', error)
      if (error.message === 'Network Error') {
        return '仔细思考故事中的关键细节...'
      }
      throw error
    }
  },
  async verifyAnswer(userAnswer, puzzle) {
    try {
      const prompt = `
        作为海龟汤游戏的裁判，请判断玩家的答案是否正确。
        
        故事真相：${puzzle.truth}
        玩家答案：${userAnswer}
        
        判断规则：
        1. 如果玩家理解了核心事实（即使表述不完全一样），一定要抓住关键点，就是正确的
        2. 如果玩家只说对了一部分，或者含糊不清或理解错误，就是错误的
        
        请只回复：
        - 如果正确，返回："正确！" 加上一句简短的评价
        - 如果错误，返回："继续加油！"并附上一句鼓励的话，不要透露提示和真相！
      `

      const response = await axiosInstance.post('', {
        model: MODEL_ID,
        messages: [
          {
            role: 'system',
            content: '你是一个海龟汤游戏的裁判。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      return {
        isCorrect: response.data.choices[0].message.content.startsWith('正确'),
        feedback: response.data.choices[0].message.content
      }
    } catch (error) {
      console.error('验证答案失败:', error)
      if (error.message === 'Network Error') {
        return {
          isCorrect: false,
          feedback: '网络连接失败，请稍后重试。'
        }
      }
      throw error
    }
  }
} 
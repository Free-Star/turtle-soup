const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()

app.use(cors())
app.use(express.json())

const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'

app.post('/chat', async (req, res) => {
  try {
    const response = await axios.post(API_URL, req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.ARK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error('API 错误:', error.response?.data || error.message)
    res.status(500).json({ error: '服务器错误' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
}) 
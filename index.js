require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // 确保已经安装了cors包
const path = require('path');

const app = express();
const port = 3000;

app.use(cors()); // 允许跨域请求
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const apiClient = axios.create({
  baseURL: 'https://api.openai.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

let conversation = [];

async function chatWithGPT(message) {
  conversation.push({ role: "user", content: message });
  try {
    const response = await apiClient.post('/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: conversation,
    });
    const reply = response.data.choices[0].message.content.trim();
    conversation.push({ role: "assistant", content: reply });
    return reply;
  } catch (error) {
    throw error;
  }
}

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const chatGPTResponse = await chatWithGPT(userMessage);
    res.json({ message: chatGPTResponse });
  } catch (error) {
    let errorMessage = 'Unable to process your request at the moment.';
    if (error.response) {
      console.error('Error:', error.response.status, error.response.data);
      errorMessage += ` OpenAI Error: ${error.response.data.error.message}`;
    } else if (error.request) {
      console.error('Error: No response received', error.request);
      errorMessage += ' No response received from OpenAI.';
    } else {
      console.error('Error:', error.message);
      errorMessage += ` Request setup failed: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage });
  }
});

// 为根 URL 提供一个 GET 路由，用于发送前端页面
app.get('/', (req, res) => {
  console.log("11111",req)
  console.log("11111")
  res.sendFile(__dirname + '/public/index.html'); // 确保路径正确指向您的 HTML 文件
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// 在 server.js 中
app.post('/feedback', (req, res) => {
  const feedback = req.body.feedback;
  // 处理反馈，比如保存到数据库
  console.log('Feedback received:', feedback);
  // 发送响应
  res.status(200).send('Feedback received');
});

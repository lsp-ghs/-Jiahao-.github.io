require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


const apiClient = axios.create({
  baseURL: 'https://u164241-a129-a540ed74.westb.seetacloud.com:8443/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});

let conversation = [];

async function chatWithGPT(message) {
  conversation.push({ role: "user", content: message });
  try {
   
    const response = await apiClient.post('/chat/completions', {
      model: "qwen",
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
      errorMessage += ` Error: ${error.response.data.error.message}`;
    } else if (error.request) {
      console.error('Error: No response received', error.request);
      errorMessage += ' No response received.';
    } else {
      console.error('Error:', error.message);
      errorMessage += ` Request setup failed: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post('/feedback', (req, res) => {
  const feedback = req.body.feedback;
  console.log('Feedback received:', feedback);
  res.status(200).send('Feedback received');
});


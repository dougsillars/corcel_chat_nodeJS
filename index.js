const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to receive messages from the client
app.post('/sendMessage', async (req, res) => {
  const conversationHistory = req.body.messages;
  console.log(conversationHistory);
  // Set up the options for the Corcel API request
  const options = {
    method: 'POST',
    url: 'https://api.corcel.io/v1/text/cortext/chat',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: process.env.CORCEL_KEY // Replace with your API key
    },
    data: {
      model: 'cortext-ultra',
      stream: false,
      top_p: 1,
      temperature: 0.0001,
      max_tokens: 4096,
      messages:  conversationHistory
    }
  };

  try {
   // Send the conversation history to the Corcel API and get the response
   const response = await axios.request(options);
   // Extract the 'content' from the response
   const content = response.data[0].choices[0].delta.content;
   // Send the 'content' back to the client
   res.json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your message.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
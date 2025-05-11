require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post('/send-location', async (req, res) => {
  const { latitude, longitude, image } = req.body;

  if (!latitude || !longitude || !image) {
    return res.status(400).json({ error: 'Missing location or image data' });
  }

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`, {
      chat_id: CHAT_ID,
      latitude,
      longitude,
    });

    // Convert base64 to buffer (strip off "data:image/png;base64," prefix)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Send photo
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('caption', `📍 Location: ${latitude}, ${longitude}`);
    formData.append('photo', imageBuffer, {
      filename: 'photo.png',
      contentType: 'image/png',
    });

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, formData, {
      headers: formData.getHeaders(),
    });

    res.json({ message: 'Location and photo sent to Telegram' });
  } catch (error) {
    console.error('Error sending to Telegram:', error.message);
    res.status(500).json({ error: 'Failed to send to Telegram' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

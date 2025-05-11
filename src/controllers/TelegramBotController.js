const axios = require('axios');
const FormData = require('form-data');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

module.exports = {
  async store(req, res) {
    const { latitude, longitude, image } = req.body;

    if (!latitude || !longitude || !image) {
      return res.status(400).json({ error: "Missing location or image data" });
    }

    try {
      // Send location to Telegram
      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`,
        {
          chat_id: CHAT_ID,
          latitude,
          longitude,
        }
      );

      // Convert base64 image to buffer (strip off "data:image/png;base64," prefix)
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Prepare form data to send the photo (no need to save it locally)
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("caption", `Location: ${latitude}, ${longitude}`);
      formData.append("photo", imageBuffer, {
        filename: "photo.png",
        contentType: "image/png",
      });

      // Send the image to Telegram
      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      res.json({ message: "OK" });
    } catch (error) {
      console.error("Error sending to Telegram:", error.message);
      res.status(500).json({ error: "Failed to send to Telegram" });
    }
  },
};

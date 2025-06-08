const axios = require('axios');
const { cmd } = require('../command');
const config = require("../config");

// AI Chatbot - Kaizenji GPT4o-mini
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    // Prevent bot from responding to itself or commands
    if (!body || body.startsWith("!") || m.key.fromMe) return;

    // Optional: Only respond in private chats
    // if (isGroup) return;

    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt4o-mini?ask=${encodeURIComponent(body)}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`;

    const { data } = await axios.get(apiUrl);

    if (data && data.response) {
      await conn.sendMessage(from, {
        text: data.response
      }, { quoted: m });
    } else {
      reply("⚠️ No response from AI.");
    }

  } catch (err) {
    console.error("AI Chatbot Error:", err.message);
    reply("❌ Failed to get a response from AI.");
  }
});

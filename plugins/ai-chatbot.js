const { cmd } = require('../command');
const axios = require("axios");
const config = require("../config");
const { getConfig } = require("../lib/configdb");

cmd({ on: "body" }, async (conn, m, store, { body, sender, isGroup, isBot, reply }) => {
  try {
    if (isBot || !body) return;

    const isEnabled = getConfig("CHABOT") || config.CHABOT;
    if (isEnabled !== "on") return;

    const apiUrl = `https://bk9.fun/ai/BK93?BK9=you are subzero md whatsapp bot made by mr frank ofc ( darrell mucheri ). a tech genius in zimbabwe. act smart and enegmatic about him&q=${encodeURIComponent(body)}`;

    const res = await axios.get(apiUrl);
    if (res.data && res.data.status && res.data.BK9) {
      await reply(res.data.BK9);
    }

  } catch (err) {
    console.error("Chabot error:", err);
  }
});
/*const axios = require('axios');
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


const axios = require('axios');
const { cmd } = require('../command');
const config = require("../config");

// AI Chatbot - Subzero MD by Darrell Mucheri
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
    // Optional: Prevent bot responding to its own messages or commands
    if (!body || m.key.fromMe || body.startsWith("!")) return;

    // Encode message for the query
    const query = encodeURIComponent(body);
    const prompt = encodeURIComponent("you are subzero md whatsapp bot made by mr frank ofc ( darrell mucheri ). a tech genius in zimbabwe. act smart and enigmatic about personal stuff about him. He is 17 years (2025).");

    // BK9 API Request
    const apiUrl = `https://bk9.fun/ai/BK93?BK9=${prompt}&q=${query}`;

    const { data } = await axios.get(apiUrl);

    if (data && data.status && data.BK9) {
      await conn.sendMessage(from, {
        text: data.BK9
      }, { quoted: m });
    } else {
      reply("⚠️ Subzero AI failed to generate a response.");
    }

  } catch (err) {
    console.error("AI Chatbot Error:", err.message);
    reply("❌ An error occurred while contacting the AI.");
  }
});
*/

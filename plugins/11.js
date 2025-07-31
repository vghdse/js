const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);


cmd({
  pattern: "menux",
  desc: "Show button menu",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from, prefix }) => {
  
  const picUrl = "https://files.catbox.moe/xmldwy.jpg
  
  // Create buttons array
  const buttons = [
    {
      buttonId: `${prefix}ping`,
      buttonText: { displayText: 'PING' },
      type: 1
    },
    {
      buttonId: `${prefix}alive`,
      buttonText: { displayText: 'ALIVE' },
      type: 1
    },
    {
      buttonId: `${prefix}showmenu all`,
      buttonText: { displayText: '📋 ALL COMMANDS' },
      type: 1
    }
  ];

  // Send message with buttons
  await conn.sendMessage(from, {
    image: { url: picUrl },
    caption: "📋 *Button Main Menu*\n\nSelect an option below:",
    footer: "SUBZERO-MD Menu System",
    buttons: buttons,
    headerType: 4
  }, { quoted: m });
});

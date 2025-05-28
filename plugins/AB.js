const { cmd } = require('../command');

cmd({
  pattern: 'buttonmenu',
  alias: ['btnmenu', 'bmenu'],
  desc: 'Send interactive button menu',
  category: 'utility',
  react: '🧭',
  filename: __filename,
}, async (conn, m, { args }) => {
  const buttons = [
    { buttonId: 'id1', buttonText: { displayText: '🔍 Search' }, type: 1 },
    { buttonId: 'id2', buttonText: { displayText: '🎵 Play Music' }, type: 1 },
    { buttonId: 'id3', buttonText: { displayText: '📁 My Files' }, type: 1 }
  ];

  const buttonMessage = {
    text: "👋 Welcome to SubZero Bot\n\nChoose an option below:",
    footer: '🤖 Powered by SubZero AI',
    buttons,
    headerType: 1,
    viewOnce: true
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
});

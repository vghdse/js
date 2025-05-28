/*const { cmd } = require('../command');

cmd({
  pattern: 'buttonmenu',
  alias: ['btnmenu'],
  desc: 'Send an interactive button message',
  category: 'utility',
  react: '🧭',
  filename: __filename,
}, async (conn, m) => {
  const buttons = [
    { buttonId: 'option_1', buttonText: { displayText: '🔊 Normal Audio' }, type: 1 },
    { buttonId: 'option_2', buttonText: { displayText: '📁 YTMP3 Document' }, type: 1 }
  ];

  const buttonMessage = {
    text: '🎧 *Lily - Alan Walker*\n\nChoose an option:',
    footer: 'Reply by tapping a button below.',
    buttons,
    headerType: 1,
    viewOnce: true
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
});
*/

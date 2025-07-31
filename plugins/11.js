const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);


cmd({
  pattern: "showmenu",
  hidden: true
}, async (conn, mek, m, { args, from }) => {
  const category = args[0];
  const cmdsInCat = commands.filter(cmd => cmd.category === category);

  if (!cmdsInCat.length) {
    return conn.sendMessage(from, { text: `❌ No commands found in '${category}'` }, { quoted: m });
  }

  let text = `📂 *Commands in ${category.toUpperCase()}*\n\n`;

  for (const cmd of cmdsInCat) {
    text += `➤ ${cmd.pattern}\n`;
  }

  await conn.sendMessage(from, { text }, { quoted: m });
});

cmd({
  pattern: "btn",
  desc: "Show smart button menu",
  category: "tools",
  filename: __filename
}, async (conn, mek, m, { from }) => {

  const picUrl = "https://i.postimg.cc/G3k8H6gC/IMG-20250603-WA0017.jpg";

  const filtered = commands.filter(cmd =>
    !["menu", "xbot", "misc"].includes(cmd.category)
  );

  const categories = [...new Set(filtered.map(cmd => cmd.category))];

  const sections = categories.map((cat, index) => {
    const section = {
      rows: [
        {
          header: 'Menu',
          title: cat.charAt(0).toUpperCase() + cat.slice(1),
          description: `This for ${cat.charAt(0).toLowerCase() + cat.slice(1)} commands`,
          buttonid: `${prefix}showmenu ${categories}`
        }
      ]
    };

    if (index === 0) {
      section.title = "Select a menu";
      section.highlight_label = '𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐦𝐞𝐧𝐮';
    }

    return section;
  });

  const buttonText = m.text?.toLowerCase();
  if (buttonText === `${prefix}Ping` || buttonText === `${prefix}ping`) {
    const start = new Date().getTime();

    const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
    const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

    const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    while (textEmoji === reactionEmoji) {
      textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    }

    await conn.sendMessage(from, {
      react: { text: textEmoji, key: mek.key }
    });

    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    const text = `> *XBOT-MD SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

    return await conn.sendMessage(from, {
      text: text
    }, { quoted: mek });
  }

  if (buttonText === "Alive" || buttonText === `${prefix}alive`) {
    return await conn.sendMessage(from, {
      text: "*✅ I am alive and ready to serve you!*"
    }, { quoted: mek });
  }

  await conn.sendMessage(from, {
    image: { url: picUrl },
    caption: "📋 *Main Menu*\n\nSelect a category from the menu below.",
    footer: "> New menu - 2025",
    buttons: [
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
        buttonId: `${prefix}flow-menu`,
        buttonText: { displayText: '📋 Show Categories' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Select Menu',
            sections: sections
          })
        }
      }
    ],
    headerType: 4,
    viewOnce: true
  }, { quoted: m });
});

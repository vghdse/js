const { cmd } = require("../command");
const axios = require("axios");

// ==============================================
// TEXT BUTTON MESSAGE EXAMPLE
// ==============================================
cmd({
  pattern: "buttons",
  desc: "Example of interactive buttons with text",
  category: "utility",
  react: "🛎️"
}, async (conn, mek, m, { from }) => {
  const buttons = [
    { 
      buttonId: 'help', 
      buttonText: { displayText: '📚 Help' }, 
      type: 1 
    },
    { 
      buttonId: 'download', 
      buttonText: { displayText: '⬇️ Download Menu' }, 
      type: 1 
    },
    { 
      buttonId: 'owner', 
      buttonText: { displayText: '👑 Owner' }, 
      type: 1 
    }
  ];

  const buttonMessage = {
    text: `*${config.BOT_NAME} Main Menu*\n\nSelect an option below:`,
    footer: config.FOOTER,
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(from, buttonMessage, { quoted: mek });
});

// ==============================================
// IMAGE BUTTON MESSAGE EXAMPLE
// ==============================================
cmd({
  pattern: "imgbuttons",
  desc: "Example of interactive buttons with image",
  category: "utility",
  react: "🖼️"
}, async (conn, mek, m, { from }) => {
  const buttons = [
    { 
      buttonId: 'menu1', 
      buttonText: { displayText: '🍔 Food Menu' }, 
      type: 1 
    },
    { 
      buttonId: 'menu2', 
      buttonText: { displayText: '🍹 Drink Menu' }, 
      type: 1 
    }
  ];

  const buttonMessage = {
    image: { 
      url: "https://files.giftedtech.web.id/image/dYYcddesktop-wallpaper-paperswallpaper.jpeg" // Replace with your image URL
    },
    caption: "*Welcome to Our Restaurant!*\nWhat would you like to see?",
    footer: "Tap a button below ↓",
    buttons: buttons,
    headerType: 4 // For image header
  };

  await conn.sendMessage(from, buttonMessage, { quoted: mek });
});


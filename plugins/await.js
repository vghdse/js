const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "testx",
  desc: "Check bot online or not.",
  category: "main",
  react: "👋",
  filename: __filename
},
async (conn, mek, m, {
  from, pushname, reply
}) => {
  try {
    const subzero = {
      key: {
        remoteJid: "120363025249792xxx@g.us", // fake group ID
        fromMe: false,
        id: "ABCD1234", // random id
        participant: "0@s.whatsapp.net"
      },
      message: {
        groupInviteMessage: {
          groupJid: "120363025249792xxx@g.us",
          inviteCode: "AbcdEFG1234",
          groupName: "Smart Automation", // will show after WhatsApp Business
          caption: "Powering Smart Automation", // ← This is your visible quote
          jpegThumbnail: Buffer.from([]), // blank or add a thumbnail buffer
        }
      }
    };

    const msg = `*👋 Hello ${pushname}!*`;

    await conn.sendMessage(from, {
      text: msg
    }, { quoted: subzero });

  } catch (e) {
    console.log(e);
    reply(`${e}`);
  }
});

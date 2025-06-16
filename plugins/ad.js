const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "fortune",
    alias: ["cookie", "prophecy", "luck"],
    desc: "Gives you a random digital fortune cookie 🥠",
    category: "fun",
    react: "🥠",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Send intro message
        const thinking = await conn.sendMessage(from, {
            text: "Cracking open your fortune cookie... 🥠🔮"
        }, { quoted: mek });

        await sleep(1500); // Dramatic pause

        // Fortune list
        const fortunes = [
            "💡 *You will debug a bug that was never yours.*",
            "🎯 *Success is just one more commit away.*",
            "🤖 *AI will replace 38% of your work, but not your charm.*",
            "📈 *Growth comes to those who read error logs.*",
            "🍀 *Lucky number: " + Math.floor(Math.random() * 100) + "*",
            "⚠️ *Beware of off-by-one errors today.*",
            "🧠 *Your brain needs rest, not more coffee.*",
            "🌟 *You are the bug AND the feature.*",
            "🔐 *Trust, but verify.*",
            "📦 *Update dependencies, but fear semver.*"
        ];

        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

        // Edit message to show the fortune
        await conn.relayMessage(
            from,
            {
                protocolMessage: {
                    key: thinking.key,
                    type: 14,
                    editedMessage: {
                        conversation: fortune,
                    },
                },
            },
            {}
        );

    } catch (e) {
        console.error(e);
        reply(`❌ *Fortune machine jammed!* ${e.message}`);
    }
});




cmd({
  'pattern': "channelreact2",
  'alias': ["chr2"],
  'desc': "React to a message in a WhatsApp channel",
  'category': "channel",
  'filename': __filename
}, async (_0x1019cd, _0xb67458, _0x4ac03b, {
  from: _0x2187c3,
  l: _0x1e9407,
  prefix: _0x665b07,
  quoted: _0x3c3cbd,
  body: _0x4a5f2a,
  isCmd: _0x58fc24,
  command: _0x44916a,
  args: _0x1ffc1e,
  q: _0x456e64,
  isGroup: _0x5919a5,
  sender: _0x4ba8cd,
  senderNumber: _0x1cc2e5,
  botNumber2: _0x56a37c,
  botNumber: _0x736f9e,
  pushname: _0x29a3d4,
  isMe: _0x341bbd,
  isOwner: _0x38359b,
  groupMetadata: _0x38ed03,
  groupName: _0x24a9c2,
  participants: _0x4e2fd7,
  groupAdmins: _0x44f21b,
  isBotAdmins: _0x2a63f0,
  isAdmins: _0x5dbb40,
  reply: _0x8d5531
}) => {
  try {
    if (!_0x38359b) {
      return _0x8d5531("*❌ You are not the owner!*");
    }
    if (!_0x456e64.includes(',')) {
      return _0x8d5531("*❌ Please Give Channel Post Link And Emoji*\n\nExample: .channelreact <channel_link>,<reaction>");
    }
    let _0x3a8564 = _0x456e64.split(',')[0x0].trim();
    let _0x255ee7 = _0x456e64.split(',')[0x1].trim();
    const _0x3bb7a6 = _0x3a8564.split('/')[0x4];
    const _0x30c73c = _0x3a8564.split('/')[0x5];
    const _0x517c80 = await _0x1019cd.newsletterMetadata("invite", _0x3bb7a6);
    await _0x1019cd.newsletterReactMessage(_0x517c80.id, _0x30c73c, _0x255ee7);
    await _0x8d5531("*✅ Reaction Send Successfully*");
  } catch (_0x4a6628) {
    console.log(_0x4a6628);
    _0x8d5531("❌ *I Couldn't find anything. Please try again later...*");
    await _0x1019cd.sendMessage(_0x736f9e + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x4a6628
    }, {
      'quoted': _0xb67458
    });
  }
});
cmd({
  'pattern': "followchannel",
  'desc': "WhatsApp channel follow.",
  'category': "channel",
  'filename': __filename
}, async (_0x44ac1d, _0xb60578, _0x11c281, {
  from: _0x45cbc9,
  l: _0x340958,
  prefix: _0x5ba4ce,
  quoted: _0x3553c7,
  body: _0x2443a6,
  isCmd: _0x490dc5,
  command: _0x3676a8,
  args: _0x3e8f6d,
  q: _0x46cc6d,
  isGroup: _0x5b57ac,
  sender: _0x53c809,
  senderNumber: _0x545f17,
  botNumber2: _0x121c24,
  botNumber: _0x2ee39e,
  pushname: _0xc67267,
  isMe: _0x161aa7,
  isOwner: _0x47e092,
  groupMetadata: _0x2ed29b,
  groupName: _0x21d98c,
  participants: _0x57ec65,
  groupAdmins: _0x4be97e,
  isBotAdmins: _0x8f1344,
  isAdmins: _0x1664c7,
  reply: _0x3955ad
}) => {
  try {
    if (!_0x47e092) {
      return _0x3955ad("*❌ You are not the owner!*");
    }
    if (!_0x46cc6d) {
      return _0x3955ad("*❌ Please Give Channel Link*\n\nExample: .followchannel <channel_link>");
    }
    const _0x444bc8 = _0x46cc6d.split('/')[0x4];
    const _0xb5b05a = await _0x44ac1d.newsletterMetadata("invite", _0x444bc8);
    await _0x44ac1d.newsletterFollow(_0xb5b05a.id);
    await _0x3955ad("*✅ Channel Follow Successfully*");
  } catch (_0x2d0241) {
    console.log(_0x2d0241);
    _0x3955ad("❌ *I Couldn't find anything. Please try again later...*");
    await _0x44ac1d.sendMessage(_0x2ee39e + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x2d0241
    }, {
      'quoted': _0xb60578
    });
  }
});
cmd({
  'pattern': "unfollowchannel",
  'desc': "WhatsApp channel unfollow.",
  'category': "channel",
  'filename': __filename
}, async (_0x158fc6, _0x2a979d, _0x376691, {
  from: _0x35cff4,
  l: _0x3c133e,
  prefix: _0x2854d9,
  quoted: _0x29e640,
  body: _0x348ab5,
  isCmd: _0x2f99cc,
  command: _0x28b05f,
  args: _0x483ca8,
  q: _0x1e12fa,
  isGroup: _0x23061a,
  sender: _0x2c8949,
  senderNumber: _0x37e818,
  botNumber2: _0x50a1bc,
  botNumber: _0x8de569,
  pushname: _0x59319b,
  isMe: _0x297029,
  isOwner: _0x4615d3,
  groupMetadata: _0x40515d,
  groupName: _0x592dc1,
  participants: _0x5241d5,
  groupAdmins: _0x52883e,
  isBotAdmins: _0x32fbea,
  isAdmins: _0x51761e,
  reply: _0x317e04
}) => {
  try {
    if (!_0x4615d3) {
      return _0x317e04("*❌ You are not the owner!*");
    }
    if (!_0x1e12fa) {
      return _0x317e04("*❌ Please Give Channel Link*\n\nExample: .unfollowchannel <channel_link>");
    }
    const _0x31b2e5 = _0x1e12fa.split('/')[0x4];
    const _0xf94df5 = await _0x158fc6.newsletterMetadata('invite', _0x31b2e5);
    await _0x158fc6.newsletterUnfollow(_0xf94df5.id);
    await _0x317e04("*✅ Channel Unfollow Successfully*");
  } catch (_0xb1e7bb) {
    console.log(_0xb1e7bb);
    _0x317e04("❌ *I Couldn't find anything. Please try again later...*");
    await _0x158fc6.sendMessage(_0x8de569 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0xb1e7bb
    }, {
      'quoted': _0x2a979d
    });
  }
});
cmd({
  'pattern': "mutechannel",
  'desc': "WhatsApp channel mute.",
  'category': "channel",
  'filename': __filename
}, async (_0x301fb6, _0x33c5af, _0x5c7568, {
  from: _0x3fca18,
  l: _0xa82724,
  prefix: _0x5eced2,
  quoted: _0x396cdb,
  body: _0x5c96a7,
  isCmd: _0x3a2cb2,
  command: _0x3f7cae,
  args: _0x3d9381,
  q: _0x13dc9f,
  isGroup: _0x57c397,
  sender: _0x2c2908,
  senderNumber: _0x3aa84,
  botNumber2: _0x77a1c1,
  botNumber: _0x4e2e98,
  pushname: _0x8f4353,
  isMe: _0x442e1b,
  isOwner: _0x7b0afd,
  groupMetadata: _0x2f4b0c,
  groupName: _0x3bad07,
  participants: _0x2259c1,
  groupAdmins: _0x304bff,
  isBotAdmins: _0x4b06b9,
  isAdmins: _0x560adb,
  reply: _0x76266b
}) => {
  try {
    if (!_0x7b0afd) {
      return _0x76266b("*❌ You are not the owner!*");
    }
    if (!_0x13dc9f) {
      return _0x76266b("*❌ Please Give Channel Link*\n\nExample: .mutechannel <channel_link>");
    }
    const _0x1b0893 = _0x13dc9f.split('/')[0x4];
    const _0x1b492e = await _0x301fb6.newsletterMetadata("invite", _0x1b0893);
    await _0x301fb6.newsletterMute(_0x1b492e.id);
    await _0x76266b("*✅ Channel Mute Successfully*");
  } catch (_0x47f45f) {
    console.log(_0x47f45f);
    _0x76266b("❌ *I Couldn't find anything. Please try again later...*");
    await _0x301fb6.sendMessage(_0x4e2e98 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x47f45f
    }, {
      'quoted': _0x33c5af
    });
  }
});
cmd({
  'pattern': 'unmutechannel',
  'desc': "WhatsApp channel unmute.",
  'category': "channel",
  'filename': __filename
}, async (_0x38ba6c, _0x39b8e2, _0x54b934, {
  from: _0x3881b1,
  l: _0x267515,
  prefix: _0x1ae45d,
  quoted: _0x115ba6,
  body: _0x74cbed,
  isCmd: _0x1f1411,
  command: _0x5bd310,
  args: _0x2022ad,
  q: _0x241e4d,
  isGroup: _0x37832a,
  sender: _0x258163,
  senderNumber: _0xcce96c,
  botNumber2: _0x9f92d8,
  botNumber: _0x2047a3,
  pushname: _0x2fc835,
  isMe: _0xeb86c,
  isOwner: _0x3551b0,
  groupMetadata: _0x599ecf,
  groupName: _0x274616,
  participants: _0x156111,
  groupAdmins: _0x49becf,
  isBotAdmins: _0x2af394,
  isAdmins: _0xa4af0b,
  reply: _0x54d239
}) => {
  try {
    if (!_0x3551b0) {
      return _0x54d239("*❌ You are not the owner!*");
    }
    if (!_0x241e4d) {
      return _0x54d239("*❌ Please Give Channel Link*\n\nExample: .unmutechannel <channel_link>");
    }
    const _0x53a206 = _0x241e4d.split('/')[0x4];
    const _0x51351b = await _0x38ba6c.newsletterMetadata("invite", _0x53a206);
    await _0x38ba6c.newsletterUnmute(_0x51351b.id);
    await _0x54d239("*✅ Channel Unmute Successfully*");
  } catch (_0x2756a5) {
    console.log(_0x2756a5);
    _0x54d239("❌ *I Couldn't find anything. Please try again later...*");
    await _0x38ba6c.sendMessage(_0x2047a3 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x2756a5
    }, {
      'quoted': _0x39b8e2
    });
  }
});
cmd({
  'pattern': "deletechannel",
  'desc': "WhatsApp channel delete.",
  'category': "channel",
  'filename': __filename
}, async (_0x296d1c, _0x16585f, _0x1e3fa3, {
  from: _0x225d7b,
  l: _0x32dfe4,
  prefix: _0x3ce2c0,
  quoted: _0x4506d9,
  body: _0x65dd81,
  isCmd: _0x1cc783,
  command: _0x41d35a,
  args: _0x3b5583,
  q: _0x20df51,
  isGroup: _0x4554e3,
  sender: _0x240672,
  senderNumber: _0x420792,
  botNumber2: _0x4c656d,
  botNumber: _0x1090b6,
  pushname: _0x14dfdd,
  isMe: _0x11c065,
  isOwner: _0x786ce,
  groupMetadata: _0x63c844,
  groupName: _0x7bc76e,
  participants: _0x129f9c,
  groupAdmins: _0x40a25e,
  isBotAdmins: _0x5c9a9f,
  isAdmins: _0x44b5fa,
  reply: _0x2f38f4
}) => {
  try {
    if (!_0x786ce) {
      return _0x2f38f4("*❌ You are not the owner!*");
    }
    if (!_0x20df51) {
      return _0x2f38f4("*❌ Please Give Channel Link*\n\nExample: .deletechannel <channel_link>");
    }
    const _0x3f95ad = _0x20df51.split('/')[0x4];
    const _0x92a8d = await _0x296d1c.newsletterMetadata("invite", _0x3f95ad);
    await _0x296d1c.newsletterDelete(_0x92a8d.id);
    await _0x2f38f4("*✅ Channel Delete Successfully*");
  } catch (_0x1da37b) {
    console.log(_0x1da37b);
    _0x2f38f4("❌ *I Couldn't find anything. Please try again later...*");
    await _0x296d1c.sendMessage(_0x1090b6 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x1da37b
    }, {
      'quoted': _0x16585f
    });
  }
});
cmd({
  'pattern': 'deletechanneldp',
  'desc': "WhatsApp channel dp delete.",
  'category': "channel",
  'filename': __filename
}, async (_0x2e64eb, _0x12d3be, _0x4112cd, {
  from: _0xf5c7bd,
  l: _0x1c6649,
  prefix: _0x4f26a6,
  quoted: _0x34300b,
  body: _0x4dea55,
  isCmd: _0x16e52d,
  command: _0x56fb44,
  args: _0x38b321,
  q: _0x1110bb,
  isGroup: _0x37033b,
  sender: _0x33ed74,
  senderNumber: _0x33e2de,
  botNumber2: _0x31f302,
  botNumber: _0x382a4d,
  pushname: _0x31aa5b,
  isMe: _0x4b219f,
  isOwner: _0x3190f9,
  groupMetadata: _0x15b983,
  groupName: _0x1786df,
  participants: _0x10b998,
  groupAdmins: _0x1100a4,
  isBotAdmins: _0x4036ea,
  isAdmins: _0x15d2a2,
  reply: _0x56cb6f
}) => {
  try {
    if (!_0x3190f9) {
      return _0x56cb6f("*❌ You are not the owner!*");
    }
    if (!_0x1110bb) {
      return _0x56cb6f("*❌ Please Give Channel Link*\n\nExample: .deletechanneldp <channel_link>");
    }
    const _0x4f3699 = _0x1110bb.split('/')[0x4];
    const _0x2a1ecb = await _0x2e64eb.newsletterMetadata('invite', _0x4f3699);
    await _0x2e64eb.newsletterRemovePicture(_0x2a1ecb.id);
    await _0x56cb6f("*✅ Channel Dp Delete Successfully*");
  } catch (_0x371e23) {
    console.log(_0x371e23);
    _0x56cb6f("❌ *I Couldn't find anything. Please try again later...*");
    await _0x2e64eb.sendMessage(_0x382a4d + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x371e23
    }, {
      'quoted': _0x12d3be
    });
  }
});
cmd({
  'pattern': "setchannelname",
  'desc': "WhatsApp channel name update.",
  'category': 'channel',
  'filename': __filename
}, async (_0x16b4b2, _0x28f09e, _0x15eb48, {
  from: _0x45b47b,
  l: _0x5e9381,
  prefix: _0xd88b55,
  quoted: _0x4d1fd0,
  body: _0x4ee04e,
  isCmd: _0x1b9d6a,
  command: _0x37acb6,
  args: _0x4792e1,
  q: _0x3e3f19,
  isGroup: _0x1802be,
  sender: _0x48a4cb,
  senderNumber: _0x120b84,
  botNumber2: _0xc87b27,
  botNumber: _0xc64769,
  pushname: _0x5a41e9,
  isMe: _0x17e306,
  isOwner: _0xc4d820,
  groupMetadata: _0x2f38d7,
  groupName: _0x30a803,
  participants: _0xd9ced5,
  groupAdmins: _0x21da94,
  isBotAdmins: _0x3635f0,
  isAdmins: _0x488eb1,
  reply: _0x2d0609
}) => {
  try {
    if (!_0xc4d820) {
      return _0x2d0609("*❌ You are not the owner!*");
    }
    if (!_0x3e3f19) {
      return _0x2d0609("*❌ Please Give Channel Link*\n\nExample: .deletechannel <channel_link>,<update_name>");
    }
    const _0x560855 = _0x3e3f19.split(',')[0x0].trim();
    const _0x1e72a6 = _0x3e3f19.split(',')[0x1].trim();
    const _0x2efae1 = _0x560855.split('/')[0x4];
    const _0x211ff0 = await _0x16b4b2.newsletterMetadata("invite", _0x2efae1);
    await _0x16b4b2.newsletterUpdateName(_0x211ff0.id, _0x1e72a6);
    await _0x2d0609("*✅ Channel Name Update to:" + _0x1e72a6 + '*');
  } catch (_0x2995a1) {
    console.log(_0x2995a1);
    _0x2d0609("❌ *I Couldn't find anything. Please try again later...*");
    await _0x16b4b2.sendMessage(_0xc64769 + '@s.whatsapp.net', {
      'text': "❗ *Error Info:* " + _0x2995a1
    }, {
      'quoted': _0x28f09e
    });
  }
});
cmd({
  'pattern': 'setchanneldesc',
  'desc': "WhatsApp channel description update.",
  'category': "channel",
  'filename': __filename
}, async (_0x69c548, _0x479a45, _0x25ff44, {
  from: _0x2915ce,
  l: _0x695063,
  prefix: _0x5c0893,
  quoted: _0x4d6153,
  body: _0xbfe3ae,
  isCmd: _0x237869,
  command: _0x48e51f,
  args: _0x468459,
  q: _0xae6797,
  isGroup: _0x570094,
  sender: _0x5ca07c,
  senderNumber: _0x225da0,
  botNumber2: _0x213ad6,
  botNumber: _0x3c69c1,
  pushname: _0x318ba0,
  isMe: _0x568de0,
  isOwner: _0x28d976,
  groupMetadata: _0x249c02,
  groupName: _0x427396,
  participants: _0x32af8b,
  groupAdmins: _0x3158d4,
  isBotAdmins: _0x24d3e3,
  isAdmins: _0x2ea546,
  reply: _0x3ffe42
}) => {
  try {
    if (!_0x28d976) {
      return _0x3ffe42("*❌ You are not the owner!*");
    }
    if (!_0xae6797) {
      return _0x3ffe42("*❌ Please Give Channel Link*\n\nExample: .setchanneldesc <channel_link>,<update_desc>");
    }
    const _0x231b90 = _0xae6797.split(',')[0x0].trim();
    const _0x172cce = _0xae6797.split(',')[0x1].trim();
    const _0x2a9f7c = _0x231b90.split('/')[0x4];
    const _0x402ec3 = await _0x69c548.newsletterMetadata('invite', _0x2a9f7c);
    await _0x69c548.newsletterUpdateDescription(_0x402ec3.id, _0x172cce);
    await _0x3ffe42("*✅ Channel Description Update to:" + _0x172cce + '*');
  } catch (_0x500fbd) {
    console.log(_0x500fbd);
    _0x3ffe42("❌ *I Couldn't find anything. Please try again later...*");
    await _0x69c548.sendMessage(_0x3c69c1 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x500fbd
    }, {
      'quoted': _0x479a45
    });
  }

});




// BUTTONS
/*

cmd({
  'pattern': "mi",
  'react': '📂',
  'alias': ["panel", "cmd", 'list'],
  'desc': "Get Command Panel.",
  'category': "main",
  'filename': __filename
}, async (_0x1ff705, _0x5df799, _0x464b84, {
  from: _0x541d3a,
  l: _0x1f6803,
  prefix: _0x5426c4,
  quoted: _0x19673e,
  body: _0x19d9ca,
  isCmd: _0x3e238e,
  command: _0x4c257b,
  args: _0xdf2c4b,
  q: _0x42a127,
  isGroup: _0x344faa,
  sender: _0x420239,
  senderNumber: _0x4bf52a,
  botNumber2: _0xd70784,
  botNumber: _0x54f90e,
  pushname: _0x48951e,
  isMe: _0x3dc92c,
  isOwner: _0x2403ad,
  groupMetadata: _0x12725e,
  groupName: _0xc352fa,
  participants: _0x22cc90,
  groupAdmins: _0x2c7406,
  isBotAdmins: _0x2432b1,
  isAdmins: _0x10df37,
  reply: _0x27ed7d
}) => {
  try {
    const _0x2e535d = "*👋 Hello " + _0x48951e + "*\n\n━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐒𝐀𝐃𝐈𝐘𝐀 𝐌𝐃 𝐌𝐄𝐍𝐔 𝐋𝐈𝐒𝐓 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━";
    const _0x1565be = [{
      'title': '',
      'rows': [{
        'title': '1',
        'rowId': _0x5426c4 + "downmenu",
        'description': "DOWNLOAD MENU"
      }, {
        'title': '2',
        'rowId': _0x5426c4 + "channelmenu",
        'description': "CHANNEL MENU"
      }, {
        'title': '3',
        'rowId': _0x5426c4 + 'aimenu',
        'description': "AI MENU"
      }, {
        'title': '4',
        'rowId': _0x5426c4 + "mainmenu",
        'description': "MAIN MENU"
      }, {
        'title': '5',
        'rowId': _0x5426c4 + "ownermenu",
        'description': "OWNER MENU"
      }, {
        'title': '6',
        'rowId': _0x5426c4 + "groupmenu",
        'description': "GROUP MENU"
      }, {
        'title': '7',
        'rowId': _0x5426c4 + "searchmenu",
        'description': "SEARCH MENU"
      }, {
        'title': '8',
        'rowId': _0x5426c4 + "convertmenu",
        'description': "CONVERT MENU"
      }]
    }];
    const _0x64ad66 = {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': _0x2e535d,
      'buttonText': "*🔢 Reply below number,*",
      'footer': "> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*",
      'headerType': 0x4,
      'sections': _0x1565be
    };
    await _0x1ff705.replyBtn(_0x541d3a, _0x64ad66, _0x5df799);
  } catch (_0x19537d) {
    console.log(_0x19537d);
    _0x27ed7d("❌ *I Couldn't find anything. Please try again later...*");
    await _0x1ff705.sendMessage(_0x54f90e + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x19537d
    }, {
      'quoted': _0x5df799
    });
  }
});
cmd({
  'pattern': "downmenu",
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x51ab28, _0x1ad9fd, _0x43ba18, {
  from: _0x1cdd65,
  quoted: _0x3d7081,
  body: _0x4b6dfa,
  isCmd: _0x5cc36e,
  command: _0x6e9c4c,
  args: _0x39e95f,
  q: _0x5dec95,
  isGroup: _0x5a623b,
  sender: _0x4f1300,
  senderNumber: _0x2d4ff3,
  botNumber2: _0x10a24d,
  botNumber: _0x2057d2,
  pushname: _0x5eff30,
  isMe: _0x541236,
  isOwner: _0x58c769,
  groupMetadata: _0xa9ec6a,
  groupName: _0xc012f1,
  participants: _0x2c592b,
  groupAdmins: _0x58f355,
  isBotAdmins: _0x48f63f,
  isAdmins: _0x5f59e1,
  reply: _0x1ca890
}) => {
  try {
    let _0x5b352b = {
      'download': ''
    };
    for (let _0x1ccd20 = 0x0; _0x1ccd20 < commands.length; _0x1ccd20++) {
      if (commands[_0x1ccd20].pattern && !commands[_0x1ccd20].dontAddCommandList) {
        _0x5b352b[commands[_0x1ccd20].category] += "*📙➢ Command :* ." + commands[_0x1ccd20].pattern + "\n*💬➢ Desc :* " + commands[_0x1ccd20].desc + "\n\n";
      }
    }
    await _0x51ab28.sendMessage(_0x1cdd65, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x1ad9fd
    });
  } catch (_0x578be0) {
    console.log(_0x578be0);
    _0x1ca890("❌ *I Couldn't find anything. Please try again later...*");
    await _0x51ab28.sendMessage(_0x2057d2 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x578be0
    }, {
      'quoted': _0x1ad9fd
    });
  }
});
cmd({
  'pattern': 'channelmenu',
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x433d48, _0xf5664a, _0x5e3de0, {
  from: _0x1bd707,
  quoted: _0x44ddb9,
  body: _0x1713e5,
  isCmd: _0x313208,
  command: _0xd2851f,
  args: _0x20129d,
  q: _0x22f819,
  isGroup: _0x1c3c24,
  sender: _0x3643fe,
  senderNumber: _0x3b74d2,
  botNumber2: _0x4ca6b8,
  botNumber: _0x5053f1,
  pushname: _0x40ec44,
  isMe: _0x4eaf39,
  isOwner: _0x9e1c63,
  groupMetadata: _0x2cf69e,
  groupName: _0x15301f,
  participants: _0x19dc3a,
  groupAdmins: _0x2e2ef4,
  isBotAdmins: _0x48fa33,
  isAdmins: _0x467ec9,
  reply: _0x4da845
}) => {
  try {
    let _0x5a0f5f = {
      'channel': ''
    };
    for (let _0x34c092 = 0x0; _0x34c092 < commands.length; _0x34c092++) {
      if (commands[_0x34c092].pattern && !commands[_0x34c092].dontAddCommandList) {
        _0x5a0f5f[commands[_0x34c092].category] += "*📙➢ Command :* ." + commands[_0x34c092].pattern + "\n*💬➢ Desc :* " + commands[_0x34c092].desc + "\n\n";
      }
    }
    await _0x433d48.sendMessage(_0x1bd707, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐌𝐎𝐕𝐈𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0xf5664a
    });
  } catch (_0x5e5cf5) {
    console.log(_0x5e5cf5);
    _0x4da845("❌ *I Couldn't find anything. Please try again later...*");
    await _0x433d48.sendMessage(_0x5053f1 + '@s.whatsapp.net', {
      'text': "❗ *Error Info:* " + _0x5e5cf5
    }, {
      'quoted': _0xf5664a
    });
  }
});
cmd({
  'pattern': "aimenu",
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x118ea4, _0x400ec9, _0x6476a9, {
  from: _0x529eb2,
  quoted: _0x5e3f39,
  body: _0x4fb635,
  isCmd: _0x203638,
  command: _0x5b4bb1,
  args: _0x499c35,
  q: _0x4c6de5,
  isGroup: _0x4302c1,
  sender: _0x36be50,
  senderNumber: _0x35cad2,
  botNumber2: _0x13b857,
  botNumber: _0x5cfe2a,
  pushname: _0x1e3288,
  isMe: _0x2b5443,
  isOwner: _0x5a4ae4,
  groupMetadata: _0x310ecd,
  groupName: _0x4ae1ef,
  participants: _0x108fb8,
  groupAdmins: _0x1cc56e,
  isBotAdmins: _0x34c3b3,
  isAdmins: _0x44df6b,
  reply: _0x34fede
}) => {
  try {
    let _0x49f22a = {
      'ai': ''
    };
    for (let _0x342850 = 0x0; _0x342850 < commands.length; _0x342850++) {
      if (commands[_0x342850].pattern && !commands[_0x342850].dontAddCommandList) {
        _0x49f22a[commands[_0x342850].category] += "*📙➢ Command :* ." + commands[_0x342850].pattern + "\n*💬➢ Desc :* " + commands[_0x342850].desc + "\n\n";
      }
    }
    await _0x118ea4.sendMessage(_0x529eb2, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐀𝐈 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x400ec9
    });
  } catch (_0x1ac391) {
    console.log(_0x1ac391);
    _0x34fede("❌ *I Couldn't find anything. Please try again later...*");
    await _0x118ea4.sendMessage(_0x5cfe2a + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x1ac391
    }, {
      'quoted': _0x400ec9
    });
  }
});
cmd({
  'pattern': 'mainmenu',
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x598deb, _0x3ca1b8, _0x4e3b58, {
  from: _0x156c02,
  quoted: _0x326f2b,
  body: _0xd2d632,
  isCmd: _0x3e4d9e,
  command: _0x2134ac,
  args: _0xd88e55,
  q: _0xde478d,
  isGroup: _0x47e29c,
  sender: _0x3033d9,
  senderNumber: _0x2cf865,
  botNumber2: _0x1193c7,
  botNumber: _0x2ea991,
  pushname: _0x2c6609,
  isMe: _0x1f8221,
  isOwner: _0x111678,
  groupMetadata: _0x35e1f0,
  groupName: _0x535364,
  participants: _0x30df6c,
  groupAdmins: _0x519b2a,
  isBotAdmins: _0x258013,
  isAdmins: _0x4aa7e7,
  reply: _0x3c53ba
}) => {
  try {
    let _0x1298f4 = {
      'main': ''
    };
    for (let _0x3d27be = 0x0; _0x3d27be < commands.length; _0x3d27be++) {
      if (commands[_0x3d27be].pattern && !commands[_0x3d27be].dontAddCommandList) {
        _0x1298f4[commands[_0x3d27be].category] += "*📙➢ Command :* ." + commands[_0x3d27be].pattern + "\n*💬➢ Desc :* " + commands[_0x3d27be].desc + "\n\n";
      }
    }
    await _0x598deb.sendMessage(_0x156c02, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐌𝐀𝐈𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x3ca1b8
    });
  } catch (_0x261a54) {
    console.log(_0x261a54);
    _0x3c53ba("❌ *I Couldn't find anything. Please try again later...*");
    await _0x598deb.sendMessage(_0x2ea991 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x261a54
    }, {
      'quoted': _0x3ca1b8
    });
  }
});
cmd({
  'pattern': "ownermenu",
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x512468, _0x5262ac, _0x32e18f, {
  from: _0x46ebb0,
  quoted: _0x6b91e1,
  body: _0x11f0d2,
  isCmd: _0x15766f,
  command: _0x3ea323,
  args: _0x1c602e,
  q: _0x47fde0,
  isGroup: _0x3b3a4e,
  sender: _0x35109c,
  senderNumber: _0x57bac2,
  botNumber2: _0x50fd0f,
  botNumber: _0x420d10,
  pushname: _0x25dc5d,
  isMe: _0x3e7d17,
  isOwner: _0x4504f4,
  groupMetadata: _0x492b91,
  groupName: _0x390aae,
  participants: _0x2c5812,
  groupAdmins: _0x319345,
  isBotAdmins: _0x3e0589,
  isAdmins: _0x486bcd,
  reply: _0x45b4cc
}) => {
  try {
    let _0x566102 = {
      'owner': ''
    };
    for (let _0x164428 = 0x0; _0x164428 < commands.length; _0x164428++) {
      if (commands[_0x164428].pattern && !commands[_0x164428].dontAddCommandList) {
        _0x566102[commands[_0x164428].category] += "*📙➢ Command :* ." + commands[_0x164428].pattern + "\n*💬➢ Desc :* " + commands[_0x164428].desc + "\n\n";
      }
    }
    await _0x512468.sendMessage(_0x46ebb0, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐎𝐖𝐍𝐄𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x5262ac
    });
  } catch (_0x8093d5) {
    console.log(_0x8093d5);
    _0x45b4cc("❌ *I Couldn't find anything. Please try again later...*");
    await _0x512468.sendMessage(_0x420d10 + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x8093d5
    }, {
      'quoted': _0x5262ac
    });
  }
});
cmd({
  'pattern': 'groupmenu',
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x5d1a7d, _0x324c1b, _0x4704ae, {
  from: _0x572994,
  quoted: _0x17742c,
  body: _0x4fd4c1,
  isCmd: _0x459e32,
  command: _0x7775dc,
  args: _0x47b24c,
  q: _0x73a175,
  isGroup: _0x52893f,
  sender: _0x4822a7,
  senderNumber: _0x2dcccf,
  botNumber2: _0xa8af89,
  botNumber: _0x428e7b,
  pushname: _0x492340,
  isMe: _0x24d326,
  isOwner: _0x65009e,
  groupMetadata: _0x1e8f93,
  groupName: _0x591f72,
  participants: _0xd88364,
  groupAdmins: _0x2d092f,
  isBotAdmins: _0x11aa7d,
  isAdmins: _0x11463e,
  reply: _0x1852a9
}) => {
  try {
    let _0x1f2a76 = {
      'group': ''
    };
    for (let _0x1a665d = 0x0; _0x1a665d < commands.length; _0x1a665d++) {
      if (commands[_0x1a665d].pattern && !commands[_0x1a665d].dontAddCommandList) {
        _0x1f2a76[commands[_0x1a665d].category] += "*📙➢ Command :* ." + commands[_0x1a665d].pattern + "\n*💬➢ Desc :* " + commands[_0x1a665d].desc + "\n\n";
      }
    }
    await _0x5d1a7d.sendMessage(_0x572994, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐆𝐑𝐎𝐔𝐏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x324c1b
    });
  } catch (_0x1a9349) {
    console.log(_0x1a9349);
    _0x1852a9("❌ *I Couldn't find anything. Please try again later...*");
    await _0x5d1a7d.sendMessage(_0x428e7b + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x1a9349
    }, {
      'quoted': _0x324c1b
    });
  }
});
cmd({
  'pattern': "searchmenu",
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x5aceb1, _0x4ab91b, _0x57689e, {
  from: _0x3bce68,
  quoted: _0x400a9b,
  body: _0x10d68,
  isCmd: _0x4db6b0,
  command: _0x1e45d5,
  args: _0x4b013c,
  q: _0x2997ba,
  isGroup: _0x227d7e,
  sender: _0xf54406,
  senderNumber: _0x1bda3c,
  botNumber2: _0x2e4edb,
  botNumber: _0x395bcd,
  pushname: _0x46f008,
  isMe: _0xc2714c,
  isOwner: _0x2c7095,
  groupMetadata: _0x444f68,
  groupName: _0x15c211,
  participants: _0x53eb5e,
  groupAdmins: _0x482ebd,
  isBotAdmins: _0x423fb6,
  isAdmins: _0x40b9fb,
  reply: _0x39382d
}) => {
  try {
    let _0x162625 = {
      'search': ''
    };
    for (let _0x187af1 = 0x0; _0x187af1 < commands.length; _0x187af1++) {
      if (commands[_0x187af1].pattern && !commands[_0x187af1].dontAddCommandList) {
        _0x162625[commands[_0x187af1].category] += "*📙➢ Command :* ." + commands[_0x187af1].pattern + "\n*💬➢ Desc :* " + commands[_0x187af1].desc + "\n\n";
      }
    }
    await _0x5aceb1.sendMessage(_0x3bce68, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐒𝐄𝐀𝐑𝐂𝐇 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x4ab91b
    });
  } catch (_0x4b1b77) {
    console.log(_0x4b1b77);
    _0x39382d("❌ *I Couldn't find anything. Please try again later...*");
    await _0x5aceb1.sendMessage(_0x395bcd + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x4b1b77
    }, {
      'quoted': _0x4ab91b
    });
  }
});
cmd({
  'pattern': "convertmenu",
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x5b5883, _0x537e21, _0x48cabf, {
  from: _0x4847b0,
  quoted: _0x5f4a8b,
  body: _0xcb59e,
  isCmd: _0x5c725e,
  command: _0x47a808,
  args: _0xe5e265,
  q: _0x5c8c25,
  isGroup: _0x8ef8c6,
  sender: _0x4eb987,
  senderNumber: _0x34a7b6,
  botNumber2: _0x377f02,
  botNumber: _0x4ab3de,
  pushname: _0x4ddffc,
  isMe: _0x3926cf,
  isOwner: _0x1ad585,
  groupMetadata: _0x257dd7,
  groupName: _0x51af23,
  participants: _0x9f52ac,
  groupAdmins: _0x123a65,
  isBotAdmins: _0x384866,
  isAdmins: _0xb8a41,
  reply: _0x1635f5
}) => {
  try {
    let _0x24040d = {
      'convert': ''
    };
    for (let _0x536aba = 0x0; _0x536aba < commands.length; _0x536aba++) {
      if (commands[_0x536aba].pattern && !commands[_0x536aba].dontAddCommandList) {
        _0x24040d[commands[_0x536aba].category] += "*📙➢ Command :* ." + commands[_0x536aba].pattern + "\n*💬➢ Desc :* " + commands[_0x536aba].desc + "\n\n";
      }
    }
    await _0x5b5883.sendMessage(_0x4847b0, {
      'image': {
        'url': "https://i.ibb.co/N6Hg4QWN/Sadiya-Md.jpg"
      },
      'caption': "━━━━━━━━━━━━━━━━━━━━━━━\n●🧑‍💻 𝐂𝐎𝐍𝐕𝐄𝐑𝐓 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🧑‍💻●\n━━━━━━━━━━━━━━━━━━━━━━━\n\n\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀᴅɪʏᴀ ᴛᴇᴄʜ*"
    }, {
      'quoted': _0x537e21
    });
  } catch (_0x29be66) {
    console.log(_0x29be66);
    _0x1635f5("❌ *I Couldn't find anything. Please try again later...*");
    await _0x5b5883.sendMessage(_0x4ab3de + "@s.whatsapp.net", {
      'text': "❗ *Error Info:* " + _0x29be66
    }, {
      'quoted': _0x537e21
    });
  }
});
*/

const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const yts = require("yt-search");
const {
  generateWAMessageFromContent,
  generateWAMessageContent,
} = require(config.BAILEYS);
const commandPrefix = config.PREFIX;

cmd({
    pattern: "men",
    alias: ["heP", "command"],
    desc: "Show all menu categories",
    category: "main",
    react: "⏬",
    filename: __filename
},
async (conn, mek, m, { from, pushname: _0x1279c5, reply }) => {
    try {
        const os = require("os");
        const uptime = process.uptime();
        const totalMem = os.totalmem() / (1024 ** 3);
        const freeMem = os.freemem() / (1024 ** 3);
        const usedMem = totalMem - freeMem;

        const version = "𝟑.𝟎.𝟎";
        const plugins = commands.length;
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", { hour12: true, timeZone: "Africa/Lagos" });
        const date = now.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

        const days = Math.floor(uptime / (3600 * 24));
        const hours = Math.floor((uptime % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeStr = `${days}𝐝 ${hours}𝐡 ${minutes}𝐦 ${seconds}𝐬`;

        let menuText = `╭══〘〘 *𝗫𝗕𝗢𝗧-𝗠𝗗* 〙〙═⊷
┃❍ *Mᴏᴅᴇ:* ${config.MODE}
┃❍ *Pʀᴇғɪx:* [ ${config.PREFIX} ]
┃❍ *Commnd By:* ${_0x1279c5 || "User"}
┃❍ *Pʟᴜɢɪɴs:* ${plugins}
┃❍ *Vᴇʀsɪᴏɴ:* ${version}
┃❍ *Uᴘᴛɪᴍᴇ:* ${uptimeStr}
┃❍ *Tɪᴍᴇ Nᴏᴡ:* ${time}
┃❍ *Dᴀᴛᴇ Tᴏᴅᴀʏ:* ${date}
┃❍ *Tɪᴍᴇ Zᴏɴᴇ:* Africa/Lagos
┃❍ *Sᴇʀᴠᴇʀ Rᴀᴍ:* ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
╰═════════════════⊷\n\n`;

        // حذف دسته‌های menu، nothing و misc
        const filteredCommands = commands.filter(cmd =>
            !["menu", "david", "misc"].includes(cmd.category)
        );

        const categories = [...new Set(filteredCommands.map(cmd => cmd.category))];

        const fancy = (txt) => {
            const map = {
                a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ',
                g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ',
                m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
                s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
                y: 'ʏ', z: 'ᴢ', "1": "𝟏", "2": "𝟐", "3": "𝟑",
                "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖",
                "9": "𝟗", "0": "𝟎", ".": ".", "-": "-", "_": "_"
            };
            return txt.split('').map(c => map[c.toLowerCase()] || c).join('');
        };

        for (const category of categories) {
            const cmdsInCat = filteredCommands.filter(cmd => cmd.category === category);
            if (cmdsInCat.length === 0) continue;

            menuText += `╭━━━━❮ *${category.toUpperCase()}* ❯━⊷\n`;
            cmdsInCat.forEach(cmd => {
                menuText += `╏⁠➜ ${config.PREFIX}  ${fancy(cmd.pattern)}\n`;
            });
            menuText += `╰━━━━━━━━━━━━━━━━━⊷\n\n`;
        }

        await conn.sendMessage(from, {
            image: { url: `https://i.postimg.cc/rFV2pJW5/IMG-20250603-WA0017.jpg` },
            caption: menuText.trim(),
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error(e);
        reply("Error while generating menu:\n" + e.toString());
    }
});




/*const config = require('../config');
const { cmd } = require('../command');

// Configuration
const REACTIONS = ['😲', '❤️', '🫡', '👍'];
const TARGET_CHANNEL = '0029VagQEmB002T7MWo3Sj1D'; // Your channel ID
const REACT_TO_BOT_MESSAGES = true; // Set to false if you don't want to react to bot's own messages
const DEBUG_MODE = true; // Set to false in production

// Debug logger
function debugLog(message) {
    if (DEBUG_MODE) console.log(`[ChannelReact] ${new Date().toISOString()} - ${message}`);
}

let lastError = null;

cmd({
    on: 'message'
}, async (conn, m, store, { reply }) => {
    try {
        // 1. Check if this is a channel message
        if (!m.key?.remoteJid?.includes('@broadcast')) {
            debugLog("Not a channel message - skipping");
            return;
        }

        const channelId = m.key.remoteJid.split('@')[0];
        debugLog(`Processing message from channel: ${channelId}`);

        // 2. Check if it's our target channel
        if (channelId !== TARGET_CHANNEL) {
            debugLog("Not our target channel - skipping");
            return;
        }

        // 3. Optionally skip bot's own messages
        if (!REACT_TO_BOT_MESSAGES && m.key.fromMe) {
            debugLog("Skipping bot's own message");
            return;
        }

        // 4. Select a random reaction
        const randomReaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
        debugLog(`Selected reaction: ${randomReaction} for message ${m.key.id}`);

        // 5. Add reaction
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: randomReaction,
                key: m.key
            }
        });

        debugLog(`Successfully reacted to message ${m.key.id}`);

    } catch (err) {
        lastError = err.message;
        console.error("[ChannelReact ERROR]", err);
        debugLog(`FAILED: ${err.message}`);
        
        if (DEBUG_MODE && m?.key?.remoteJid) {
            await reply(`❌ Failed to react: ${err.message}`).catch(e => console.error("Couldn't send error notification"));
        }
    }
});

cmd({
    pattern: "channelreact",
    alias: ["creact"],
    desc: "Channel auto-react settings",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { isCreator, reply }) => {
    if (!isCreator) return reply("❌ Owner only command");

    const statusMessage = `╭━━━〔 CHANNEL AUTO-REACT 〕━━━⊳
┃ 🔄 Status: ACTIVE
┃ 📢 Channel: ${TARGET_CHANNEL}
┃ 🤖 React to bot: ${REACT_TO_BOT_MESSAGES ? 'YES' : 'NO'}
┃ 🎭 Reactions: ${REACTIONS.join(' ')}
┃ 🛠️ Debug Mode: ${DEBUG_MODE ? 'ON' : 'OFF'}
┃ ❗ Last Error: ${lastError || 'None'}
╰━━━━━━━━━━━━━━━━━━━━━━━━⊳`;

    return reply(statusMessage);
});

// Initialization
debugLog(`Plugin initialized for channel ${TARGET_CHANNEL}`);
debugLog(`Configured reactions: ${REACTIONS.join(', ')}`);
*/

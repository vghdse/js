const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function getHarareTime() {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Harare',
        hour12: true,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

async function getBotVersion() {
    try {
        if (!config.REPO) return 'Ultimate';
        const repoUrl = config.REPO;
        const rawUrl = repoUrl.replace('github.com', 'raw.githubusercontent.com') + '/main/package.json';
        const { data } = await axios.get(rawUrl);
        return data.version || 'Ultimate';
    } catch (error) {
        console.error("Version check error:", error);
        return 'Ultimate';
    }
}

function fancy(txt) {
    if (!txt || typeof txt !== 'string') return '';
    const map = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ',
        g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ',
        m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
        s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
        y: 'ʏ', z: 'ᴢ', "1": "𝟏", "2": "𝟐", "3": "𝟑",
        "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖",
        "9": "𝟗", "0": "𝟎", ".": ".", "-": "-", "_": "_"
    };
    return txt.toLowerCase().split('').map(c => map[c] || c).join('');
}

function generateCategorySection(categoryName, commandsList) {
    if (!commandsList || !commandsList.length) return '';
    
    let section = `*🏮 \`${categoryName.toUpperCase()}\` 🏮*\n\n╭─────────────···◈\n`;
    
    commandsList.forEach(cmd => {
        if (cmd.pattern) {
            section += `*┋* *⬡ ${config.PREFIX}${fancy(cmd.pattern)}*\n`;
        }
    });
    
    section += `╰─────────────╶╶···◈\n\n`;
    return section;
}

cmd({
    pattern: "menu2",
    desc: "subzero menu",
    alias: ["help", "commands","list","cmdlist","listcmd"],
    category: "menu",
    react: "✅",
    filename: __filename
}, 
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        await conn.sendPresenceUpdate('composing', from);

        const version = await getBotVersion();
        const totalCommands = commands.filter(cmd => cmd.pattern).length;
        const botname = "𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃";
        const ownername = "𝐌𝐑 𝐅𝐑𝐀𝐍𝐊";

        const subzero = { 
            key: { 
                remoteJid: 'status@broadcast', 
                participant: '0@s.whatsapp.net' 
            }, 
            message: { 
                newsletterAdminInviteMessage: { 
                    newsletterJid: '120363270086174844@newsletter',
                    newsletterName: "𝐈𝐂𝐘 𝐁𝐎𝐓",
                    caption: `${botname} 𝐁𝐘 ${ownername}`, 
                    inviteExpiration: 0
                }
            }
        };

        // Filter valid commands
        const validCommands = commands.filter(cmd => 
            cmd.pattern && 
            cmd.category && 
            cmd.category.toLowerCase() !== 'menu' &&
            !cmd.hideCommand
        );

        // Group commands by category
        const categories = {};
        validCommands.forEach(cmd => {
            const category = cmd.category.toLowerCase();
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(cmd);
        });

        // Generate menu sections
        let menuSections = '';
        Object.entries(categories)
            .sort((a, b) => a[0].localeCompare(b[0])) // Sort categories alphabetically
            .forEach(([category, cmds]) => {
                menuSections += generateCategorySection(category, cmds);
            });

        let dec = `
       \`\`\`${config.BOT_NAME}\`\`\`
    
⟣──────────────────⟢
▧ *ᴄʀᴇᴀᴛᴏʀ* : *mr frank (🇿🇼)*
▧ *ᴍᴏᴅᴇ* : *${config.MODE}* 
▧ *ᴘʀᴇғɪx* : *${config.PREFIX}*
▧ *ʀᴀᴍ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB 
▧ *ᴠᴇʀsɪᴏɴ* : *${version}* 
▧ *ᴜᴘᴛɪᴍᴇ* : ${runtime(process.uptime())} 
▧ *ᴄᴏᴍᴍᴀɴᴅs* : ${totalCommands}
⟣──────────────────⟢

> ＳＵＢＺＥＲＯ - ＭＤ- ＢＯＴ

⟣──────────────────⟢
${readMore}

${menuSections}

*━━━━━━━━━━━━━━━━━━━━*⁠⁠⁠⁠
> ＭＡＤＥ ＢＹ ＭＲ ＦＲＡＮＫ
*━━━━━━━━━━━━━━━━━━━━━*
`;

        const imageUrl = config.BOT_IMAGE || 'https://i.postimg.cc/XNTmcqZ3/subzero-menu.png';
        
        await conn.sendMessage(
            from,
            {
                image: { url: imageUrl },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363304325601080@newsletter',
                        newsletterName: '🍁『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』🍁 ',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: subzero }
        );

        await conn.sendPresenceUpdate('paused', from);
        
    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Error generating menu: ${e.message}`);
    }
});



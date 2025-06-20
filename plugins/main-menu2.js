const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')



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

// Button menu command
cmd({
    pattern: "bn",
    desc: "Show smart button menu",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    const picUrl = "https://i.postimg.cc/G3k8H6gC/IMG-20250603-WA0017.jpg";
    const filtered = commands.filter(cmd => !["menu", "xbot", "misc"].includes(cmd.category));
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

    // Handle button text if it exists
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
        await conn.sendMessage(from, { react: { text: textEmoji, key: mek.key } });
        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        const text = `> *SUBZERO-MD SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;
        return await conn.sendMessage(from, { text: text }, { quoted: mek });
    }

    if (buttonText === "Alive" || buttonText === `${prefix}alive`) {
        return await conn.sendMessage(from, { text: "*✅ I am alive and ready to serve you!*" }, { quoted: mek });
    }

    // Send button menu
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
/*
// Tagactive command
const { cmd } = require("../command");
const { getActivityList } = require("../lib/activity");
cmd({
    pattern: "tagactive",
    desc: "Mentions the most active members in the group 📊",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("🚫 *This command can only be used in groups!*");
        let activeList = getActivityList(from);
        if (activeList.length === 0) return reply("⚠️ *No activity recorded yet!*");
        
        let topActive = activeList.slice(0, 5); // Get top 5 active users
        let mentions = topActive.map((u) => `🔥 @${u.user.split("@")[0]} (${u.count} msgs)`).join("\n");
        let text = `📊 *Most Active Members:*\n\n${mentions}\n\n🏆 *Stay engaged!*`;
        
        return await conn.sendMessage(from, { text, mentions: topActive.map((u) => u.user) }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return reply(`❌ *Error:* ${e}`);
    }
});

// Listgc command
*/

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
    pattern: "ping9",
    alias: ["pong"],
    desc: "Quick ping response to test latency",
    category: "main",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();

        // Send initial "Pinging..." message
        const msg = await conn.sendMessage(from, {
            text: "```Pinging...```"
        }, { quoted: mek });

        const ping = Date.now() - start;

        // Edit message to show "Pong <ms>"
        await conn.relayMessage(
            from,
            {
                protocolMessage: {
                    key: msg.key,
                    type: 14,
                    editedMessage: {
                        conversation: `\`\`\`Pong ${ping}ms!\`\`\``
                    }
                }
            },
            {}
        );

    } catch (e) {
        console.error("Ping command error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});


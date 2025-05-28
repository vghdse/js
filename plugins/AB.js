const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "obfuscate2",
    alias: ["obf2", "encrypt2"],
    react: "🔒",
    desc: "Obfuscate JavaScript code",
    category: "tools",
    use: "<javascript code>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide JavaScript code to obfuscate");

        await reply("⏳ Obfuscating your code...");

        // Encode the input code for URL
        const encodedCode = encodeURIComponent(q);
        const apiUrl = `https://api.giftedtech.web.id/api/tools/encryptv3?apikey=gifted&code=${encodedCode}`;

        const { data } = await axios.get(apiUrl);

        if (!data?.result?.encrypted_code) {
            return reply("❌ Failed to obfuscate the code");
        }

        // Send the obfuscated code
        await conn.sendMessage(from, {
            text: `*Obfuscated JavaScript Code:*\n\n${data.result.encrypted_code}`,
            contextInfo: {
                externalAdReply: {
                    title: "JavaScript Obfuscator",
                    body: "BY SUBZERO",
                    thumbnail: await axios.get('https://files.catbox.moe/rthhuj.jpg', { 
                        responseType: 'arraybuffer' 
                    }).then(res => res.data).catch(() => null),
                    mediaType: 2
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Obfuscation error:", error);
        reply(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
});

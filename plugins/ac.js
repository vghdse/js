/*const config = require('../config');
const { cmd } = require('../command');

// List of reactions to use
const REACTIONS = ['😲', '❤️', '🫡', '👍'];
const TARGET_CHANNEL = '0029VagQEmB002T7MWo3Sj1D'; // The channel ID from your link

cmd({
    on: 'message'
}, async (conn, m, store, { from, body, sender, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if this is a channel message and from the target channel
        if (m.key.remoteJid && m.key.remoteJid.includes('@broadcast') {
            const channelId = m.key.remoteJid.split('@')[0];
            
            if (channelId === TARGET_CHANNEL) {
                // Select a random reaction
                const randomReaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
                
                // React to the message
                await conn.sendMessage(m.key.remoteJid, {
                    react: {
                        text: randomReaction,
                        key: m.key
                    }
                });
                
                console.log(`Reacted with ${randomReaction} to message in channel ${channelId}`);
            }
        }
    } catch (err) {
        console.error("Channel Auto-React Error:", err.message);
    }
});

cmd({
    pattern: "ct",
    alias: ["cr"],
    react: "🔤",
    desc: "Configure auto-reactions for channel",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    if (!isCreator) return reply("❌ Owner only command");
    
    return reply(`╭━━━〔 *CHANNEL AUTO-REACT* 〕━━━┈⊷
┃▸ *Status:* Active
┃▸ *Channel:* ${TARGET_CHANNEL}
┃▸ *Reactions:* ${REACTIONS.join(' ')}
╰────────────────┈⊷
> *Bot is automatically reacting to all messages in the channel*`);
});
*/

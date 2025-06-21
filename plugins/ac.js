const config = require('../config');
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

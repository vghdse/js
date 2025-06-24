const { cmd } = require('../command');
const config = require("../config");

cmd({
    on: "message"
}, async (conn, m, store, { from, sender, isGroup, isOwner }) => {
    try {
        // Skip if PM_BLOCKER is false, or it's a group chat, or from owner
        if (!config.PM_BLOCKER || isGroup || isOwner) return;

        // Check if message is from a private chat (PM)
        if (!isGroup && !isOwner) {
            const user = sender.split('@')[0];
            
            // Send notification before blocking
            await conn.sendMessage(
                sender, 
                { text: "📛 Inbox not allowed. You've been blocked." }
            );
            
            // Block the user
            await conn.updateBlockStatus(sender, 'block');
            
            // Notify owner
            if (config.OWNER_NUMBER) {
                await conn.sendMessage(
                    config.OWNER_NUMBER + '@s.whatsapp.net', 
                    { text: `🚫 Auto-blocked user: @${user}` },
                    { mentions: [sender] }
                );
            }
        }
    } catch (error) {
        console.error("PM Blocker Error:", error);
    }
});

const { cmd } = require('../command');
const config = require('../config');

let ANTICALL_ENABLED = "true"; // Default: Enabled

cmd({
    pattern: "anticall",
    alias: ["blockcall"],
    desc: "Enable/disable auto-rejecting phone calls",
    category: "security",
    filename: __filename,
    react: "📵"
}, async (m, conn, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ *Owner-only command!*");

    const action = m.args[0]?.toLowerCase();
    if (action === "on") {
        ANTICALL_ENABLED = "true";
        reply("📵 *Anti-Call Enabled* - All calls will be rejected.");
    } else if (action === "off") {
        ANTICALL_ENABLED = "false";
        reply("📵 *Anti-Call Disabled* - Calls will be allowed.");
    } else {
        reply(`📵 *Anti-Call Status*: ${ANTICALL_ENABLED === "true" ? "ON" : "OFF"}\nUsage: *${config.PREFIX}anticall on/off*`);
    }
});

// Call rejection handler
cmd({
    on: "call"
}, async (m, conn) => {
    if (ANTICALL_ENABLED === "true") {
        await conn.sendMessage(m.sender, { 
            text: "📵 *Call Rejected!*\nThis bot does not accept calls." 
        });
        await conn.rejectCall(m.id);
    }
});

module.exports = {
    ANTICALL_ENABLED
};

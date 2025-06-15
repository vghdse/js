const config = require('../config');
const { isJidGroup, jidDecode } = require(config.BAILEYS);
const { loadMessage, getAnti } = require('../data');

async function getSenderInfo(conn, jid) {
    try {
        const name = await conn.getName(jid);
        const number = jidDecode(jid)?.user || jid.split('@')[0];
        return { name, number };
    } catch {
        const number = jidDecode(jid)?.user || jid.split('@')[0];
        return { name: number, number };
    }
}

const handleTextDelete = async (conn, mek, jid, info) => {
    const content = mek.message?.conversation || 
                   mek.message?.extendedTextMessage?.text || 
                   '[Media message]';
    
    await conn.sendMessage(jid, {
        text: `🚨 *DELETION ALERT* 🚨\n\n` +
              `📅 *Time:* ${info.time}\n` +
              `${info.isGroup ? `👥 *Group:* ${info.groupName}\n` : ''}` +
              `🗑️ *Deleted by:* ${info.deleter.name} (${info.deleter.number})\n` +
              `✍️ *Sender:* ${info.sender.name} (${info.sender.number})\n\n` +
              `📝 *Content:* ${content}`,
        mentions: [info.deleter.jid, info.sender.jid].filter(Boolean)
    });
};

const handleMediaDelete = async (conn, mek, jid, info) => {
    try {
        // Forward original message first
        const forwarded = await conn.copyNForward(jid, mek, true);
        
        // Send deletion info
        await conn.sendMessage(jid, {
            text: `🚨 *DELETION ALERT* 🚨\n\n` +
                  `📅 *Time:* ${info.time}\n` +
                  `${info.isGroup ? `👥 *Group:* ${info.groupName}\n` : ''}` +
                  `🗑️ *Deleted by:* ${info.deleter.name} (${info.deleter.number})\n` +
                  `✍️ *Sender:* ${info.sender.name} (${info.sender.number})`,
            mentions: [info.deleter.jid, info.sender.jid].filter(Boolean)
        }, { quoted: forwarded });
    } catch (error) {
        console.error('Media forward failed:', error);
        // Fallback to sending just the info
        await conn.sendMessage(jid, {
            text: `🚨 *MEDIA DELETION ALERT* 🚨\n\n` +
                  `📅 *Time:* ${info.time}\n` +
                  `${info.isGroup ? `👥 *Group:* ${info.groupName}\n` : ''}` +
                  `🗑️ *Deleted by:* ${info.deleter.name} (${info.deleter.number})\n` +
                  `✍️ *Sender:* ${info.sender.name} (${info.sender.number})\n` +
                  `📁 *Media type:* ${Object.keys(mek.message)[0]}`,
            mentions: [info.deleter.jid, info.sender.jid].filter(Boolean)
        });
    }
};

const handleStatusDelete = async (conn, mek, jid, info) => {
    try {
        // Try to forward status first
        const forwarded = await conn.copyNForward(jid, mek, true);
        
        await conn.sendMessage(jid, {
            text: `⚠️ *STATUS DELETION* ⚠️\n\n` +
                  `📅 *Time:* ${info.time}\n` +
                  `👤 *User:* ${info.sender.name} (${info.sender.number})`,
            mentions: [info.sender.jid]
        }, { quoted: forwarded });
    } catch (error) {
        console.error('Status forward failed:', error);
        await conn.sendMessage(jid, {
            text: `⚠️ *STATUS DELETION* ⚠️\n\n` +
                  `📅 *Time:* ${info.time}\n` +
                  `👤 *User:* ${info.sender.name} (${info.sender.number})\n` +
                  `📁 *Media type:* ${Object.keys(mek.message)[0]}`,
            mentions: [info.sender.jid]
        });
    }
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            try {
                const store = await loadMessage(update.key.id);
                if (!store?.message) continue;

                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const isStatus = store.jid.includes('status@broadcast');
                const antiDeleteStatus = await getAnti(isGroup ? 'gc' : 'dm');
                
                if (!antiDeleteStatus) continue;

                const time = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                // Get participant info
                const senderJid = mek.key.participant || mek.key.remoteJid;
                const deleterJid = update.key.participant || update.key.remoteJid;
                
                const [sender, deleter] = await Promise.all([
                    getSenderInfo(conn, senderJid),
                    getSenderInfo(conn, deleterJid)
                ]);

                const info = {
                    time,
                    isGroup,
                    sender: { ...sender, jid: senderJid },
                    deleter: { ...deleter, jid: deleterJid },
                    groupName: isGroup ? (await conn.groupMetadata(store.jid)).subject : null
                };

                if (isStatus) {
                    await handleStatusDelete(conn, mek, conn.user.id, info);
                } else if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await handleTextDelete(conn, mek, conn.user.id, info);
                } else {
                    await handleMediaDelete(conn, mek, conn.user.id, info);
                }
            } catch (error) {
                console.error('AntiDelete error:', error);
            }
        }
    }
};

module.exports = {
    AntiDelete
};

/*const config = require('../config');
const { isJidGroup } = require(config.BAILEYS);
const { loadMessage, getAnti } = require('../data');

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
    deleteInfo += `\n\n*📝 Deleted Message:* ${messageContent}`;

    await conn.sendMessage(
        jid, // This will now always be the bot's personal chat
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];
    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message,
        };
    }
    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        antideletedmek[messageType].caption = deleteInfo;
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        await conn.sendMessage(jid, { text: `*🚨 Deletion Alert!*\n\n${deleteInfo}` }, { quoted: mek });
    }
    await conn.relayMessage(jid, antideletedmek, {});
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteType = isGroup ? 'gc' : 'dm';
                const antiDeleteStatus = await getAnti(antiDeleteType);
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo;
                const jid = conn.user.id; // Always send to bot's personal chat

                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    
                    // Get sender and deleter phone numbers
                    const sender = mek.key.participant || mek.key.remoteJid;
                    const deleter = update.key.participant || update.key.remoteJid;
                    
                    // Format phone numbers
                    const senderNumber = sender.split('@')[0];
                    const deleterNumber = deleter.split('@')[0];

                    deleteInfo = `*〄═══════════════〄*\n        *🚨 GROUP DELETION ALERT* 🚨\n*〄═══════════════〄*\n\n📅 *Time:* ${deleteTime}\n👥 *Group:* ${groupName}\n📱 *Deleted by:* ${deleterNumber}\n📱 *Original sender:* ${senderNumber}`;
                } else {
                    // For direct messages
                    const sender = mek.key.remoteJid;
                    const deleter = update.key.remoteJid;
                    
                    // Format phone numbers
                    const senderNumber = sender.split('@')[0];
                    const deleterNumber = deleter.split('@')[0];
                    
                    deleteInfo = `*〄═══════════════〄*\n        *🚨 DM DELETION ALERT* 🚨\n*〄═══════════════〄*\n\n📅 *Time:* ${deleteTime}\n📱 *Deleted by:* ${deleterNumber}\n📱 *Original sender:* ${senderNumber}`;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
*/
/*const config = require('../config');
const { isJidGroup } = require(config.BAILEYS);
const { loadMessage, getAnti } = require('../data');


const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
    deleteInfo += `\n\n*📝 Deleted Message:* ${messageContent}`;

    await conn.sendMessage(
        jid,
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];
    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message,
        };
    }
    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        antideletedmek[messageType].caption = deleteInfo;
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        await conn.sendMessage(jid, { text: `*🚨 Deletion Alert!*\n\n${deleteInfo}` }, { quoted: mek });
    }
    await conn.relayMessage(jid, antideletedmek, {});
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteType = isGroup ? 'gc' : 'dm';
                const antiDeleteStatus = await getAnti(antiDeleteType);
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];

                    deleteInfo = `*〄═══════════════〄*\n        *🚨 DELETION ALERT* 🚨\n*〄═══════════════〄*\n\n📅 *Time:* ${deleteTime}\n👥 *Group:* ${groupName}\n🗑️ *Deleted by:* @${deleter}\n✍️ *Sender:* @${sender}`;
                    jid = config.ANTI_DEL_PATH === "log" ? conn.user.id : store.jid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];
                    
                    deleteInfo = `*〄═══════════════〄*\n        *🚨 DELETION ALERT* 🚨\n*〄═══════════════〄*\n\n📅 *Time:* ${deleteTime}\n👤 *Chat with:* @${deleterNumber}\n✍️ *Sender:* @${senderNumber}`;
                    jid = config.ANTI_DEL_PATH === "log" ? conn.user.id : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
*/
/*
//beloww
const config = require('../config');
const { isJidGroup } = require(config.BAILEYS);
const { loadMessage, getAnti } = require('../data');


const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
    deleteInfo += `\n◈ Content ━ ${messageContent}`;

    await conn.sendMessage(
        jid,
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];
    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message,
        };
    }
    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        antideletedmek[messageType].caption = deleteInfo;
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        await conn.sendMessage(jid, { text: `*⚠️ Deleted Message Alert 🚨*\n${deleteInfo}` }, { quoted: mek });
    }
    await conn.relayMessage(jid, antideletedmek, {});
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteStatus = await getAnti();
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];


                   deleteInfo = `*〄═══════════════〄*\n        *🚨 DELETION ALERT* 🚨\n*〄═══════════════〄*\n\n📅 *Time:* ${deleteTime}\n👥 *Group:* ${groupName}\n🗑️ *Deleted by:* @${deleter}\n✍️ *Sender:* @${sender}`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : store.jid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];
                    
                    deleteInfo = `*〄═══════════════〄*\n        *🚨 DELETION ALERT* 🚨\n*〄═══════════════〄*\n\n📅 *Time:* ${deleteTime}\n👤 *Chat with:* @${deleterNumber}\n✍️ *Sender:* @${senderNumber}`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};

*/
// by mr frank

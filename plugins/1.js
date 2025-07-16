const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd(
    {
        pattern: 'yt',
        alias: ['youtube', 'song'],
        desc: 'Download YouTube videos/audio',
        category: 'media',
        react: '⬇️',
        use: '<url or search term>',
        filename: __filename
    },
    async (conn, msg, { text, reply }) => {
        try {
            if (!text) return reply('🎬 *Usage:* .yt <url/query>\nExample: .yt https://youtu.be/...\n.yt never gonna give you up');

            // Show processing message
            await reply('🔍 Processing your request...');

            // Get video info from API
            const apiUrl = `https://romektricks-subzero-yt.hf.space/yt?query=${encodeURIComponent(text)}`;
            const { data } = await axios.get(apiUrl);
            
            if (!data.success || !data.result) {
                return reply('❌ Failed to fetch video info');
            }

            const video = data.result;
            const thumbnailUrl = video.thumbnail || video.image;

            // Prepare info message with options
            const infoMsg = `🎬 *${video.title}*\n\n` +
                           `⏱ Duration: ${video.timestamp || video.duration?.timestamp || 'N/A'}\n` +
                           `👤 Author: ${video.author?.name || 'Unknown'}\n` +
                           `👀 Views: ${video.views ? video.views.toLocaleString() : 'N/A'}\n\n` +
                           `*Reply with:*\n` +
                           `1 - For Video Download (${video.timestamp || ''}) 🎥\n` +
                           `2 - For Audio Download (MP3) 🎵\n\n` +
                           `_Expires in 2 minutes_`;

            // Send video info with thumbnail
            const sentMsg = await conn.sendMessage(
                msg.chat,
                {
                    image: { url: thumbnailUrl },
                    caption: infoMsg
                },
                { quoted: msg }
            );

            // Set up response handler
            const responseHandler = async (m) => {
                if (!m.message || m.key.remoteJid !== msg.chat) return;

                const isReply = m.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
                const choice = m.message.conversation || m.message.extendedTextMessage?.text;

                if (!isReply || !['1', '2'].includes(choice)) return;

                // Remove listener
                conn.ev.off('messages.upsert', responseHandler);

                // Delete the options message
                try {
                    await conn.sendMessage(msg.chat, { delete: sentMsg.key });
                } catch (e) {
                    console.log('Could not delete message:', e);
                }

                // Get download URL
                const downloadUrl = choice === '1' ? video.download.video : video.download.audio;
                const fileType = choice === '1' ? 'video' : 'audio';
                const fileName = `${video.title.replace(/[^\w\s]/gi, '')}.${fileType === 'video' ? 'mp4' : 'mp3'}`;

                // Send downloading message
                await reply(`⬇️ Downloading ${fileType === 'video' ? 'video' : 'audio'}...`);

                // Send the media file
                await conn.sendMessage(
                    msg.chat,
                    {
                        [fileType]: { url: downloadUrl },
                        mimetype: fileType === 'video' ? 'video/mp4' : 'audio/mpeg',
                        fileName: fileName
                    },
                    { quoted: msg }
                );
            };

            // Set timeout for response
            setTimeout(() => {
                conn.ev.off('messages.upsert', responseHandler);
            }, 120000); // 2 minute timeout

            conn.ev.on('messages.upsert', responseHandler);

        } catch (error) {
            console.error('YouTube Download Error:', error);
            reply('❌ Error: ' + (error.message || 'Failed to process request'));
        }
    }
);

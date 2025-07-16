const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

// API configuration
const YT_API = 'https://romektricks-subzero-yt.hf.space/yt';

cmd(
    {
        pattern: 'yt1',
        alias: ['youtube1', 'video1'],
        desc: 'YouTube video/audio downloader',
        category: 'media',
        react: '⬇️',
        use: '<url or search term>',
        filename: __filename
    },
    async (conn, msg, { text, reply }) => {
        try {
            if (!text) return reply('🎬 *Usage:* .yt <url/query>\nExample: .yt https://youtu.be/...\n.yt never gonna give you up');

            // Send initial processing message
            const processingMsg = await reply('🔍 Searching... Please wait');

            // Check if input is URL or search query
            const isUrl = text.match(/(youtube\.com|youtu\.be)/i);
            let videoUrl, videoInfo;

            if (isUrl) {
                videoUrl = text;
                videoInfo = await yts({ videoId: text.match(/[?&]v=([^&]+)/)?.[1] || text.split('/').pop() });
            } else {
                const searchResults = await yts(text);
                if (!searchResults.videos.length) return reply('❌ No results found');
                videoInfo = searchResults.videos[0];
                videoUrl = videoInfo.url;
            }

            // Fetch download links from API
            const { data: apiData } = await axios.get(`${YT_API}?query=${encodeURIComponent(videoUrl)}`);
            if (!apiData?.success) return reply('❌ Failed to get download links');

            // Prepare media information
            const title = videoInfo?.title || apiData.result?.title || 'YouTube Media';
            const duration = videoInfo?.timestamp || apiData.result?.timestamp || 'N/A';
            const views = videoInfo?.views ? videoInfo.views.toLocaleString() + ' views' : '';
            const author = videoInfo?.author?.name || 'Unknown';

            // Send media info with options
            const optionsMsg = `🎬 *${title}*\n\n` +
                              `⏱ Duration: ${duration}\n` +
                              `👤 Author: ${author}\n` +
                              `👀 Views: ${views}\n\n` +
                              `*Reply with:*\n` +
                              `1 - For Video Format 🎥\n` +
                              `2 - For Audio Format 🎵\n\n` +
                              `_Download will start immediately_`;

            // Delete processing message
            try {
                await conn.sendMessage(msg.chat, { delete: processingMsg.key });
            } catch (deleteError) {
                console.log('Failed to delete processing message');
            }

            // Send options message
            const sentMsg = await conn.sendMessage(msg.chat, { 
                text: optionsMsg,
                ...(videoInfo?.thumbnail && { image: { url: videoInfo.thumbnail } })
            }, { quoted: msg });

            // Set up response listener
            const responseListener = async (messageUpdate) => {
                const response = messageUpdate.messages[0];
                if (!response?.message || !response.key?.fromMe) return;

                const isReply = response.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
                const choice = response.message.conversation || response.message.extendedTextMessage?.text;

                if (!isReply || !['1', '2'].includes(choice)) return;

                // Remove listener
                conn.ev.off('messages.upsert', responseListener);

                // Delete the options message
                try {
                    await conn.sendMessage(msg.chat, { delete: sentMsg.key });
                } catch (deleteError) {
                    console.log('Failed to delete options message');
                }

                // Get download URL based on choice
                const downloadType = choice === '1' ? 'video' : 'audio';
                const downloadUrl = apiData.result.download?.[downloadType] || apiData.result.url;
                const fileExt = downloadType === 'video' ? 'mp4' : 'mp3';
                const fileName = `${title.replace(/[<>:"\/\\|?*]+/g, '')}.${fileExt}`;

                // Send downloading message
                await reply(`⬇️ Downloading ${downloadType}...`);

                // Send the media file
                await conn.sendMessage(
                    msg.chat,
                    { 
                        [downloadType]: { url: downloadUrl },
                        mimetype: downloadType === 'video' ? 'video/mp4' : 'audio/mpeg',
                        fileName: fileName
                    },
                    { quoted: msg }
                );
            };

            conn.ev.on('messages.upsert', responseListener);

        } catch (error) {
            console.error('YT Download Error:', error);
            reply('❌ Error: ' + (error.message || 'Failed to process request'));
        }
    }
);

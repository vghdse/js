const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const Config = require('../config');

// Optimized axios
const axiosInstance = axios.create({
  timeout: 10000,
  maxRedirects: 5
});

cmd(
    {
        pattern: 'song',
        alias: ['play', 'music'],
        desc: 'YouTube audio downloader',
        category: 'media',
        react: '⌛',
        use: '<YouTube URL or search query> [quality]',
        filename: __filename,
    },
    async (conn, mek, m, { text, reply }) => {
        try {
            if (!text) return reply('🎵 *Usage:* .song <query/url> [quality]\nExample: .song https://youtu.be/ox4tmEV6-QU\n.song Alan Walker Lily 128');

            let [input, quality = '92'] = text.split(' ');
            quality = ['92', '128', '256', '320'].includes(quality) ? quality : '92';

            // Safely send reaction
            try {
                if (mek?.key?.id) {
                    await conn.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } });
                }
            } catch (reactError) {
                console.error('Failed to send reaction:', reactError);
            }

            // Get video URL using yt-search
            let videoUrl, videoInfo;
            if (input.match(/youtu\.?be/)) {
                videoUrl = input;
                // Extract video ID for yt-search
                const videoId = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1];
                if (videoId) {
                    videoInfo = await yts({ videoId });
                }
            } else {
                const searchResults = await yts(input);
                if (!searchResults.videos.length) return reply('🎵 No results found for your search');
                videoUrl = searchResults.videos[0].url;
                videoInfo = searchResults.videos[0];
            }

            const apiUrl = `https://mrfrank-api.vercel.app/api/ytmp3dl?url=${encodeURIComponent(videoUrl)}&quality=${quality}`;
            const apiResponse = await axiosInstance.get(apiUrl);
            if (!apiResponse.data?.status || !apiResponse.data.download?.url) {
                return reply('🎵 Failed to fetch audio - API error');
            }

            const songData = apiResponse.data;

            // Get thumbnail
            let thumbnailBuffer;
            try {
                const thumbnailUrl = videoInfo?.thumbnail || songData.metadata.thumbnail;
                if (thumbnailUrl) {
                    const response = await axiosInstance.get(thumbnailUrl, { responseType: 'arraybuffer' });
                    thumbnailBuffer = Buffer.from(response.data, 'binary');
                }
            } catch (e) {
                console.error('Failed to fetch thumbnail:', e);
                thumbnailBuffer = null;
            }

            const songInfo = `🎧 *${songData.metadata.title || videoInfo?.title || 'Unknown Title'}*\n` +
                            `⏱ ${songData.metadata.timestamp || videoInfo?.timestamp || 'N/A'} | ${songData.download.quality}\n` +
                            `👤 ${songData.metadata.author?.name || videoInfo?.author?.name || 'Unknown'}\n` +
                            `👀 ${songData.metadata.views || videoInfo?.views || 'N/A'} views\n` +
                            `📅 ${songData.metadata.ago || 'Unknown upload date'}\n\n` +
                            `🔗 ${songData.url || videoUrl}\n\n` +
                            `*Reply with:*\n` +
                            `1 - For Audio Format 🎵\n` +
                            `2 - For Document Format 📁\n\n` +
                            `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${Config.BOT_NAME}`;

            const sentMsg = await conn.sendMessage(mek.chat, {
                image: thumbnailBuffer,
                caption: songInfo,
                contextInfo: {
                    externalAdReply: {
                        title: songData.metadata.title || videoInfo?.title || 'YouTube Audio',
                        body: `Quality: ${songData.download.quality}`,
                        thumbnail: thumbnailBuffer,
                        mediaType: 1,
                        mediaUrl: songData.url || videoUrl,
                        sourceUrl: songData.url || videoUrl
                    }
                }
            }, { quoted: mek });

            // Timeout after 60 seconds
            const timeout = setTimeout(() => {
                conn.ev.off('messages.upsert', messageListener);
                reply("⌛ Session timed out. Please use the command again if needed.");
            }, 60000);

            const messageListener = async (messageUpdate) => {
                try {
                    const mekInfo = messageUpdate?.messages[0];
                    if (!mekInfo?.message) return;

                    const message = mekInfo.message;
                    const messageType = message.conversation || message.extendedTextMessage?.text;
                    const isReplyToSentMsg = message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

                    if (!isReplyToSentMsg || !['1', '2'].includes(messageType?.trim())) return;

                    // Remove listener and timeout
                    conn.ev.off('messages.upsert', messageListener);
                    clearTimeout(timeout);

                    const processingMsg = await reply("⏳ Processing your request...");
                    
                    const audioResponse = await axiosInstance.get(songData.download.url, {
                        responseType: 'arraybuffer',
                        headers: { Referer: 'https://www.youtube.com/' }
                    });
                    const audioBuffer = Buffer.from(audioResponse.data, 'binary');

                    const fileName = `${songData.metadata.title || videoInfo?.title || 'audio'}.mp3`.replace(/[<>:"\/\\|?*]+/g, '');

                    if (messageType.trim() === "1") {
                        await conn.sendMessage(mek.chat, {
                            audio: audioBuffer,
                            mimetype: 'audio/mpeg',
                            fileName: fileName,
                            ptt: false
                        }, { quoted: mek });
                    } else {
                        await conn.sendMessage(mek.chat, {
                            document: audioBuffer,
                            mimetype: 'audio/mpeg',
                            fileName: fileName
                        }, { quoted: mek });
                    }

                   /* await conn.sendMessage(mek.chat, { 
                        text: '✅ Download completed successfully!', 
                        edit: { ...processingMsg.key, remoteJid: mek.chat }
                    });
                    */
                    try {
                        if (mekInfo?.key?.id) {
                            await conn.sendMessage(mek.chat, { react: { text: "✅", key: mekInfo.key } });
                        }
                    } catch (reactError) {
                        console.error('Failed to send success reaction:', reactError);
                    }

                } catch (error) {
                    console.error('Error in listener:', error);
                    await reply('🎵 Error processing your request: ' + (error.message || 'Please try again'));
                    
                    try {
                        if (mek?.key?.id) {
                            await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
                        }
                    } catch (reactError) {
                        console.error('Failed to send error reaction:', reactError);
                    }
                }
            };

            conn.ev.on('messages.upsert', messageListener);

        } catch (error) {
            console.error('Error:', error);
            try {
                if (mek?.key?.id) {
                    await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
                }
            } catch (reactError) {
                console.error('Failed to send error reaction:', reactError);
            }
            reply('🎵 Error: ' + (error.message || 'Please try again later'));
        }
    }
);

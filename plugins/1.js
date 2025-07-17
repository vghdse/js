const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd(
    {
        pattern: 'song',
        alias: ['music', 'audio'],
        desc: 'Download high quality audio from YouTube',
        category: 'media',
        react: '🎵',
        use: '<song name or YouTube url>',
        filename: __filename
    },
    async (conn, msg, { text, reply }) => {
        try {
            if (!text) return reply('🎵 *Usage:* .song <query/url>\nExample: .song https://youtu.be/...\n.song never gonna give you up');

            // Search for video if not URL
            let videoUrl = text;
            let videoInfo = null;
            
            if (!text.match(/(youtube\.com|youtu\.be)/i)) {
                const search = await yts(text);
                if (!search.videos.length) return reply('❌ No results found');
                videoInfo = search.videos[0];
                videoUrl = videoInfo.url;
            }

            // Get download link from API
            const apiUrl = `https://romektricks-subzero-yt.hf.space/yt?query=${encodeURIComponent(videoUrl)}`;
            const { data } = await axios.get(apiUrl);
            
            if (!data?.success || !data?.result?.download?.audio) {
                return reply('❌ Failed to get audio download link');
            }

            const audioUrl = data.result.download.audio;
            const title = data.result.title || 'YouTube Audio';
            const fileName = `${title.replace(/[<>:"\/\\|?*]+/g, '')}.mp3`;

            // Send audio file
            await reply('⬇️ Downloading audio...');
            await conn.sendMessage(
                msg.chat,
                {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    fileName: fileName,
                    ptt: false
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('Song Download Error:', error);
            reply('❌ Error: ' + (error.message || 'Failed to download audio'));
        }
    }
);




cmd(
    {
        pattern: 'video',
        alias: ['ytvideo', 'vid'],
        desc: 'Download high quality videos from YouTube',
        category: 'media',
        react: '🎬',
        use: '<video name or YouTube url>',
        filename: __filename
    },
    async (conn, msg, { text, reply }) => {
        try {
            if (!text) return reply('🎬 *Usage:* .video <query/url>\nExample: .video https://youtu.be/...\n.video cute cat videos');

            // Search for video if not URL
            let videoUrl = text;
            let videoInfo = null;
            
            if (!text.match(/(youtube\.com|youtu\.be)/i)) {
                const search = await yts(text);
                if (!search.videos.length) return reply('❌ No results found');
                videoInfo = search.videos[0];
                videoUrl = videoInfo.url;
            }

            // Get download link from API
            const apiUrl = `https://romektricks-subzero-yt.hf.space/yt?query=${encodeURIComponent(videoUrl)}`;
            const { data } = await axios.get(apiUrl);
            
            if (!data?.success || !data?.result?.download?.video) {
                return reply('❌ Failed to get video download link');
            }

            const videoUrl = data.result.download.video;
            const title = data.result.title || 'YouTube Video';
            const fileName = `${title.replace(/[<>:"\/\\|?*]+/g, '')}.mp4`;

            // Send video file
            await reply('⬇️ Downloading video...');
            await conn.sendMessage(
                msg.chat,
                {
                    video: { url: videoUrl },
                    mimetype: 'video/mp4',
                    fileName: fileName,
                    caption: title
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('Video Download Error:', error);
            reply('❌ Error: ' + (error.message || 'Failed to download video'));
        }
    }
);

const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
    pattern: "song4",
    alias: ["music4", "play4"],
    react: "🎵",
    desc: "Download high quality YouTube audio",
    category: "download",
    use: "<song name or YouTube link>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song name or YouTube link");

        // Get YouTube URL from query if needed
        let videoUrl = q;
        if (!q.match(/(youtube\.com|youtu\.be)/)) {
            const search = await yts(q);
            if (!search.videos.length) return reply("❌ No videos found");
            videoUrl = search.videos[0].url;
        }

        await reply("⬇️ Downloading audio...");

        // API request
        const apiUrl = `https://api.giftedtech.web.id/api/download/yta?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.result?.download_url) {
            return reply("❌ Failed to get download URL");
        }

        // Send as document for better quality
        await conn.sendMessage(from, {
            document: { url: data.result.download_url },
            fileName: `${data.result.title.replace(/[^\w\s.-]/g, '')}.mp3`,
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: data.result.title,
                    body: `Quality: ${data.result.quality} | Duration: ${data.result.duration}`,
                    thumbnail: await axios.get(data.result.thumbnail, { 
                        responseType: 'arraybuffer' 
                    }).then(res => res.data).catch(() => null),
                    mediaType: 2,
                    mediaUrl: videoUrl
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Song download error:", error);
        reply(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
});

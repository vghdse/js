const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "videodl",
  alias: ["vdl", "ytdl", "youtube"],
  react: '🎬',
  desc: "Download high quality YouTube videos",
  category: "download",
  use: ".videodl <youtube-url> or .videodl <search-query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!args.length) return reply("Please provide a YouTube URL or search query\nExample: .videodl https://youtu.be/dQw4w9WgXcQ");

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let videoUrl = args.join(" ");
    let isSearchQuery = !videoUrl.match(/youtu(be\.com|\.be)/);

    // Handle search queries
    if (isSearchQuery) {
      try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(searchUrl);
        const videoId = data.match(/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1];
        if (!videoId) return reply("No videos found for your search");
        videoUrl = `https://youtu.be/${videoId}`;
      } catch (e) {
        console.error("Search error:", e);
        return reply("Failed to search YouTube. Please try a direct URL.");
      }
    }

    // Extract video ID
    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
    if (!videoId) return reply("Invalid YouTube URL");

    // API endpoints (GiftedTech as primary, Kaiz as fallback)
    const apiEndpoints = [
      {
        name: "GiftedTech YTDLv2",
        url: `https://api.giftedtech.web.id/api/download/ytdlv2?apikey=gifted&url=https://youtu.be/${videoId}`,
        processor: (data) => ({
          title: data.result.title,
          duration: data.result.duration,
          thumbnail: data.result.thumbnail,
          url: data.result.download_url,
          quality: data.result.format
        })
      },
      {
        name: "GiftedTech YTVID",
        url: `https://api.giftedtech.web.id/api/download/ytvid?apikey=gifted&format=360p&url=https://youtu.be/${videoId}`,
        processor: (data) => ({
          title: data.result.title,
          duration: data.result.duration,
          thumbnail: data.result.thumbnail,
          url: data.result.video_url || data.result.download_url,
          quality: data.result.format || "360p"
        })
      },
      {
        name: "Kaiz Y2Mate",
        url: `https://kaiz-apis.gleeze.com/api/y2mate?url=https://youtube.com/watch?v=${videoId}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`,
        processor: (data) => ({
          title: data.title,
          duration: data.duration,
          thumbnail: data.thumbnail,
          url: data.download_url,
          quality: "HD"
        })
      }
    ];

    let videoInfo = null;
    let apiUsed = "";

    // Try each API in sequence
    for (const api of apiEndpoints) {
      try {
        const response = await axios.get(api.url, { timeout: 10000 });
        if (response.data && (response.data.result || response.data.download_url)) {
          videoInfo = api.processor(response.data);
          apiUsed = api.name;
          console.log(`Using API: ${api.name}`);
          break;
        }
      } catch (e) {
        console.error(`API ${api.name} failed:`, e.message);
      }
    }

    if (!videoInfo) return reply("All download services failed. Please try again later.");

    await reply(`⬇️ Downloading: *${videoInfo.title}* (${videoInfo.duration || 'N/A'}) [${apiUsed}]`);

    // Download the video with proper headers
    const videoResponse = await axios.get(videoInfo.url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://www.youtube.com/",
        "Accept": "video/*"
      },
      timeout: 60000,
      maxContentLength: 200 * 1024 * 1024 // 200MB max
    });

    // Validate video file
    if (!videoResponse.data || videoResponse.data.length < 500 * 1024) {
      return reply("❌ Failed: Invalid video file received (too small). The video may be restricted.");
    }

    const videoBuffer = Buffer.from(videoResponse.data, "binary");

    // Send the video
    await conn.sendMessage(
      from,
      {
        video: videoBuffer,
        caption: `🎬 *${videoInfo.title}*\n⏳ Duration: ${videoInfo.duration || 'N/A'}\n📏 Quality: ${videoInfo.quality}\n\n📥 Downloaded via ${config.BOT_NAME}`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true
        }
      },
      { quoted: mek }
    );

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("Video download error:", error);
    let errorMsg = "Failed to download video";
    if (error.response?.status === 403) errorMsg = "Video is restricted";
    if (error.code === 'ECONNABORTED') errorMsg = "Request timed out";
    if (error.message.includes('maxContentLength')) errorMsg = "Video is too large (max 200MB)";
    
    reply(`❌ Error: ${errorMsg}`);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

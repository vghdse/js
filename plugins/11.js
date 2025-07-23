const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "videodl",
  alias: ["vdl", "downloadvideo", "vid"],
  react: '🎬',
  desc: "Download high quality videos from YouTube",
  category: "download",
  use: ".videodl <youtube-url> or .videodl <search-query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!args.length) return reply("Please provide a YouTube URL or search query\nExample: .videodl https://youtube.com/watch?v=dQw4w9WgXcQ");

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let videoUrl = args.join(" ");
    let isSearchQuery = !videoUrl.match(/youtu(be\.com|\.be)/);

    // If search query, find YouTube video
    if (isSearchQuery) {
      try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(searchUrl);
        const videoId = data.match(/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1];
        if (!videoId) return reply("No videos found for your search");
        videoUrl = `https://youtube.com/watch?v=${videoId}`;
      } catch (e) {
        console.error("Search error:", e);
        return reply("Failed to search YouTube. Please try a direct URL.");
      }
    }

    // Extract video ID if URL is provided
    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
    if (!videoId) return reply("Invalid YouTube URL. Please provide a valid link.");

    // Use Kaiz API to get download info
    const apiUrl = `https://kaiz-apis.gleeze.com/api/y2mate?url=https://youtube.com/watch?v=${videoId}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`;
    
    let videoData;
    try {
      const apiResponse = await axios.get(apiUrl, { timeout: 10000 });
      videoData = apiResponse.data;
      
      if (!videoData.download_url) {
        throw new Error("No download URL found in API response");
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
      return reply("Failed to get video information. The video may be restricted or unavailable.");
    }

    await reply(`⬇️ Downloading: *${videoData.title}* (${videoData.duration || 'N/A'})`);

    // Download the video with proper headers and timeout
    const videoResponse = await axios.get(videoData.download_url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://www.youtube.com/",
        "Accept": "video/webm,video/ogg,video/*;q=0.9"
      },
      timeout: 60000, // 60 seconds timeout
      maxContentLength: 200 * 1024 * 1024 // 200MB max
    });

    // Validate the downloaded video
    if (!videoResponse.data || videoResponse.data.length < 500 * 1024) { // Less than 500KB
      return reply("❌ Failed: Received invalid video file. The video may be restricted or too large.");
    }

    const videoBuffer = Buffer.from(videoResponse.data, "binary");

    // Send the video with metadata
    await conn.sendMessage(
      from,
      {
        video: videoBuffer,
        caption: `🎬 *${videoData.title}*\n⏳ Duration: ${videoData.duration || 'N/A'}\n\n📥 Downloaded via ${config.BOT_NAME}`,
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

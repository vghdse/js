const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");

// ==============================================
// VIDEO DOWNLOADER PLUGIN
// ==============================================

cmd({
  pattern: "videodl",
  alias: ["vdl", "downloadvideo", "vid"],
  react: '🎬',
  desc: "Download videos from URLs or YouTube search",
  category: "download",
  use: ".videodl <url> or .videodl <search query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!args.length) return reply("Please provide a URL or search query\nExample: .videodl https://youtube.com/... or .videodl cute cat videos");

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let videoUrl = args.join(" ");
    let isSearchQuery = !videoUrl.match(/https?:\/\//);

    // If it's a search query, find first YouTube result
    if (isSearchQuery) {
      try {
        const searchResponse = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(videoUrl)}`);
        const videoIdMatch = searchResponse.data.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
        if (!videoIdMatch) return reply("No videos found for your search");
        videoUrl = `https://youtube.com/watch?v=${videoIdMatch[1]}`;
      } catch (e) {
        console.error("Search error:", e);
        return reply("Failed to search YouTube. Please try a direct URL instead.");
      }
    }

    // Try multiple video download APIs
    const apiResponses = await Promise.allSettled([
      axios.get(`https://kaiz-apis.gleeze.com/api/y2mate?url=${encodeURIComponent(videoUrl)}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`),
      axios.get(`https://api.nexoracle.com/downloader/aio2?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`)
    ]);

    // Find first successful API response
    let videoData = null;
    for (const response of apiResponses) {
      if (response.status === "fulfilled" && response.value.data) {
        const data = response.value.data;
        if (data.download_url || data.result?.hd_video) {
          videoData = {
            title: data.title || "Downloaded Video",
            thumbnail: data.thumbnail,
            url: data.download_url || data.result.hd_video || data.result.sd_video,
            duration: data.duration
          };
          break;
        }
      }
    }

    if (!videoData) return reply("All download services failed. Please try again later.");

    await reply(`⬇️ Downloading: *${videoData.title}*${videoData.duration ? ` (${videoData.duration})` : ''}`);

    // Download the video
    const videoResponse = await axios.get(videoData.url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!videoResponse.data) return reply("Download failed. The video may be too large or restricted.");

    const videoBuffer = Buffer.from(videoResponse.data, "binary");

    await conn.sendMessage(
      from,
      {
        video: videoBuffer,
        caption: `🎬 *${videoData.title}*\n${videoData.duration ? `⏳ Duration: ${videoData.duration}\n` : ''}\n📥 Downloaded via ${config.BOT_NAME}`,
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
    reply(`❌ Error: ${error.message.includes("timeout") ? "Request timed out" : "Failed to download video"}`);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

// ==============================================
// WEB TO ZIP PLUGIN
// ==============================================

cmd({
  pattern: "web2zip",
  alias: ["site2zip", "webarchive", "archive"],
  react: '🗂️',
  desc: "Convert website to downloadable ZIP archive",
  category: "tools",
  use: ".web2zip <url>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const url = args[0];
    if (!url) return reply("Please provide a URL\nExample: .web2zip https://google.com");
    
    if (!url.match(/^https?:\/\//)) {
      return reply("Invalid URL. Please include http:// or https://");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://api.giftedtech.web.id/api/tools/web2zip?apikey=gifted&url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, { timeout: 30000 });

    if (!response.data?.success || !response.data?.result?.download_url) {
      return reply("Failed to archive website. The site may be too large or restricted.");
    }

    const { siteUrl, copiedFilesAmount, download_url } = response.data.result;

    await reply(`🗂️ Archiving: *${siteUrl}*\n📂 Files: ${copiedFilesAmount}\n\n⏳ Preparing download...`);

    const zipResponse = await axios.get(download_url, {
      responseType: "arraybuffer",
      timeout: 60000
    });

    if (!zipResponse.data) return reply("Failed to download archive. The file may be too large.");

    const zipBuffer = Buffer.from(zipResponse.data, "binary");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `website_archive_${timestamp}.zip`;

    await conn.sendMessage(
      from,
      {
        document: zipBuffer,
        fileName: filename,
        mimetype: "application/zip",
        caption: `🗂️ *Website Archive*\n🌐 ${siteUrl}\n📂 ${copiedFilesAmount} files\n\n📥 Downloaded via ${config.BOT_NAME}`,
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
    console.error("Web2Zip error:", error);
    reply(`❌ Error: ${error.message.includes("timeout") ? "Request timed out" : "Failed to archive website"}`);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

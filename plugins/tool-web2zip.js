const axios = require("axios");
const { cmd } = require("../command");

// Video Downloader Plugin
cmd({
  pattern: "videodl",
  alias: ["vdl", "downloadvideo"],
  react: '🎬',
  desc: "Download videos from URLs",
  category: "download",
  use: ".videodl <url> or .videodl query",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" ");
    if (!query) return reply('Please provide a URL or search query');

    // Add processing reaction
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let videoUrl = query;
    
    // If it's not a URL, search YouTube
    if (!query.match(/https?:\/\//)) {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const { data } = await axios.get(searchUrl);
      const videoId = data.match(/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1];
      if (!videoId) return reply('No videos found for your query');
      videoUrl = `https://youtube.com/watch?v=${videoId}`;
    }

    // API endpoints
    const apis = [
      `https://kaiz-apis.gleeze.com/api/y2mate?url=${encodeURIComponent(videoUrl)}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`,
      `https://api.nexoracle.com/downloader/aio2?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`
    ];

    let videoData = null;
    
    // Try each API until we get a response
    for (const api of apis) {
      try {
        const response = await axios.get(api);
        if (response.data && (response.data.download_url || response.data.result?.hd_video)) {
          videoData = {
            title: response.data.title || "Downloaded Video",
            thumbnail: response.data.thumbnail,
            url: response.data.download_url || response.data.result?.hd_video,
            duration: response.data.duration
          };
          break;
        }
      } catch (e) {
        console.error(`API error: ${e.message}`);
      }
    }

    if (!videoData) return reply('Failed to download video. Please try another link.');

    await reply(`📥 Downloading: *${videoData.title}* (${videoData.duration || 'N/A'})`);

    const videoResponse = await axios.get(videoData.url, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    await conn.sendMessage(
      from,
      {
        video: videoBuffer,
        caption: `🎬 *${videoData.title}*\n\n⏳ Duration: ${videoData.duration || 'N/A'}\n\n📥 Downloaded via ${config.BOT_NAME}`,
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
    console.error('Video download error:', error);
    reply('❌ Failed to download video. Please try again.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

// Web2Zip Plugin
cmd({
  pattern: "web2zip",
  alias: ["site2zip", "webarchive"],
  react: '🗂️',
  desc: "Convert website to ZIP archive",
  category: "tools",
  use: ".web2zip <url>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const url = args[0];
    if (!url || !url.match(/https?:\/\//)) {
      return reply('Please provide a valid URL (e.g. .web2zip https://google.com)');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://api.giftedtech.web.id/api/tools/web2zip?apikey=gifted&url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.success || !response.data?.result?.download_url) {
      return reply('Failed to archive website. Please try another URL.');
    }

    const { siteUrl, copiedFilesAmount, download_url } = response.data.result;

    await reply(`🗂️ Archiving: *${siteUrl}*\n\n📂 Files: ${copiedFilesAmount}\n\n⬇️ Preparing download...`);

    const zipResponse = await axios.get(download_url, { responseType: 'arraybuffer' });
    const zipBuffer = Buffer.from(zipResponse.data, 'binary');

    await conn.sendMessage(
      from,
      {
        document: zipBuffer,
        fileName: `website_archive_${Date.now()}.zip`,
        mimetype: 'application/zip',
        caption: `🗂️ *Website Archive*\n\n🌐 URL: ${siteUrl}\n📂 Files: ${copiedFilesAmount}\n\n📥 Downloaded via ${config.BOT_NAME}`,
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
    console.error('Web2Zip error:', error);
    reply('❌ Failed to archive website. Please try again.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

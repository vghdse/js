const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "igimagedl",
  alias: ["instagramimages", "igimages","igimage"],
  react: '📥',
  desc: "Download Instagram posts (images or videos).",
  category: "download",
  use: ".igdl <Instagram post URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided an Instagram URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram post URL. Example: `.igdl https://instagram.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://api.fgmods.xyz/api/downloader/igdl?url=${encodeURIComponent(igUrl)}&apikey=E8sfLg9l`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result) {
      return reply('❌ Unable to fetch the post. Please check the URL and try again.');
    }

    // Extract the post details
    const { url, caption, username, like, comment, isVideo } = response.data.result;

    // Inform the user that the post is being downloaded
    await reply(`📥 *Downloading Instagram post by @${username}... Please wait.*`);

    // Download and send each media item
    for (const mediaUrl of url) {
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      if (!mediaResponse.data) {
        return reply('❌ Failed to download the media. Please try again later.');
      }

      const mediaBuffer = Buffer.from(mediaResponse.data, 'binary');

      if (isVideo) {
        // Send as video
        await conn.sendMessage(from, {
          video: mediaBuffer,
          caption: `📥 *Instagram Post*\n\n` +
            `👤 *Username*: @${username}\n` +
            `❤️ *Likes*: ${like}\n` +
            `💬 *Comments*: ${comment}\n` +
            `📝 *Caption*: ${caption || "No caption"}\n\n` +
            `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ`,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363304325601080@newsletter',
              newsletterName: '『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』',
              serverMessageId: 143
            }
          }
        }, { quoted: mek });
      } else {
        // Send as image
        await conn.sendMessage(from, {
          image: mediaBuffer,
          caption: `📥 *Instagram Post*\n\n` +
            `👤 *Username*: @${username}\n` +
            `❤️ *Likes*: ${like}\n` +
            `💬 *Comments*: ${comment}\n` +
            `📝 *Caption*: ${caption || "No caption"}\n\n` +
            `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ`,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363304325601080@newsletter',
              newsletterName: '『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』',
              serverMessageId: 143
            }
          }
        }, { quoted: mek });
      }
    }

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading Instagram post:', error);
    reply('❌ Unable to download the post. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
// VIDEO SECTION

/*
cmd({
  pattern: "igvid",
  alias: ["igvideo","ig","instagram", "igdl"],
  react: '📥',
  desc: "Download Instagram videos.",
  category: "download",
  use: ".igvid <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided an Instagram video URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram video URL. Example: `.igvid https://instagram.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://api.nexoracle.com/downloader/aio2?apikey=free_key@maher_apis&url=${encodeURIComponent(igUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || response.data.status !== 200 || !response.data.result) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    // Extract the video details
    const { title, low, high } = response.data.result;

    // Inform the user that the video is being downloaded
    await reply(`📥 *Downloading ${title || "Instagram video"}... Please wait.*`);

    // Choose the highest quality video URL
    const videoUrl = high || low;

    // Download the video
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send the video
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `📥 *Instagram Video*\n\n` +
        `🔖 *Title*: ${title || "No title"}\n\n` +
        `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363304325601080@newsletter',
          newsletterName: '『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading Instagram video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
*/


cmd({
  pattern: "igvid",
  alias: ["igvideo","ig","instagram", "igdl"],
  react: '📥',
  desc: "Download Instagram videos.",
  category: "download",
  use: ".igvid <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided an Instagram video URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram video URL. Example: `.igvid https://instagram.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the primary API URL
    const primaryApiUrl = `https://api.nexoracle.com/downloader/aio2?apikey=free_key@maher_apis&url=${encodeURIComponent(igUrl)}`;
    
    // Prepare fallback APIs
    const fallbackApis = [
      `https://api.giftedtech.web.id/api/download/instadl?apikey=gifted&url=${encodeURIComponent(igUrl)}`,
      `https://kaiz-apis.gleeze.com/api/insta-dl?url=${encodeURIComponent(igUrl)}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`
    ];

    let videoData = null;
    let apiIndex = 0;
    const apis = [primaryApiUrl, ...fallbackApis];

    // Try each API until we get a successful response
    while (apiIndex < apis.length && !videoData) {
      try {
        const response = await axios.get(apis[apiIndex]);
        
        // Parse response based on which API responded
        if (apiIndex === 0) {
          // Primary API (Nexoracle) response format
          if (response.data && response.data.status === 200 && response.data.result) {
            const { title, low, high } = response.data.result;
            videoData = {
              title: title || "Instagram Video",
              downloadUrl: high || low,
              thumbnail: response.data.result.thumbnail || null
            };
          }
        } else if (apiIndex === 1) {
          // GiftedTech API response format
          if (response.data && response.data.success && response.data.result) {
            videoData = {
              title: "Instagram Video",
              downloadUrl: response.data.result.download_url,
              thumbnail: response.data.result.thumbnail || null
            };
          }
        } else if (apiIndex === 2) {
          // Kaizenji API response format
          if (response.data && response.data.result) {
            videoData = {
              title: response.data.result.title || "Instagram Video",
              downloadUrl: response.data.result.video_url,
              thumbnail: response.data.result.thumbnail || null,
              views: response.data.result.view_count,
              likes: response.data.result.like_count,
              duration: response.data.result.duration
            };
          }
        }
      } catch (error) {
        console.error(`Error with API ${apiIndex}:`, error.message);
      }
      apiIndex++;
    }

    if (!videoData) {
      return reply('❌ All download services failed. Please try again later.');
    }

    // Inform the user that the video is being downloaded
    await reply(`📥 *Downloading ${videoData.title}... Please wait.*`);

    // Download the video
    const videoResponse = await axios.get(videoData.downloadUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Build caption with available details
    let caption = `📥 *Instagram Video*\n\n`;
    caption += `🔖 *Title*: ${videoData.title}\n`;
    if (videoData.views) caption += `👀 *Views*: ${videoData.views.toLocaleString()}\n`;
    if (videoData.likes) caption += `❤️ *Likes*: ${videoData.likes.toLocaleString()}\n`;
    if (videoData.duration) caption += `⏱️ *Duration*: ${videoData.duration} seconds\n`;
    caption += `\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ`;

    // Send the video
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363304325601080@newsletter',
          newsletterName: '『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading Instagram video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

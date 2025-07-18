const { cmd } = require('../command');
const axios = require('axios');
const Config = require('../config');

const API_BASE = 'https://romektricks-subzero-yt.hf.space/yt';

cmd(
  {
    pattern: 'pay',
    alias: ['rome', 'ytdl'],
    desc: 'Download YouTube audio/video using Romek API',
    category: 'media',
    react: '🎬',
    use: '<query or YouTube URL>',
    filename: __filename,
  },
  async (conn, mek, m, { text, reply }) => {
    try {
      if (!text) return reply('🎬 *Usage:* .romeplay <query/url>\nExample: .romeplay lily');

      const res = await axios.get(`${API_BASE}?query=${encodeURIComponent(text)}`, {
        timeout: 10000,
        headers: { 'User-Agent': 'RomekBot/1.0' }
      });

      const data = res?.data?.result;
      if (!res.data.success || !data?.download?.audio || !data?.title) {
        return reply('❌ No valid video found. Try another keyword.');
      }

      const caption =
        `🎵 *${data.title}*\n` +
        `👤 ${data.author.name}\n` +
        `⏱ ${data.duration.timestamp}\n` +
        `👁️ ${data.views.toLocaleString()} views\n` +
        `📅 ${data.ago}\n\n` +
        `🔗 ${data.url}\n\n` +
        `\`Reply with:\`\n` +
        `1 - For Audio 🎧\n` +
        `2 - For Video 🎥\n\n` +
        `> ${Config.FOOTER || "Romek Downloader"}`;

      const thumbnailRes = await axios.get(data.thumbnail, { responseType: 'arraybuffer' }).catch(() => null);
      const thumbnailBuffer = thumbnailRes?.data ? Buffer.from(thumbnailRes.data, 'binary') : null;

      const sentMsg = await conn.sendMessage(mek.chat, {
        image: thumbnailBuffer,
        caption: caption,
        contextInfo: {
          externalAdReply: {
            title: data.title,
            body: 'Choose format below',
            mediaType: 1,
            mediaUrl: data.url,
            thumbnail: thumbnailBuffer,
            sourceUrl: data.url
          }
        }
      }, { quoted: mek });

      const listenerId = `rome_listener_${sentMsg.key.id}`;
      conn.ev.off('messages.upsert', conn[listenerId]);

      conn[listenerId] = async (update) => {
        const msg = update?.messages?.[0];
        if (!msg?.message) return;

        const textInput = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        const isReply = msg.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

        if (!isReply || !['1', '2'].includes(textInput?.trim())) return;
        conn.ev.off('messages.upsert', conn[listenerId]);

        const format = textInput.trim() === '1' ? 'audio' : 'video';
        const downloadUrl = data.download[format];
        const fileExt = format === 'audio' ? 'mp3' : 'mp4';
        const filename = `${data.title.replace(/[<>:"/\\|?*]+/g, '')}.${fileExt}`;

        try {
          await reply(`⬇️ Downloading ${format}...`);

          const fileRes = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            headers: { Referer: data.url },
            timeout: 20000
          });

          const buffer = Buffer.from(fileRes.data, 'binary');
          const fileMsg = {
            [format === 'audio' ? 'audio' : 'video']: buffer,
            mimetype: format === 'audio' ? 'audio/mpeg' : 'video/mp4',
            fileName: filename
          };

          await conn.sendMessage(mek.chat, fileMsg, { quoted: mek });

          // ✅ Reaction
          await conn.sendMessage(mek.chat, { react: { text: "✅", key: msg.key } });

        } catch (err) {
          console.error('Download error:', err);
          await reply('❌ Download failed. Try again later.');
          await conn.sendMessage(mek.chat, { react: { text: "❌", key: msg.key } });
        }
      };

      conn.ev.on('messages.upsert', conn[listenerId]);

      // Auto remove listener after 1 minute
      setTimeout(() => conn.ev.off('messages.upsert', conn[listenerId]), 60 * 1000);

    } catch (err) {
      console.error('Main error:', err);
      reply('❌ Unexpected error: ' + (err.message || 'Try again later.'));
    }
  }
);



/*const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd(
    {
        pattern: 'song2',
        alias: ['music2', 'audio'],
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
*/

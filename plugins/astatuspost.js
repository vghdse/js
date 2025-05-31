const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const Config = require('../config');
/*
// Turbocharged axios with aggressive timeouts
const axiosInstance = axios.create({
  timeout: 5000, // ultra-fast timeout
  maxRedirects: 3
});

cmd(
    {
        pattern: 'song',
        alias: ['play', 'music'],
        desc: '⚡ Ultra-fast YouTube audio downloader',
        category: 'media',
        react: '⚡',
        use: '<query/url> [quality]',
        filename: __filename,
    },
    async (conn, mek, m, { text, reply }) => {
        try {
            // ⚡ Ultra-fast input validation
            if (!text) return reply('⚡ *Usage:* .song <query/url> [quality]\nExample: .song https://youtu.be/ox4tmEV6-QU');

            // ⚡ Parallel processing - get quality while fetching video
            const [input, quality = '128'] = text.split(' ');
            const validQuality = ['92', '128', '256', '320'].includes(quality) ? quality : '128';

            // ⚡ Instant visual feedback
            if (mek?.key?.id) await conn.sendMessage(mek.chat, { react: { text: "⚡", key: mek.key } }).catch(() => {});

            // ⚡ Turbo search - parallelize URL and metadata fetch
            let videoUrl, videoInfo, searchPromise, metadataPromise;
            
            if (input.match(/youtu\.?be/)) {
                videoUrl = input;
                const videoId = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1];
                if (videoId) metadataPromise = yts({ videoId });
            } else {
                searchPromise = yts(input);
            }

            // ⚡ While waiting for search, start preparing download
            const [[searchResults], [videoData]] = await Promise.allSettled([
                searchPromise ? [searchPromise] : [Promise.resolve(null)],
                [metadataPromise ? metadataPromise : Promise.resolve(null)]
            ]);

            if (searchResults?.value?.videos?.length) {
                videoUrl = searchResults.value.videos[0].url;
                videoInfo = searchResults.value.videos[0];
            } else if (!videoUrl) {
                return reply('⚡ No results found!');
            }

            // ⚡ Pre-fetch EVERYTHING while showing user the options
            const turboLoad = await Promise.allSettled([
                // 1. Start API download immediately
                axiosInstance.get(`https://mrfrank-api.vercel.app/api/ytmp3dl?url=${encodeURIComponent(videoUrl)}&quality=${validQuality}`),
                
                // 2. Get thumbnail in parallel
                (async () => {
                    const thumbUrl = videoInfo?.thumbnail || `https://i.ytimg.com/vi/${videoUrl.split('v=')[1]}/hqdefault.jpg`;
                    try {
                        const response = await axiosInstance.get(thumbUrl, { responseType: 'arraybuffer' });
                        return Buffer.from(response.data, 'binary');
                    } catch {
                        return null;
                    }
                })()
            ]);

            const [apiResponse, thumbnailResult] = turboLoad;
            
            if (!apiResponse.value?.data?.status) {
                return reply('⚡ Download engine failed! Try again');
            }

            const songData = apiResponse.value.data;
            const thumbnailBuffer = thumbnailResult.value;

            // ⚡ Show metadata IMMEDIATELY while everything loads in background
            const songInfo = `⚡ *${videoInfo?.title || songData.metadata.title}*\n` +
                            `⏱ ${videoInfo?.timestamp || songData.metadata.timestamp || 'N/A'}\n` +
                            `💿 Quality: ${songData.download.quality}\n\n` +
                            `⚡ *REPLY WITH:*\n` +
                            `1 - Audio (${songData.download.filesize})\n` +
                            `2 - Document\n\n` +
                            `_Pre-loaded and ready for instant delivery!_`;

            const sentMsg = await conn.sendMessage(mek.chat, {
                image: thumbnailBuffer,
                caption: songInfo,
                contextInfo: {
                    externalAdReply: {
                        title: '⚡ READY FOR INSTANT DOWNLOAD',
                        thumbnail: thumbnailBuffer,
                        mediaType: 1
                    }
                }
            }, { quoted: mek });

            // ⚡ PRE-LOAD the audio while user decides
            const audioBufferPromise = axiosInstance.get(songData.download.url, {
                responseType: 'arraybuffer',
                headers: { Referer: 'https://www.youtube.com/' }
            }).then(res => Buffer.from(res.data, 'binary'));

            // ⚡ Turbo response system
            const turboListener = async (messageUpdate) => {
                const msg = messageUpdate.messages[0];
                if (!msg?.message || !['1', '2'].includes(msg.message.conversation)) return;

                // ⚡ Verify it's a reply to our message
                if (msg.message.extendedTextMessage?.contextInfo?.stanzaId !== sentMsg.key.id) return;

                // ⚡ KILL LISTENER immediately
                conn.ev.off('messages.upsert', turboListener);
                clearTimeout(timeout);

                // ⚡ AUDIO IS ALREADY LOADED - send instantly!
                const audioBuffer = await audioBufferPromise;
                const fileName = `${videoInfo?.title || songData.metadata.title}.mp3`.replace(/[<>:"\/\\|?*]+/g, '');

                try {
                    if (msg.message.conversation === '1') {
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
                    
                    await conn.sendMessage(mek.chat, { react: { text: "✅", key: msg.key } });
                } catch (e) {
                    console.error('Turbo send failed:', e);
                }
            };

            // ⚡ 45-second timeout (users are slow)
            const timeout = setTimeout(() => {
                conn.ev.off('messages.upsert', turboListener);
                reply('⚡ Session expired - command again for fresh results');
            }, 45000);

            conn.ev.on('messages.upsert', turboListener);

        } catch (error) {
            console.error('Turbo error:', error);
            try {
                if (mek?.key?.id) await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
                reply('⚡ System overload! Try again in a moment');
            } catch (e) {}
        }
    }
);
*/
cmd({
  pattern: "post",
  alias: ["poststatus", "story", "meqdia"],
  react: '📝',
  desc: "Posts replied media to bot's status",
  category: "utility",
  filename: __filename
}, async (client, message, match, extras) => {
  try {
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType) {
      return await client.sendMessage(message.chat, {
        text: "*❌ Please reply to an image, video, or audio file.*"
      }, { quoted: message });
    }

    const buffer = await quotedMsg.download();
    const mtype = quotedMsg.mtype;
    const caption = quotedMsg.text || '';

    let statusContent = {};

    switch (mtype) {
      case "imageMessage":
        statusContent = {
          image: buffer,
          caption: caption
        };
        break;
      case "videoMessage":
        statusContent = {
          video: buffer,
          caption: caption
        };
        break;
      case "audioMessage":
        statusContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quotedMsg.ptt || false
        };
        break;
      default:
        return await client.sendMessage(message.chat, {
          text: "❌ Only image, video, and audio files can be posted to status."
        }, { quoted: message });
    }

    await client.sendMessage("status@broadcast", statusContent);

    await client.sendMessage(message.chat, {
      text: "✅ Media posted to my status successfully."
    }, { quoted: message });

  } catch (error) {
    console.error("Status Error:", error);
    await client.sendMessage(message.chat, {
      text: "❌ Failed to post status:\n" + error.message
    }, { quoted: message });
  }
});

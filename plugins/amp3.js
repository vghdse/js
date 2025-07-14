const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const Config = require('../config');

// Optimized axios instance with faster timeouts
const axiosInstance = axios.create({
  timeout: 8000, // Reduced from 15s to 8s
  maxRedirects: 3, // Reduced from 5
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Encoding': 'gzip' // Enable compression for faster responses
  }
});

// Kaiz-API configuration
const KAIZ_API_KEY = 'cf2ca612-296f-45ba-abbc-473f18f991eb';
const KAIZ_API_URL = 'https://kaiz-apis.gleeze.com/api/ytdown-mp3';

// Cache for search results to avoid duplicate API calls
const searchCache = new Map();
const CACHE_TTL = 30000; // 30 seconds cache lifetime

cmd(
    {
        pattern: 'so',
        alias: ['pl', 'music'],
        desc: 'High quality YouTube audio downloader',
        category: 'media',
        react: '🎵',
        use: '<YouTube URL or search query>',
        filename: __filename,
    },
    async (conn, mek, m, { text, reply }) => {
        try {
            if (!text) return reply('🎵 *Usage:* .song <query/url>\nExample: .song https://youtu.be/ox4tmEV6-QU\n.song "Alan Walker Lily"');

            // Send initial reaction immediately
            const reactionPromise = mek?.key?.id ? 
                conn.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } }) 
                : Promise.resolve();

            // Get video information
            let videoUrl, videoInfo;
            const isYtUrl = text.match(/(youtube\.com|youtu\.be)/i);
            
            if (isYtUrl) {
                // Handle YouTube URL - faster direct processing
                const videoId = text.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
                if (!videoId) return reply('❌ Invalid YouTube URL format');
                
                videoUrl = `https://youtu.be/${videoId}`;
                
                // Parallelize API calls where possible
                const [ytSearchResult] = await Promise.all([
                    yts({ videoId }).catch(() => null),
                    reactionPromise
                ]);
                
                videoInfo = ytSearchResult;
            } else {
                // Handle search query with improved precision
                try {
                    // Check cache first
                    const cacheKey = text.toLowerCase().trim();
                    const cachedResult = searchCache.get(cacheKey);
                    
                    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
                        videoInfo = cachedResult.data;
                        videoUrl = videoInfo.url;
                    } else {
                        // Use more precise search parameters
                        const searchOptions = {
                            query: text,
                            pageStart: 1,
                            pageEnd: 1, // Only first page for speed
                            category: 'music' // Focus on music results
                        };
                        
                        const [searchResults] = await Promise.all([
                            yts(searchOptions),
                            reactionPromise
                        ]);
                        
                        if (!searchResults?.videos?.length) {
                            return reply('❌ No results found. Try different keywords or use exact title in quotes.');
                        }

                        // Improved result filtering
                        const validVideos = searchResults.videos.filter(v => {
                            // Exclude live streams, shorts, and very long videos
                            if (v.live || v.seconds > 3600 || v.url.includes('/shorts')) return false;
                            
                            // Check if title closely matches search query
                            const queryWords = text.toLowerCase().split(/\s+/);
                            const titleWords = v.title.toLowerCase().split(/\s+/);
                            const matchScore = queryWords.filter(q => 
                                titleWords.some(t => t.includes(q))
                                .length / queryWords.length;
                            
                            return matchScore > 0.7; // Require 70% match
                        });

                        if (!validVideos.length) {
                            return reply('❌ No good matches found. Try being more specific or use exact title in quotes.');
                        }

                        // Select best match based on views and upload date
                        videoInfo = validVideos.reduce((best, current) => 
                            (current.views > best.views && 
                             (!current.ago.includes('year') || best.ago.includes('year')) ? 
                            current : best
                        );
                        
                        videoUrl = videoInfo.url;
                        
                        // Cache the result
                        searchCache.set(cacheKey, {
                            data: videoInfo,
                            timestamp: Date.now()
                        });
                    }

                    console.log('Selected video:', {
                        title: videoInfo.title,
                        duration: videoInfo.timestamp,
                        views: videoInfo.views.toLocaleString(),
                        url: videoInfo.url,
                        match: `${Math.round((text.toLowerCase().split(/\s+/).filter(q => 
                            videoInfo.title.toLowerCase().includes(q)).length / 
                            text.split(/\s+/).length) * 100)}%`
                    });
                } catch (searchError) {
                    console.error('Search error:', searchError);
                    return reply('❌ Search failed. Please try again with different keywords.');
                }
            }

            // Start download process while we prepare the info message
            const downloadPromise = axiosInstance.get(
                `${KAIZ_API_URL}?url=${encodeURIComponent(videoUrl)}&apikey=${KAIZ_API_KEY}`, 
                { timeout: 5000 }
            ).catch(() => null);

            // Get thumbnail in parallel with API call
            const thumbnailPromise = videoInfo?.thumbnail ? 
                axiosInstance.get(videoInfo.thumbnail, { 
                    responseType: 'arraybuffer',
                    timeout: 3000 // Faster timeout for thumbnails
                }).then(res => Buffer.from(res.data, 'binary')).catch(() => null) 
                : Promise.resolve(null);

            const [songData, thumbnailBuffer] = await Promise.all([
                downloadPromise,
                thumbnailPromise
            ]);

            if (!songData?.data?.download_url) {
                return reply('❌ Audio download failed. The service might be temporarily unavailable.');
            }

            // Prepare song information message
            const songInfo = `🎧 *${songData.data.title || videoInfo?.title || 'Unknown Title'}*\n` +
                            `⏱ ${videoInfo?.timestamp || 'N/A'}\n` +
                            `👤 ${videoInfo?.author?.name || 'Unknown Artist'}\n` +
                            `👀 ${(videoInfo?.views || 'N/A').toLocaleString()} views\n\n` +
                            `🔗 ${videoUrl}\n\n` +
                            `\`Reply with:\`\n` +
                            `1 - For Audio Format 🎵\n` +
                            `2 - For Document Format 📁\n\n` +
                            `> ${Config.FOOTER}`;

            // Send song info with thumbnail
            const sentMsg = await conn.sendMessage(mek.chat, {
                image: thumbnailBuffer,
                caption: songInfo,
                contextInfo: {
                    externalAdReply: {
                        title: songData.data.title || videoInfo?.title || 'YouTube Audio',
                        body: `Duration: ${videoInfo?.timestamp || 'N/A'}`,
                        thumbnail: thumbnailBuffer,
                        mediaType: 1,
                        mediaUrl: videoUrl,
                        sourceUrl: videoUrl
                    }
                }
            }, { quoted: mek });

            // Set up response listener with faster timeout
            const timeout = setTimeout(() => {
                conn.ev.off('messages.upsert', messageListener);
                reply("⌛ Session timed out. Please use the command again if needed.");
            }, 45000); // Reduced from 60s to 45s

            const messageListener = async (messageUpdate) => {
                try {
                    const mekInfo = messageUpdate?.messages[0];
                    if (!mekInfo?.message) return;

                    const message = mekInfo.message;
                    const messageType = message.conversation || message.extendedTextMessage?.text;
                    const isReplyToSentMsg = message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

                    if (!isReplyToSentMsg || !['1', '2'].includes(messageType?.trim())) return;

                    // Clean up listener and timeout
                    conn.ev.off('messages.upsert', messageListener);
                    clearTimeout(timeout);

                    await reply("⏳ Downloading your audio...");

                    // Download audio with progress indicator
                    const audioResponse = await axiosInstance.get(songData.data.download_url, {
                        responseType: 'arraybuffer',
                        headers: { 
                            Referer: 'https://www.youtube.com/',
                            'Accept-Encoding': 'identity'
                        },
                        timeout: 15000,
                        onDownloadProgress: progressEvent => {
                            if (progressEvent.loaded > 0 && progressEvent.total) {
                                const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                if (percent % 25 === 0) { // Update at 25% intervals
                                    reply(`⬇️ Downloading... ${percent}%`);
                                }
                            }
                        }
                    });

                    const audioBuffer = Buffer.from(audioResponse.data, 'binary');
                    const fileName = `${(songData.data.title || videoInfo?.title || 'audio')
                        .replace(/[<>:"\/\\|?*]+/g, '')
                        .substring(0, 64)}.mp3`; // Limit filename length

                    // Send audio based on user choice
                    const sendPromise = messageType.trim() === "1" ?
                        conn.sendMessage(mek.chat, {
                            audio: audioBuffer,
                            mimetype: 'audio/mpeg',
                            fileName: fileName,
                            ptt: false
                        }, { quoted: mek }) :
                        conn.sendMessage(mek.chat, {
                            document: audioBuffer,
                            mimetype: 'audio/mpeg',
                            fileName: fileName
                        }, { quoted: mek });

                    await Promise.all([
                        sendPromise,
                        mekInfo?.key?.id ? 
                            conn.sendMessage(mek.chat, { react: { text: "✅", key: mekInfo.key } }) 
                            : Promise.resolve()
                    ]);

                } catch (error) {
                    console.error('Download error:', error);
                    await reply('❌ Download failed: ' + (error.message || 'Network error'));
                    try {
                        if (mek?.key?.id) {
                            await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
                        }
                    } catch (reactError) {
                        console.error('Error reaction failed:', reactError);
                    }
                }
            };

            conn.ev.on('messages.upsert', messageListener);

        } catch (error) {
            console.error('Main error:', error);
            reply('❌ An unexpected error occurred: ' + (error.message || 'Please try again later'));
            try {
                if (mek?.key?.id) {
                    await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
                }
            } catch (reactError) {
                console.error('Final reaction failed:', reactError);
            }
        }
    }

  
);


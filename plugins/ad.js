const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'https://api.arabdullah.top/api';
const API_KEY = 'AIzaSyB16u905w4V702Xvq81i0b2J9iX43mR85c'; // Note: This should ideally be in config

cmd({
    pattern: 'dd',
    alias: ['music', 'mp3'],
    desc: 'Download high quality MP3 from YouTube',
    category: 'media',
    react: '🎵',
    filename: __filename
}, async (conn, mek, m, { from, reply, args, text }) => {
    try {
        // Check if query is provided
        if (!text && !m.quoted?.text) {
            return reply('Please provide a YouTube URL or search query!\nExample: .song https://youtu.be/... or .song baby shark');
        }

        const query = text || m.quoted.text;
        
        // Show processing message
        await reply('🔍 Searching for music... Please wait...');

        // Check if it's a URL or search term
        const isUrl = isValidYouTubeUrl(query);
        
        let videoUrl = query;
        if (!isUrl) {
            // Search for video first
            const searchResults = await searchYouTube(query);
            if (!searchResults?.items?.length) {
                return reply('❌ No results found for your search!');
            }
            videoUrl = `https://youtu.be/${searchResults.items[0].id.videoId}`;
        }

        // Fetch audio download links
        const audioData = await fetchAudioData(videoUrl);
        
        if (!audioData?.availableFormats?.length) {
            return reply('❌ No audio formats available for this video!');
        }

        // Get the highest quality audio
        const bestAudio = audioData.availableFormats.reduce((prev, current) => 
            (parseInt(current.bitrate) > parseInt(prev.bitrate)) ? current : prev
        );

        // Send the audio file
        await conn.sendMessage(from, {
            audio: { url: bestAudio.url },
            mimetype: 'audio/mpeg',
            fileName: `${audioData.title}.mp3`.replace(/[^\w\s.-]/gi, ''),
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        // Additional info
        await reply(`✅ *${audioData.title}*\n\n🎤 Duration: ${audioData.duration}\n💽 Quality: ${bestAudio.bitrate}kbps`);

    } catch (error) {
        console.error('Song download error:', error);
        reply('❌ Failed to download song. Please try again later.');
    }
});

cmd({
    pattern: 'ddv',
    alias: ['ytdl', 'mp4'],
    desc: 'Download high quality MP4 from YouTube',
    category: 'media',
    react: '🎬',
    filename: __filename
}, async (conn, mek, m, { from, reply, args, text }) => {
    try {
        // Check if query is provided
        if (!text && !m.quoted?.text) {
            return reply('Please provide a YouTube URL or search query!\nExample: .video https://youtu.be/... or .video baby shark');
        }

        const query = text || m.quoted.text;
        
        // Show processing message
        await reply('🔍 Searching for video... Please wait...');

        // Check if it's a URL or search term
        const isUrl = isValidYouTubeUrl(query);
        
        let videoUrl = query;
        if (!isUrl) {
            // Search for video first
            const searchResults = await searchYouTube(query);
            if (!searchResults?.items?.length) {
                return reply('❌ No results found for your search!');
            }
            videoUrl = `https://youtu.be/${searchResults.items[0].id.videoId}`;
        }

        // Fetch video download links
        const videoData = await fetchVideoData(videoUrl);
        
        if (!videoData?.availableFormats?.length) {
            return reply('❌ No video formats available for this video!');
        }

        // Get the best quality video (720p or highest available)
        let bestVideo = videoData.availableFormats[0];
        for (const format of videoData.availableFormats) {
            if (format.resolution === '720p') {
                bestVideo = format;
                break;
            }
            if (parseInt(format.resolution) > parseInt(bestVideo.resolution || '0')) {
                bestVideo = format;
            }
        }

        // Send the video file
        await conn.sendMessage(from, {
            video: { url: bestVideo.url },
            mimetype: 'video/mp4',
            fileName: `${videoData.title}.mp4`.replace(/[^\w\s.-]/gi, ''),
            caption: `🎥 *${videoData.title}*\n\n⏳ Duration: ${videoData.duration}\n📺 Quality: ${bestVideo.resolution}`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('Video download error:', error);
        reply('❌ Failed to download video. Please try again later.');
    }
});

// Helper functions
function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+(\S+)?$/;
    return youtubeRegex.test(url);
}

async function searchYouTube(query) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${API_KEY}`;
    const response = await axios.get(searchUrl);
    return response.data;
}

async function fetchAudioData(url) {
    const apiUrl = `${API_BASE_URL}/ytmp3?url=${encodeURIComponent(url)}&apiKey=${API_KEY}`;
    const response = await axios.get(apiUrl);
    return response.data;
}

async function fetchVideoData(url) {
    const apiUrl = `${API_BASE_URL}/ytmp4?url=${encodeURIComponent(url)}&apiKey=${API_KEY}`;
    const response = await axios.get(apiUrl);
    return response.data;
}

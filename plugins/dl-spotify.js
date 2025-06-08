const { cmd } = require('../command');
const axios = require('axios');
const Config = require('../config');

// API Configuration
const API = {
  baseUrl: 'https://kaiz-apis.gleeze.com/api',
  apikey: 'cf2ca612-296f-45ba-abbc-473f18f991eb'
};

// Axios instance
const axiosInstance = axios.create({ 
  timeout: 15000,
  headers: { 'User-Agent': 'WhatsAppBot/1.0' }
});

// Helper function for API requests
async function fetchAPI(endpoint, params) {
  const url = `${API.baseUrl}/${endpoint}?${new URLSearchParams(params)}&apikey=${API.apikey}`;
  const response = await axiosInstance.get(url);
  return response.data;
}

cmd({
    pattern: 'spotify2',
    alias: ['spotifydl2', 'spdl3'],
    desc: 'Download Spotify tracks (supports URL or search)',
    category: 'media',
    react: '🎧',
    use: '<URL or search query>',
    filename: __filename
}, async (conn, mek, m, { text, reply }) => {
    try {
        if (!text) return reply('🎧 *Usage:* .spotify <URL or search query>\nExample:\n.spotify https://open.spotify.com/track/0lks2Kt9veMOFEAPN0fsqN\n.spotify Lily Alan Walker');

        // Check if input is a Spotify URL
        const isUrl = text.match(/open\.spotify\.com\/track\/|spotify:track:/);
        
        if (isUrl) {
            // Direct URL download
            const data = await fetchAPI('spotify-down', { url: text });
            
            await conn.sendMessage(m.chat, {
                audio: { url: data.url },
                mimetype: 'audio/mpeg',
                fileName: `${data.title}.mp3`.replace(/[<>:"\/\\|?*]+/g, ''),
                caption: `🎧 *${data.title}*\n👤 ${data.artist}\n\n> ${Config.FOOTER}`
            }, { quoted: mek });
            
        } else {
            // Search functionality - automatically download top result
            const searchData = await fetchAPI('spotify-search', { q: text });
            
            if (!searchData || !searchData.length) {
                return reply('❌ No results found for your search');
            }

            // Get top result
            const topResult = searchData[0];
            
            // Show searching message
            await reply(`⏳ Downloading *${topResult.title}*...`);

            // Download the track
            const dlData = await fetchAPI('spotify-down', { url: topResult.trackUrl });
            
            await conn.sendMessage(m.chat, {
                audio: { url: dlData.url },
                mimetype: 'audio/mpeg',
                fileName: `${dlData.title}.mp3`.replace(/[<>:"\/\\|?*]+/g, ''),
                caption: `🎧 *${dlData.title}*\n👤 ${dlData.artist}\n⏱ ${topResult.duration} | 📅 ${topResult.release_date}\n\n> ${Config.FOOTER}`
            }, { quoted: mek });

            // Show additional search results for reference
        /*    if (searchData.length > 1) {
                let otherResults = '\n🔎 *Other Results:*\n';
                searchData.slice(1, 4).forEach((track, index) => {
                    otherResults += `${index + 2}. *${track.title}* - ${track.author}\n`;
                });
                otherResults += `\nUse exact URL for specific tracks\n> ${Config.FOOTER}`;
                await reply(otherResults);
            }
        }
        */
    } catch (error) {
        console.error('Spotify command error:', error);
        reply('❌ Error: ' + (error.message || 'Failed to process your request'));
    }
});

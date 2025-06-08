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
    alias: ['spotifydl2', 'spdl2'],
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
            
            // Get metadata from search API for better info
            let metadata;
            try {
                const searchData = await fetchAPI('spotify-search', { q: data.title });
                metadata = searchData.find(track => track.trackUrl.includes(data.url.split('/').pop()));
            } catch (e) {
                console.log('Failed to fetch additional metadata', e);
            }
            
            await conn.sendMessage(m.chat, {
                audio: { url: data.url },
                mimetype: 'audio/mpeg',
                fileName: `${data.title}.mp3`.replace(/[<>:"\/\\|?*]+/g, ''),
                caption: `🎧 *${data.title}*\n👤 ${data.artist}\n${metadata ? `📅 ${metadata.release_date} | ⏱ ${metadata.duration}\n` : ''}\n> ${Config.FOOTER}`
            }, { quoted: mek });
            
        } else {
            // Search functionality
            const searchData = await fetchAPI('spotify-search', { q: text });
            
            if (!searchData || !searchData.length) {
                return reply('❌ No results found for your search');
            }
            
            // Display search results
            let resultsText = '🎧 *Spotify Search Results*\n\n';
            searchData.slice(0, 5).forEach((track, index) => {
                resultsText += `${index + 1}. *${track.title}* - ${track.author}\n`;
                resultsText += `   ⏱ ${track.duration} | 📅 ${track.release_date}\n`;
                resultsText += `   🔗 ${track.trackUrl}\n\n`;
            });
            
            resultsText += `\nReply with the number to download (1-5)\n> ${Config.FOOTER}`;
            
            const sentMsg = await reply(resultsText);
            
            // Set up listener for user selection
            const listener = async (messageUpdate) => {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message || mekInfo.key.remoteJid !== m.chat) return;
                
                const selection = mekInfo.message.conversation?.match(/^[1-5]$/)?.[0];
                if (!selection) return;
                
                // Remove listener
                conn.ev.off('messages.upsert', listener);
                
                const selectedTrack = searchData[parseInt(selection) - 1];
                if (!selectedTrack) return;
                
                try {
                    // Download the selected track
                    const dlData = await fetchAPI('spotify-down', { url: selectedTrack.trackUrl });
                    
                    await conn.sendMessage(m.chat, {
                        audio: { url: dlData.url },
                        mimetype: 'audio/mpeg',
                        fileName: `${dlData.title}.mp3`.replace(/[<>:"\/\\|?*]+/g, ''),
                        caption: `🎧 *${dlData.title}*\n👤 ${dlData.artist}\n⏱ ${selectedTrack.duration} | 📅 ${selectedTrack.release_date}\n\n> ${Config.FOOTER}`
                    }, { quoted: mek });
                    
                } catch (error) {
                    reply('❌ Failed to download track: ' + (error.message || 'Please try again'));
                }
            };
            
            // Set timeout for listener (1 minute)
            setTimeout(() => {
                conn.ev.off('messages.upsert', listener);
            }, 60000);
            
            conn.ev.on('messages.upsert', listener);
        }
        
    } catch (error) {
        console.error('Spotify command error:', error);
        reply('❌ Error: ' + (error.message || 'Failed to process your request'));
    }
});

const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'install',
  alias: ['addplugin'],
  react: '📥',
  desc: 'Install plugins from Gist URLs',
  category: 'plugin',
  filename: __filename,
  use: '<gist_url>',
  owner: true
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply(`❌ Please provide a Gist URL\nExample: *${config.PREFIX}install https://gist.github.com/username/gistid*`);

    const url = args[0];
    const gistId = url.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/)?.[1];
    if (!gistId) return reply('❌ Invalid Gist URL format');

    // Fetch Gist data
    const { data } = await axios.get(`https://api.github.com/gists/${gistId}`);
    
    // Find first JavaScript file
    const jsFile = Object.values(data.files).find(f => f.filename.endsWith('.js'));
    if (!jsFile) return reply('❌ No JavaScript file found in Gist');

    // Create plugins directory if it doesn't exist
    const pluginsDir = path.join(__dirname, '..', 'plugins');
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir);
    }

    // Save the file
    const pluginPath = path.join(pluginsDir, jsFile.filename);
    await fs.promises.writeFile(pluginPath, jsFile.content);
    
    reply(`✅ Plugin *${jsFile.filename}* installed successfully!\n\nUse *${config.PREFIX}restart* to load it`);

  } catch (error) {
    console.error('Install error:', error);
    reply(`❌ Failed to install plugin:\n${error.message}\n\nMake sure:\n1. Gist exists and is public\n2. URL is correct`);
  }
});

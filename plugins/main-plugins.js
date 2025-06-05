const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getBuffer } = require('../lib/functions');

cmd({
  pattern: 'install',
  alias: ['addplugin'],
  react: '📥',
  desc: 'Install plugins from GitHub Gist or raw URLs',
  category: 'plugin',
  filename: __filename,
  use: '<gist_url|raw_url>'
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply(`❌ Please provide a plugin URL\n\nExample:\n*${config.PREFIX}install https://gist.github.com/...*\n*${config.PREFIX}install https://raw.githubusercontent.com/.../plugin.js*`);

    const url = args[0];
    let pluginContent, pluginName;

    // Handle GitHub Gist URLs
    if (url.includes('gist.github.com')) {
      const gistId = url.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/)?.[1];
      if (!gistId) return reply('❌ Invalid Gist URL format. Example: https://gist.github.com/username/gistid');

      const gistUrl = `https://api.github.com/gists/${gistId}`;
      const { data } = await axios.get(gistUrl);
      
      if (!data?.files) return reply('❌ No files found in this Gist');
      if (Object.keys(data.files).length > 1) return reply('⚠️ Gist contains multiple files. Using the first JS file found.');

      const firstFile = Object.values(data.files).find(file => file.filename.endsWith('.js'));
      if (!firstFile) return reply('❌ No .js files found in this Gist');
      
      pluginContent = firstFile.content;
      pluginName = firstFile.filename;
    } 
    // Handle GitHub raw content and direct URLs
    else {
      if (!url.endsWith('.js')) return reply('❌ URL must point to a .js file');
      
      pluginName = path.basename(url);
      const { data } = await axios.get(url);
      pluginContent = data;
    }

    // Validate plugin name
    if (!pluginName.endsWith('.js')) pluginName += '.js';
    if (pluginName.includes(' ')) pluginName = pluginName.replace(/\s+/g, '_');

    // Check if plugin exists
    const pluginPath = path.join(__dirname, '..', 'plugins', pluginName);
    if (fs.existsSync(pluginPath)) {
      return reply(`⚠️ Plugin "${pluginName}" already exists!\nUse *${config.PREFIX}updateplugin ${pluginName}* to update it`);
    }

    // Validate plugin structure before saving
    if (!isValidPlugin(pluginContent)) {
      return reply(`❌ Invalid plugin format. Plugins must:\n1. Export a handler function\n2. Include cmd() or similar registration\n3. Not contain malicious code`);
    }

    // Save the plugin
    await fs.promises.writeFile(pluginPath, pluginContent);
    
    reply(`✅ Successfully installed plugin: ${pluginName}\n\nType *${config.PREFIX}restart* to load the new plugin`);

  } catch (error) {
    console.error('Plugin install error:', error);
    reply(`❌ Failed to install plugin:\n${error.message}\n\nMake sure:\n1. URL is correct\n2. File is accessible\n3. Content is valid plugin code`);
  }
});

// Improved plugin validation
function isValidPlugin(content) {
  try {
    // Basic checks
    if (!content.includes('cmd(') && 
        !content.includes('handler =') && 
        !content.includes('export default')) {
      return false;
    }

    // Check for required structures
    const hasHandler = content.includes('handler =') || content.includes('export default');
    const hasCommand = content.includes('cmd(') || content.includes('handler.command');
    
    return hasHandler && hasCommand;
  } catch {
    return false;
  }
}

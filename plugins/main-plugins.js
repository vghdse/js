const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'install',
  alias: ['addplugin'],
  react: '📥',
  desc: 'Install SubZero plugins from URLs',
  category: 'plugin',
  filename: __filename,
  use: '<url>',
  owner: true
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply(`❌ Please provide a plugin URL\n\nExample:\n*${config.PREFIX}install https://gist.github.com/...*\n*${config.PREFIX}install https://raw.githubusercontent.com/.../plugin.js*`);

    const url = args[0];
    let pluginContent, pluginName;

    // Download the plugin content
    if (url.includes('gist.github.com')) {
      // Handle GitHub Gists
      const gistId = url.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/)?.[1];
      if (!gistId) return reply('❌ Invalid Gist URL format');

      const { data } = await axios.get(`https://api.github.com/gists/${gistId}`);
      const firstFile = Object.values(data.files).find(f => f.filename.endsWith('.js'));
      if (!firstFile) return reply('❌ No JavaScript file found in Gist');
      
      pluginContent = firstFile.content;
      pluginName = firstFile.filename;
    } else {
      // Handle direct URLs
      if (!url.endsWith('.js')) return reply('❌ URL must point to a .js file');
      
      pluginName = path.basename(url);
      const { data } = await axios.get(url);
      pluginContent = data;
    }

    // Validate plugin name
    if (!pluginName.endsWith('.js')) pluginName += '.js';
    pluginName = pluginName.replace(/\s+/g, '_');

    // Validate plugin structure
    if (!isValidSubzeroPlugin(pluginContent)) {
      return reply(`❌ Invalid SubZero plugin format. Must contain:\n1. const { cmd } = require()\n2. cmd({...}) pattern\n3. Async handler function`);
    }

    // Save to plugins directory
    const pluginPath = path.join(__dirname, '..', 'plugins', pluginName);
    await fs.promises.writeFile(pluginPath, pluginContent);
    
    reply(`✅ Plugin *${pluginName}* installed successfully!\n\nUse *${config.PREFIX}restart* to load it`);

  } catch (error) {
    console.error('Install error:', error);
    reply(`❌ Failed to install plugin:\n${error.message}`);
  }
});

// Specialized validator for SubZero plugins
function isValidSubzeroPlugin(content) {
  const requiredPatterns = [
    /const\s*{\s*cmd\s*}\s*=\s*require\(['"]\.\.\/command['"]\)/,
    /cmd\({[\s\S]*?pattern:\s*["'].+?["']/,
    /async\s*\(conn,\s*mek,\s*m,\s*{.*?}\)\s*=>\s*{/,
    /filename:\s*__filename/
  ];

  return requiredPatterns.every(pattern => pattern.test(content));
}

cmd({
  pattern: 'pluginlist',
  alias: ['listplugins'],
  desc: 'List installed plugins',
  category: 'plugin',
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pluginsDir = path.join(__dirname, '..', 'plugins');
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    
    if (!files.length) return reply('No plugins installed');
    
    let msg = '📋 *Installed Plugins*:\n\n';
    files.forEach((file, i) => {
      msg += `${i+1}. ${file}\n`;
    });
    
    msg += `\nTotal: ${files.length} plugins`;
    reply(msg);
  } catch (error) {
    reply('❌ Failed to list plugins');
  }
});

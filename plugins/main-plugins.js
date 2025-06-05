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
    if (!args[0]) return reply('❌ Please provide a plugin URL\n\nExample:\n.install https://gist.github.com/...\n.install https://raw.githubusercontent.com/.../plugin.js');

    const url = args[0];
    let pluginContent, pluginName;

    // Handle GitHub Gist URLs
    if (url.includes('gist.github.com')) {
      const gistId = url.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/)?.[1];
      if (!gistId) return reply('❌ Invalid Gist URL format');

      const gistUrl = `https://api.github.com/gists/${gistId}`;
      const { data } = await axios.get(gistUrl);
      
      if (!data?.files) return reply('❌ No files found in this Gist');

      const firstFile = Object.values(data.files)[0];
      pluginContent = firstFile.content;
      pluginName = firstFile.filename;
    } 
    // Handle GitHub raw content URLs
    else if (url.includes('raw.githubusercontent.com')) {
      pluginName = path.basename(url);
      const { data } = await axios.get(url);
      pluginContent = data;
    }
    // Handle direct JS file URLs
    else if (url.endsWith('.js')) {
      pluginName = path.basename(url);
      const { data } = await axios.get(url);
      pluginContent = data;
    } else {
      return reply('❌ Unsupported URL type. Provide either:\n- GitHub Gist URL\n- GitHub raw content URL\n- Direct JS file URL');
    }

    // Validate plugin name
    if (!pluginName.endsWith('.js')) {
      pluginName += '.js';
    }

    // Check if plugin exists
    const pluginPath = path.join(__dirname, '..', 'plugins', pluginName);
    if (fs.existsSync(pluginPath)) {
      return reply(`⚠️ Plugin "${pluginName}" already exists!\nUse *.updateplugin ${pluginName}* to update it`);
    }

    // Save the plugin
    await fs.promises.writeFile(pluginPath, pluginContent);
    
    // Verify the plugin
    try {
      const plugin = require(pluginPath);
      if (plugin?.handler) {
        reply(`✅ Successfully installed plugin: ${pluginName}\n\nType *.restart* to load the new plugin`);
      } else {
        fs.unlinkSync(pluginPath); // Remove invalid plugin
        reply('❌ Invalid plugin format - missing handler function');
      }
    } catch (e) {
      fs.unlinkSync(pluginPath); // Remove invalid plugin
      reply(`❌ Plugin installation failed:\n${e.message}`);
    }

  } catch (error) {
    console.error('Plugin install error:', error);
    reply(`❌ Failed to install plugin:\n${error.message}`);
  }
});

cmd({
  pattern: 'updateplugin',
  alias: ['pluginupdate'],
  react: '🔄',
  desc: 'Update existing plugins from source',
  category: 'plugin',
  filename: __filename,
  use: '<plugin_name|all> [url]'
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply('❌ Please provide a plugin name or "all"');

    const pluginName = args[0].toLowerCase();
    const pluginsDir = path.join(__dirname, '..', 'plugins');

    if (pluginName === 'all') {
      // Implement batch update logic here
      return reply('⚠️ Batch updating not implemented yet');
    }

    // Check if plugin exists
    const pluginPath = path.join(pluginsDir, pluginName.endsWith('.js') ? pluginName : `${pluginName}.js`);
    if (!fs.existsSync(pluginPath)) {
      return reply(`❌ Plugin "${pluginName}" not found`);
    }

    // Get update URL from command or plugin metadata
    const updateUrl = args[1] || await getPluginSourceUrl(pluginPath);
    if (!updateUrl) {
      return reply(`❌ No update URL provided or found in plugin metadata\nUsage: .updateplugin ${pluginName} <url>`);
    }

    // Download updated plugin
    const { data } = await axios.get(updateUrl);
    await fs.promises.writeFile(pluginPath, data);

    reply(`✅ Successfully updated plugin: ${pluginName}\n\nType *.restart* to reload plugins`);

  } catch (error) {
    console.error('Plugin update error:', error);
    reply(`❌ Failed to update plugin:\n${error.message}`);
  }
});

// Helper function to extract source URL from plugin comments
async function getPluginSourceUrl(pluginPath) {
  try {
    const content = await fs.promises.readFile(pluginPath, 'utf8');
    const urlMatch = content.match(/@source (.+)/);
    return urlMatch ? urlMatch[1] : null;
  } catch {
    return null;
  }
}

const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Plugin Install Command
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

    // Check if plugin already exists
    const pluginPath = path.join(pluginsDir, jsFile.filename);
    if (fs.existsSync(pluginPath)) {
      return reply(`⚠️ Plugin *${jsFile.filename}* already exists!\nUse *${config.PREFIX}updateplugin* to update it`);
    }

    // Save the file
    await fs.promises.writeFile(pluginPath, jsFile.content);
    
    reply(`✅ Plugin *${jsFile.filename}* installed successfully!\n\nUse *${config.PREFIX}restart* to load it`);

  } catch (error) {
    console.error('Install error:', error);
    reply(`❌ Failed to install plugin:\n${error.message}\n\nMake sure:\n1. Gist exists and is public\n2. URL is correct`);
  }
});

// Plugin List Command
cmd({
  pattern: 'pluginlist',
  alias: ['listplugins', 'plugins'],
  react: '📋',
  desc: 'List all installed plugins',
  category: 'plugin',
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const pluginsDir = path.join(__dirname, '..', 'plugins');
    if (!fs.existsSync(pluginsDir)) {
      return reply('❌ No plugins directory found');
    }

    const plugins = fs.readdirSync(pluginsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    if (plugins.length === 0) {
      return reply('ℹ️ No plugins installed');
    }

    let message = `📚 *Installed Plugins (${plugins.length})*:\n\n`;
    plugins.forEach((plugin, index) => {
      message += `${index + 1}. ${plugin}\n`;
    });

    message += `\nUse *${config.PREFIX}deleteplugin <name>* to remove a plugin`;
    reply(message);

  } catch (error) {
    console.error('Plugin list error:', error);
    reply('❌ Failed to list plugins');
  }
});

// Plugin Delete Command
cmd({
  pattern: 'deleteplugin',
  alias: ['removeplugin', 'uninstall'],
  react: '🗑️',
  desc: 'Delete an installed plugin',
  category: 'plugin',
  filename: __filename,
  use: '<plugin_name>',
  owner: true
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply(`❌ Please specify a plugin name\nExample: *${config.PREFIX}deleteplugin example.js*`);

    let pluginName = args[0];
    if (!pluginName.endsWith('.js')) pluginName += '.js';

    const pluginsDir = path.join(__dirname, '..', 'plugins');
    const pluginPath = path.join(pluginsDir, pluginName);

    if (!fs.existsSync(pluginPath)) {
      return reply(`❌ Plugin *${pluginName}* not found\nUse *${config.PREFIX}pluginlist* to see installed plugins`);
    }

    fs.unlinkSync(pluginPath);
    reply(`✅ Plugin *${pluginName}* deleted successfully!\n\nUse *${config.PREFIX}restart* to apply changes`);

  } catch (error) {
    console.error('Delete plugin error:', error);
    reply(`❌ Failed to delete plugin:\n${error.message}`);
  }
});

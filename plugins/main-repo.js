
const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: 'script',
  alias: ['sc', 'subzero', 'repo'],
  react: '❄️',
  desc: 'Show SubZero MD script information',
  category: 'info',
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    await reply('🔍 Fetching SubZero repository info..');

    const apiUrl = 'https://api.nexoracle.com/search/github-repo?apikey=e276311658d835109c&url=https://github.com/mrfrankofcc/SUBZERO-MD';
    const { data } = await axios.get(apiUrl, { timeout: 10000 });

    if (data.status !== 200 || !data.result) throw new Error('Invalid response from NexOracle API');

    const repo = data.result;
    const owner = repo.owner;
    const zipUrl = `${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`;
    const createdAt = new Date(repo.created_at).toLocaleDateString();
    const updatedAt = new Date(repo.updated_at).toLocaleDateString();

    const message = `
❄️ \`SUBZERO-MD SCRIPT\` ❄️

📂 *Repository:* ${repo.name}
👤 *Owner:* ${owner.login}
🙋‍♂️ *Developer:* Darrell Mucheri
🔗 *URL:* ${repo.html_url}

⭐ *Stars:* ${repo.stargazers_count}
🍴 *Forks:* ${repo.forks_count}
👀 *Watchers:* ${repo.watchers_count}
⚠️ *Open Issues:* ${repo.open_issues_count}
💻 *Language:* ${repo.language || 'Not specified'}

📅 *Created:* ${createdAt}
🔄 *Updated:* ${updatedAt}
🏷️ *License:* ${repo.license?.name || 'None'}
🌍 *Homepage:* ${repo.homepage || 'N/A'}

📥 \`Download:\`
▸ ZIP: [Download Link](${zipUrl})
▸ git clone \`${repo.clone_url}\`

✨ \`Features\`:
• Multi-Device WhatsApp Bot
• Plugin System
• ${repo.size} KB Source Code
• ${repo.has_wiki ? '📘 Wiki Available' : '📕 No Wiki'}
• ${repo.archived ? '⚠️ Archived' : '🚀 Active'}
• ${repo.has_downloads ? '📦 Downloads Enabled' : '📁 Cloning Required'}

*Type* \`.menu\` *for more commands*
    `;

    await conn.sendMessage(m.chat, {
      image: { url: owner.avatar_url },
      caption: message.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

  } catch (error) {
    console.error('Script command error:', error);
    await reply(`❌ *Failed to fetch script info!*\n\n🔗 GitHub: https://github.com/mrfr8nk/SUBZERO-MD\n📦 ZIP: https://github.com/mrfr8nk/SUBZERO-MD/archive/main.zip\n\n_Error:_ ${error.message}`);
  }
});

/*const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: 'script',
  alias: ['sc', 'subzero', 'repo'],
  react: '❄️',
  desc: 'Show SubZero MD script information',
  category: 'info',
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    await reply('⏳ Fetching SubZero repository data...');

    // Fetch from BK9 API
    const { data } = await axios.get(`https://bk9.fun/stalk/githubrepo?url=${config.REPO}`, {
  timeout: 10000
});

    if (!data?.status || !data?.BK9) throw new Error('Invalid API response');

    const repo = data.BK9;
    const owner = repo.owner;
    const zipUrl = `${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`;
    const createdAt = new Date(repo.created_at).toLocaleDateString();
    const updatedAt = new Date(repo.updated_at).toLocaleDateString();

    // Format message with all API data
    const message = `
❄️ \`SUBZERO-MD SCRIPT\` ❄️

📂 *Repository:* ${repo.name}
👤 *Developer:* ${owner.login} (${owner.type})
🔗 *URL:* ${repo.html_url}

⭐ *Stars:* ${repo.stargazers_count}
🍴 *Forks:* ${repo.forks_count}
👀 *Watchers:* ${repo.watchers_count}
⚠️ *Issues:* ${repo.open_issues_count}
💻 *Language:* ${repo.language || 'Not specified'}

📅 *Created:* ${createdAt}
🔄 *Updated:* ${updatedAt}
🏷️ *License:* ${repo.license?.name || 'None'}

📥 \`Download:\`
▸ ZIP Download(${zipUrl})
▸ \`git clone ${repo.clone_url}\`

✨ \`Features:\`
• Multi-Device Baileys
• ${repo.size} KB of awesome features
• Plugin system
• ${repo.has_wiki ? 'Wiki available' : 'No wiki'}
• ${repo.archived ? '⚠️ ARCHIVED' : '🚀 Active development'}


• ${repo.has_downloads ? 'Git required' : ''}

*Type* \`.menu\` *for more info*
    `;

    await conn.sendMessage(m.chat, {
      image: { url: owner.avatar_url },
      caption: message,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

  } catch (error) {
    console.error('Script command error:', error);
    reply(`*⚠️ Error fetching script info!*\n\nBasic Details:\n▸ Repo: https://github.com/itzfrakaumbadev/SUBZERO\n▸ ZIP: https://github.com/itzfrakaumbadev/SUBZERO/archive/main.zip\n\n_Error: ${error.message}_`);
  }
});
*/


const config = require('../config')
const {cmd , commands} = require('../command')



cmd({
    pattern: "test2",
    desc: "Check bot online or no.",
    category: "main",
    react: "👋",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
 

 
 const botname = "SUBZERO MD"; //add your name
 const ownername = "MR FRANK"; // add your name
 const Supunwa = { 
 key: { 
  remoteJid: 'status@broadcast', 
  participant: '0@s.whatsapp.net' 
   }, 
message:{ 
  newsletterAdminInviteMessage: { 
    newsletterJid: '120363270086174844@newsletter', //add your channel jid
    newsletterName: "SUBZERO MD", //add your bot name
    caption: botname + ` Verified By ` + ownername, 
    inviteExpiration: 0
  }
 }
}



let des = `*👋 Hello ${pushname}*`
return await conn.sendMessage(from,{
    image: {url: `https://files.catbox.moe/703kuc.jpg`},
    caption: des
},{quoted: Supunwa})

// {quoted: mek} ඔයාලගෙ ඔතන 👈 ඔහොම ඇත්තෙ එක උඩ විදිහට හදා ගන්න..👆

}catch(e){
console.log(e)
reply(`${e}`)
}
})

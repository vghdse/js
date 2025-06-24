/* 

IAM A THE MASTERMIND MR FRANK OFC
*/
const { cmd, commands } = require('../command');
const config = require('../config')

cmd({
     on:"body"},async(conn,mek,m,{from,body,isCmd,isGroup,isOwner,isAdmins,groupAdmins,isBotAdmins,sender,pushname,groupName,quoted})=>{
try{
conn.ev.on("call", async(json) => {
	  if(config.ANTI_CALL === "true") { 
    	for(const id of json) {
    		if(id.status == "offer") {
    			if(id.isGroup == false) {
    				await conn.rejectCall(id.id, id.from);
				
				if ( mek.key.fromMe) return await conn.sendMessage(id.from, {
    					text: `*Call rejected automatically because owner is busy ⚠️*`, 
							mentions: [id.from]
    				});
	
    			} else {
    				await conn.rejectCall(id.id, id.from);
    			}
    		}
    	}}
    });
} catch (e) {
console.log(e)
reply(e)
}}
)


/* 
IAM A THE MASTERMIND MR FRANK OFC
*/
/*
const { cmd, commands } = require('../command');
const config = require('../config');

// Handle incoming messages
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, isCmd, isGroup, isOwner, isAdmins, groupAdmins, isBotAdmins, sender, pushname, groupName, quoted }) => {
    // Your message handling logic here
});

// Call event listener (runs once)
module.exports = async function setupCallBlock(conn) {
    if (config.ANTI_CALL !== "true") return;

    conn.ev.on("call", async (json) => {
        for (const id of json) {
            if (id.status === "offer" && !id.isGroup) {
                await conn.rejectCall(id.id, id.from);
                await conn.sendMessage(id.from, {
                    text: `*Call rejected automatically because owner is busy ⚠️*`,
                    mentions: [id.from]
                });
            }
        }
    });
}
*/

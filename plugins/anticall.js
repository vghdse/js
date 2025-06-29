/* 

IAM A THE MASTERMIND MR FRANK OFC
*/
/*const { cmd, commands } = require('../command');
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
*/

const { cmd, commands } = require('../command');
const config = require('../config');

// Register the call event listener only once when the bot starts
// This should be in your main bot initialization code, not inside a command
function setupAntiCall(conn) {
    conn.ev.on("call", async (json) => {
        if (config.ANTI_CALL === "true") {
            for (const id of json) {
                if (id.status == "offer") {
                    if (id.isGroup == false) {
                        await conn.rejectCall(id.id, id.from);
                        
                        // Only send message if not from the bot itself
                        if (!id.fromMe) {
                            await conn.sendMessage(id.from, {
                                text: `*Call rejected automatically because owner is busy ⚠️*`,
                                mentions: [id.from]
                            });
                        }
                    } else {
                        await conn.rejectCall(id.id, id.from);
                    }
                }
            }
        }
    });
}

// Command handler (if you still need this for something)
cmd({
    on: "body"
}, async (conn, mek, m, { from, body, isCmd, isGroup, isOwner, isAdmins, groupAdmins, isBotAdmins, sender, pushname, groupName, quoted }) => {
    // Your command logic here
    // Don't put the call event listener here
});

// Export the setup function to be called when bot starts
module.exports = { setupAntiCall };

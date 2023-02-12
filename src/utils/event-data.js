const fetch = require('node-fetch');
const botConfig = require('../../config');

async function getEventData() {
    console.log('--- Pobieranie statystyk eventu ---');
    const res = await fetch('https://dpd-data-server-2.herokuapp.com/current-data');
//    const res = await fetch('http://localhost:20443/current-data');
    const data = await res.json();
    const messaageArray = data
        .sort((a, b) => (b.towaryCurrentSum + b.towary) - (a.towaryCurrentSum + a.towary))
        .map((user, i) => `${i + 1}. **Nick**: ${user.nick} - **Towary**: ${user.towaryCurrentSum + user.towary}`);

    return messaageArray.join("\n") + new Date().getTime().toString();
}


async function startLoop(client) {
    return setInterval(async () => {
        try {
            const msg = await getEventData();
            const channel = client.channels.cache.find(channel => channel.name === botConfig.eventChannel.name);

            if (channel.lastMessageId && channel.messages) {
                const msgToEdit = await channel.messages.fetch(channel.lastMessageId);
                console.log("edit", msg)
                msgToEdit.edit(msg).then();
            }
            // else {
            //  channel.send(msg).then();
            // }
        } catch (e) {
            console.log('err', e);
        }

    }, 60000);
}

module.exports = {
    getEventData,
    startLoop
}
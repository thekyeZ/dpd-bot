const fetch = require("node-fetch");
const logger = require("./logger");

async function getEventData() {
  // console.log("--- Pobieranie statystyk eventu ---");
  logger("--- Pobieranie statystyk eventu ---");
  const res = await fetch(
    "https://dpd-data-server-2.herokuapp.com/current-data"
  );
  //    const res = await fetch('http://localhost:20443/current-data');
  const data = await res.json();
  const now = new Date();
  const mesageHeader = `**Dane eventu towarowego, aktualizacja: ${now.toLocaleDateString()}, godzina: ${now.getHours()}:${now.getMinutes()} **\n\n`;
  const messaageArray = data
    .sort(
      (a, b) => b.towaryCurrentSum + b.towary - (a.towaryCurrentSum + a.towary)
    )
    .map(
      (user, i) =>
        `${i + 1}. **Nick**: ${user.nick} - **Towary**: ${
          user.towaryCurrentSum + user.towary
        }`
    );

  return mesageHeader + messaageArray.join("\n");
}

async function startLoop(client, config) {
  return setInterval(async () => {
    try {
      const msg = await getEventData();
      const channel = client.channels.cache.find(
        (channel) => channel.name === config.eventChannel.channelName
      );

      if (channel.messages) {
        const msgToEdit = await channel.messages.fetch(
          config.eventChannel.messageId
        );
        //                await channel.send('Wiadomość testowa')
        if (msgToEdit) {
          await msgToEdit.edit(msg);
        }
      }
    } catch (e) {
      // console.log("err", e);
      logger("event data error" + e);
    }
  }, 600000);
}

module.exports = {
  startLoop,
};

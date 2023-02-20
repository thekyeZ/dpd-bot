const botConfig = require("../../config");
const { workers } = require("../data/workers-top");
const { getNewEmbed } = require("./embed");

function getMinDiff(startDate, endDate) {
  const msInMinute = 60 * 1000;
  return Math.round(Math.abs(endDate - startDate) / msInMinute);
}

async function sendMockMessage(channel) {
  await channel.send(`1. @misiakov87 jest z nami od 19.05.2022 czyli już  6 miesięcy i 27 dni. Przegrał on z nami: 302 460 minut!
  2. @piotr c / maskomistrz  jest z nami od 28.05.2022 czyli już 6 miesięcy i 18 dni. Przegrał on z nami: 289 500 minut!
  3. @Son_Goku_  jest z nami od 09.07.2022 czyli już 5 miesięcy i 6 dni. Przegrał on z nami: 229 020 minut!
  4. @s0nY  jest z nami od  13.08.2022 czyli już 4 miesięcy i 2 dni. Przegrał on z nami: 178 620 minut!
  5. @Rudy BRAK SIANA? DZWON  jest z nami od 21.08.2022 czyli już 3 miesięcy i 25 dni. Przegrał on z nami: 167 100 minut!
  6. @Fluffy Yōkai jest z nami od 30.10.2022 czyli już 1 miesięcy i 16 dni. Przegrał on z nami: 66 300 minut!
  7. @Kot  jest z nami od 07.11.2022 czyli już 1 miesięcy i 8 dni. Przegrał on z nami: 54 720 minut!
  8. @JosephPL jest z nami od 19.11.2022 czyli już 0 miesięcy i 26 dni. Przegrał on z nami:37 440 minut!
  8. @Timo  jest z nami od 19.11.2022 czyli już 0 miesięcy i 26 dni. Przegrał on z nami: 37 440 minut!
  9. @Mucha  jest z nami od 20.11.2022 czyli już 0 miesięcy i 25 dni. Przegrał on z nami: 36 000 minut!
  9. @piter20208  jest z nami od 20.11.2022 czyli już 0 miesięcy i 25 dni. Przegrał on z nami: 36 000 minut!
  10. @ParówaTypciu  jest z nami od 27.11.2022 czyli już 0 miesięcy i 18 dni. Przegrał on z nami: 25 920 minut!
  11. @Aedde jest z nami od 03.12.2022 czyli już 0 miesięcy i 12 dni. Przegrał on z nami: 17 280 minut!
  12. @Kubson jest z nami od 04.12.2022 czyli już 0 miesięcy i 11 dni. Przegrał on z nami: 15 840 minut!
  13. @Czołgaty  jest z nami od 05.12.2022  czyli już 0 miesięcy i 10 dni. Przegrał on z nami: 14 400 minut!
  14. @Wojtuś  jest z nami od 13.12.2022 czyli już  0 miesięcy i 2 dni. Przegrał on z nami: 2 880 minut!
  15. @zakolak ツ  jest z nami od 14.12.2022 czyli  już 0 miesięcy i 1 dni. Przegrał on z nami: 1 440 minut!`);
}

async function setTimeInDPD(client) {
  setInterval(async () => {
    const channel = client.channels.cache.find(
      (channel) => channel.name === botConfig.dpdTimeChannel.name
    );

    if (channel.name !== botConfig.dpdTimeChannel.name) {
      console.log(channel.name);
      return;
    }
    // await sendMockMessage(channel);
    // return;

    const msgToEdit = await channel.messages.fetch(
      botConfig.dpdTimeChannel.messageId
    );

    if (!msgToEdit.id) return;

    const allWorkers = workers;

    let rows = allWorkers.map((worker) => {
      const prepDate = worker.date.split(".").reverse().join("-");
      const startDate = new Date(prepDate);
      let minDiff = getMinDiff(startDate.getTime(), new Date().getTime());
      return [
        `**${worker.nick}** jest z nami od **${worker.date}** czyli już ponad __**${minDiff} minut!**__`,
        minDiff,
      ];
    });

    const newRows = rows
      .sort((a, b) => b[1] - a[1])
      .map((row, i) => {
        return {
          name: i + 1 + "",
          value: row[0],
        };
      });
    await msgToEdit.edit({ embeds: [await getNewEmbed(newRows)] });
    console.log("----- New Embed Sent -----", new Date().toDateString());
  }, 1800000); // 30 mins
  // }, 1000); // 1 second
}

module.exports = {
  setTimeInDPD,
};

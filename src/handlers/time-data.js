// const botConfig = require("../../config");
const { workers } = require("../data/workers-top");
const { getNewEmbed } = require("../utils/embed");
const logger = require("../utils/logger");

function getMinDiff(startDate, endDate) {
  const msInMinute = 60 * 1000;
  return Math.round(Math.abs(endDate - startDate) / msInMinute);
}

async function setTimeInDPD(client, config) {
  return setInterval(async () => {
    const channel = client.channels.cache.find(
      (channel) => channel.name === config.dpdTimeChannel.channelName
    );

    if (channel.name !== config.dpdTimeChannel.channelName) {
      return;
    }

    const msgToEdit = await channel.messages.fetch(
      config.dpdTimeChannel.messageId
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
    logger("----- New Embed Sent -----");
    // }, 1800000); // 30 mins
  }, 3600); // 1 second
}

module.exports = {
  setTimeInDPD,
};

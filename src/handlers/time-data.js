// const botConfig = require("../../config");
const { workers } = require("../data/workers-top");
const { getNewEmbed } = require("../utils/embed");
const cron = require("node-cron");
const logger = require("../utils/logger");

function setupCron(client, config) {
  logger(`Ustawiono cron na 0 0 * * * dla time-data.js`);
  // setup cron
  cron.schedule("0 0 * * *", () => {
    setTimeInDPD(client, config);
  });
}

function getDayDiff(startDate, endDate) {
  return Math.round(Math.abs(endDate - startDate) / (1000 * 3600 * 24));
}

async function setTimeInDPD(client, config) {
  const channel = client.channels.cache.find(
    (channel) => channel.name === config.dpdTimeChannel.channelName
  );

  if (channel.name !== config.dpdTimeChannel.channelName) {
    return;
  }
  // channel.send("init");

  // return;

  const msgToEdit = await channel.messages.fetch(
    config.dpdTimeChannel.messageId
  );

  if (!msgToEdit.id) return;

  const allWorkers = workers;

  let rows = allWorkers.map((worker) => {
    const prepDate = worker.employmentDate.split(".").reverse().join("-");
    const startDate = new Date(prepDate);
    let minDiff = getDayDiff(startDate.getTime(), new Date().getTime());
    return [
      `**${worker.nick}** jest z nami od **${worker.employmentDate}** czyli już ponad __**${minDiff} dni!**__`,
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
}

module.exports = {
  setTimeInDPD,
  setupCron,
};

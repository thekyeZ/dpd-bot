const { startLoop } = require("./src/utils/event-data");
const { setTimeInDPD } = require("./src/utils/time-data");
const playground = require("./src/utils/playground");

module.exports = {
  eventChannel: {
    name: "┇📋┇ Event Towarowy",
    channelName: "┇📋┇event-towary",
    id: 1069912883837808710,
    messageId: "1074316206825279569",
    active: false,
    callback: startLoop,
  },
  dpdTimeChannel: {
    name: "🕰️ Czas pracy",
    channelName: "czas-w-dpd",
    id: 1076837717062733895,
    // messageId: "1076855970782785646",
    messageId: "1077294610554040330",
    active: true,
    callback: setTimeInDPD,
  },
  playground: {
    name: "playground",
    channelName: "playground",
    id: 0,
    messageId: 0,
    active: false,
    callback: playground,
  },
};

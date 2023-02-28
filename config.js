const { startLoop } = require("./src/handlers/event-data");
const { setTimeInDPD } = require("./src/handlers/time-data");
const playground = require("./src/handlers/playground");
const { sumUpFromText } = require("./src/handlers/fuel");

// type: 0 - normal, 1 - ineractionPass

module.exports = {
  eventChannel: {
    name: "┇📋┇ Event Towarowy",
    channelName: "┇📋┇event-towary",
    id: 1069912883837808710,
    messageId: "1074316206825279569",
    active: false,
    type: 0,
    callback: startLoop,
  },
  dpdTimeChannel: {
    name: "🕰️ Czas pracy",
    channelName: "czas-w-dpd",
    id: 1079830416141328494,
    // messageId: "1076855970782785646",
    messageId: "1079879907754131596",
    active: true,
    type: 0,
    cronPattern: "",
    callback: setTimeInDPD,
  },
  playground: {
    name: "playground",
    channelName: "playground",
    id: 0,
    messageId: 0,
    active: false,
    type: 0,
    callback: playground,
  },
  fuel: {
    name: "Rozliczanie paliwa",
    channelName: "fuel-test",
    messageId: "1077294610554040330",
    id: 1076837717062733895,
    active: true,
    type: 1,
    callback: sumUpFromText,
  },
};

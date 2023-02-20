require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { setTimeInDPD } = require("./utils/time-data");
const botConfig = require("../config");
const { startLoop } = require("./utils/event-data");
const { showBanner } = require("./utils/banner");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

let itervalIDs = {
  eventChannel: null,
  dpdTimeChannel: null,
};

client.on(Events.ClientReady, async () => {
  showBanner();
  console.log(`Logged in as ${client.user.tag}`);

  if (botConfig.eventChannel.active) {
    itervalIDs.eventChannel = startLoop(client);
  }

  if (botConfig.dpdTimeChannel.active) {
    itervalIDs.dpdTimeChannel = setTimeInDPD(client);
  }
});

client.login(process.env.TOKEN);

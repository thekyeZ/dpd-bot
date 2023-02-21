require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const botConfig = require("../config");
const { sumUpFromText, resetInvoices } = require("./handlers/fuel");
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
  // console.log(`Logged in as ${client.user.tag}`);
  const configKeys = Object.keys(botConfig);
  showBanner(
    configKeys
      .filter((key) => botConfig[key].active)
      .map((key) => botConfig[key].name),
    client.user.tag
  );
  configKeys.forEach((key) => {
    const botFeature = botConfig[key];
    if (botFeature.active) {
      itervalIDs[key] = botFeature.callback(client, botConfig);
    }
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const configKeys = Object.keys(botConfig);
  const interactionTriggered = configKeys.filter((key) => {
    return botConfig[key].type === 1;
  });

  switch (interaction.commandName) {
    case "rozlicz":
      // sumUpFuel(interaction);
      // sumUpFromText(interaction);
      interactionTriggered["fuel"].callback(interaction);
      break;
    case "resetuj-faktury":
      // resetInvoices(interaction);
      interactionTriggered["fuel"].callback(interaction);
      break;
    default:
      // console.log("Nierozpoznano komendy");
      logger("--- Nierozpoznano komendy ---");
  }
});

client.login(process.env.TOKEN);

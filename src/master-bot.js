require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const botConfig = require("../config");
const {
  sumUpFromText,
  resetInvoices,
  getInvoicesChannels,
} = require("./handlers/fuel");
const { setupCron } = require("./handlers/time-data");
const { showBanner } = require("./utils/banner");
const logger = require("./utils/logger");

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
let guild;

const fuelAllowedUsers = ["kyeZ", "BureQ", "Manaolana"];

client.on(Events.ClientReady, async () => {
  // console.log(`Logged in as ${client.user.tag}`);
  guild = await client.guilds.fetch(process.env.SERVER_ID);

  setupCron(client, botConfig);

  const configKeys = Object.keys(botConfig);
  showBanner(
    configKeys
      .filter((key) => botConfig[key].active)
      .map((key) => botConfig[key].name),
    client.user.tag
  );
  configKeys.forEach((key) => {
    const botFeature = botConfig[key];
    if (botFeature.active && botFeature.type === 0 && !botFeature.cronPattern) {
      itervalIDs[key] = botFeature.callback(client, botConfig);
    }
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // const configKeys = Object.keys(botConfig);
  // const interactionTriggered = configKeys.filter((key) => {
  //   return botConfig[key].type === 1;
  // });

  const invoicesChannels = await getInvoicesChannels(guild);
  const invoiceChannel = invoicesChannels.find((iChannels) => {
    return iChannels.name == interaction.channel.name;
  });

  switch (interaction.commandName) {
    case "rozlicz":
      // sumUpFuel(interaction);
      if (!invoiceChannel) {
        logger(`--- Wywołano /rolicz na niewpsieranym kanale ---`);
        break;
      }

      if (!fuelAllowedUsers.includes(interaction.user.username)) {
        logger(
          `--- Brak uprawnień do użycia komenty /rolicz przez ${interaction.user.username} ---`
        );
        break;
      }

      const sum = await sumUpFromText(interaction);
      logger(
        `--- Rozliczono faktury na kanale ${invoiceChannel.name}: ${
          sum ? sum : ""
        } ---`
      );

      break;
    case "resetuj-faktury":
      // resetInvoices(interaction);
      if (!invoiceChannel) {
        logger(`--- Wywołano /resetuj-faktury na niewpsieranym kanale ---`);
        break;
      }
      resetInvoices(interaction);
      logger(`--- Zresetowano faktury na kanale ${invoiceChannel.name} ---`);

      break;
    default:
      logger("--- Nierozpoznano komendy ---");
  }
});

client.login(process.env.TOKEN);

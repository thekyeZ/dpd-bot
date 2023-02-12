require('dotenv').config();
const {Client, IntentsBitField, GatewayIntentBits, Events} = require('discord.js');

const { startLoop } = require('./utils/event-data');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

let eventDataIntervalID;

/**
    TODO:

    [] Dodać komendę start loop
    [] Dodać komendę stop loop - clearInterval
    []
*/



client.on(Events.ClientReady, async () => {
    console.log(`Loggen in as ${client.user.tag}`);
    eventDataIntervalID = startLoop(client);
})

client.login(process.env.TOKEN);

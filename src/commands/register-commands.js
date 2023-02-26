require("dotenv").config();
const botConfig = require("../../config");
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "rozlicz",
    description: "Rozlicz faktury na podanym kanale",
  },
  {
    name: "resetuj-faktury",
    description: "Po rozliczeniu, reestuj faktury z kanału",
  },
];

(async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Registering commands", process.env.SERVER_ID);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.SERVER_ID
      ),
      { body: commands }
    );

    console.log("Registering commands done");
  } catch (e) {
    console.log(e);
  }
})();

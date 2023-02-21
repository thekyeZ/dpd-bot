const Tesseract = require("tesseract.js");
const logger = require("../utils/logger");

let worker;
(async () => {
  worker = await Tesseract.createWorker({
    // logger: function (m) {
    //   console.log(m);
    // },
  });

  await worker.loadLanguage("eng");
  await worker.initialize("eng");
})();

module.exports = {
  sumUpFromText: async (interaction) => {
    let messages = await interaction.channel.messages.fetch();
    let invoiceValid = true;
    const fuelValues = [];
    await interaction.deferReply();

    if (messages) {
      const regex = /kwot[eę]: .*\$[0-9]*/;

      for (let msgObj of messages) {
        let [id, msg] = msgObj;
        if (msg.content.match(regex)) {
          const fuelCost = Number(
            msg.content.match(regex)[0].split(":")[1].split("$")[1].trim()
          );
          if (fuelCost) {
            fuelValues.push(fuelCost);
          } else {
            invoiceValid = false;
            msg.reply("Nieprawidłowy format");
          }
        }
      }
    }
    const fuelSum = fuelValues.reduce((p, c) => p + c, 0);
    if (invoiceValid) {
      interaction.editReply("Rozliczenie: $" + fuelSum);
    } else {
      interaction.editReply("Popraw błędy we wskazanych fakturach:");
    }
  },
  resetInvoices: async (interaction) => {
    // await interaction.deferReply();
    let fetched = await interaction.channel.messages.fetch();
    if (fetched) {
      await interaction.channel.bulkDelete(fetched);
      logger("--- Deleted all mesages ---");
      interaction.reply("Faktury zresetowane");
    } else {
      interaction.reply("Brak faktur");
    }
  },
  sumUpFuel: async (interaction) => {
    if (interaction.channel.name !== "fuel-test") return;

    let messages = await interaction.channel.messages.fetch();

    // TODO: Test that condition
    if (!messages) return;

    const fuelValues = [];

    await interaction.deferReply();

    for (let msg of messages) {
      for (let attachment of msg[1].attachments) {
        let [id, att] = attachment;
        console.log(att.url);
        console.info("- Rozpoczynanie analizy -");
        const ret = await worker.recognize(att.url);
        console.info("- Analiza zakończona -");

        const fuelRawGroup = ret.data.text.match(/paliwo: .*\$[0-9]*/);
        const fuelRaw = fuelRawGroup ? fuelRawGroup[0] : null;

        console.info("Fuel: ", fuelRaw);
        console.info("Text: ", ret.data.text);

        if (fuelRaw) fuelValues.push(Number(fuelRaw.split("$")[1]));
      }
    }
    console.log("fuelValues", fuelValues);

    if (fuelValues.length) {
      const fuelSum = fuelValues.reduce((p, c) => p + c);
      interaction.editReply("Rozliczenie: $" + fuelSum);
    } else {
      interaction.editReply(
        "Nie udało się zrobić roliczenia lub kanał jest pusty"
      );
    }
  },
};

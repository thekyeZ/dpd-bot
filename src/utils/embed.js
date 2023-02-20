const { EmbedBuilder } = require("discord.js");

async function getNewEmbed(fields) {
  // TODO: Potetial memory leak - due to new instance of EmbedBuilder each call
  const exampleEmbed = new EmbedBuilder()
    .setColor(0xff0001)

    .setAuthor({
      name: "DPD Top",
      iconURL:
        "https://cdn.discordapp.com/attachments/1069223574021361714/1074315102045622362/dpdlogopostawa3.png",
    })
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/1069223574021361714/1074315102045622362/dpdlogopostawa3.png"
    )

    .addFields([
      {
        name: "TOPKA OSÓB KTÓRE SĄ NAJDŁUŻEJ W NASZEJ FIRMIE (OBECNYCH OSÓB)!",
        value:
          "_Pracownicy którzy są z nami w firmie! Ile miesięcy oraz ile przegrali z nami godzin!_",
      },
      ...fields,
    ])
    .setTimestamp()
    .setFooter({
      text: "Stan z dnia (aktualizacja co 30 minut)",
      iconURL:
        "https://cdn.discordapp.com/attachments/1069223574021361714/1074315102045622362/dpdlogopostawa3.png",
    });

  return exampleEmbed;
}

module.exports = {
  getNewEmbed,
};

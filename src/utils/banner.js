// const { default: chalk } = require("chalk");
var colors = require("colors");

colors.enable();
module.exports = {
  showBanner: (runningFeatures, loginConfirmation) => {
    let banner = `
        ==================================================
                     🤖 vPET DPD Discord Bot 🤖
                       > version: 1.0.0 <
                        > author: kyeZ <
                 > https://github.com/thekyeZ <
        ==================================================
    `;

    banner += `             Logged in as ${loginConfirmation}\n`;
    banner += `        --------------------------------------------------\n`;
    banner += `                       Uchuchomione usługi                      \n`;

    let f = runningFeatures
      .map((element) => {
        return `                        > ${element}                       \n`
          .green;
      })
      .join("");
    banner += f;
    console.log(banner);
  },
};

/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { sendReply } from "enmity/api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { set } from "enmity/api/settings";
import { Constants } from "enmity/metro/common";

const addSlowmodeValue: Command = {
  id: "add-slowmode-value",

  name: "slowmode add",
  displayName: "slowmode add",

  description: "Add a value to the slowmode list",
  displayDescription: "Add a value to the slowmode list",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [{
    name: "seconds",
    displayName: "seconds",

    description: "The new value (in seconds) that you want to add",
    displayDescription: "The new value (in seconds) that you want to add",

    type: ApplicationCommandOptionType.Integer,
    required: true
  }],

  execute: async function (args, message) {
    const seconds = parseInt(args[args.findIndex(x => x.name === "seconds")].value) as number;

    try {
      if (Constants.SLOWMODE_VALUES.includes(seconds)) {
        sendReply(message?.channel.id ?? "0", `The value \`${seconds}\` already exists.`);
        return;
      } else if (seconds < 1) {
        sendReply(message?.channel.id ?? "0", `The value \`${seconds}\` must be greater than 0.`);
        return;
      }

      Constants.SLOWMODE_VALUES.push(seconds);
      Constants.SLOWMODE_VALUES.sort((a: number, b: number) => { return a - b });
      sendReply(message?.channel.id ?? "0", `The value \`${seconds}\` has been added.`);
      set("_customSlowmode", "slowmodeValues", Constants.SLOWMODE_VALUES);
    } catch (err) {
      console.log("[ addSlowmodeValue Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while adding a slowmode value. Check debug logs for more info.");
    }
  }
}

export { addSlowmodeValue };


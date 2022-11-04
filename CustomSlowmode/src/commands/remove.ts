/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { Constants } from "enmity/metro/common";
import { sendReply } from "enmity/api/clyde";
import { set } from "enmity/api/settings";

const removeSlowmodeValue: Command = {
  id: "remove-slowmode-value",

  name: "slowmode remove",
  displayName: "slowmode remove",

  description: "Remove a value to the slowmode list",
  displayDescription: "Remove a value to the slowmode list",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [{
    name: "value",
    displayName: "value",

    description: "The value that you want to remove",
    displayDescription: "The value that you want to remove",

    type: ApplicationCommandOptionType.Integer,
    required: true
  }],

  execute: async function (args, message) {
    const value = parseInt(args[args.findIndex(x => x.name === "value")].value) as number;

    try {
      if (!Constants.SLOWMODE_VALUES.includes(value)) {
        sendReply(message?.channel.id ?? "0", `The value \`${value}\` does not exist.`);
        return;
      }

      Constants.SLOWMODE_VALUES.splice(Constants.SLOWMODE_VALUES.indexOf(value),1)
      Constants.SLOWMODE_VALUES.sort((a: number, b: number) => { return a - b });
      set('_customSlowmode', 'slowmodeValues', Constants.SLOWMODE_VALUES);
      sendReply(message?.channel.id ?? "0", `The value \`${value}\` has been removed.`);
    } catch (err) {
      console.log("[ removeSlowmodeValue Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while removing a slowmode value. Check debug logs for more info.");
    }
  }
}

export { removeSlowmodeValue }
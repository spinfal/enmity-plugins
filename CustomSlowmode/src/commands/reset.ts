/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { Constants } from "enmity/metro/common";
import { sendReply } from "enmity/api/clyde";
import { set, get} from "enmity/api/settings";

const resetSlowmodeValues: Command = {
  id: "reset-slowmode-values",

  name: "slowmode reset",
  displayName: "slowmode reset",

  description: "Reset the slowmode values to Discord's default values",
  displayDescription: "Reset the slowmode values to Discord's default values",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  execute: async function (args, message) {
    try {
      const defaultSlowmodeValues = [0, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 21600];
      Constants.SLOWMODE_VALUES = defaultSlowmodeValues;
      set("_customSlowmode", "slowmodeValues", Constants.SLOWMODE_VALUES);
      
      if (Constants.SLOWMODE_VALUES === defaultSlowmodeValues && get("_customSlowmode", "slowmodeValues", null) === defaultSlowmodeValues) {
        sendReply(message?.channel.id ?? "0", "Slowmode values have been reset to Discord's default values.");
        return;
      } else {
        sendReply(message?.channel.id ?? "0", "An error occured while resetting the slowmode values.");
        return;
      }
    } catch (err) {
      console.log("[ resetSlowmodeValues Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while resetting the slowmode values. Check debug logs for more info.");
    }
  }
}

export { resetSlowmodeValues }
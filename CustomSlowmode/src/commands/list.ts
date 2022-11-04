/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { Constants } from "enmity/metro/common";
import { sendReply } from "enmity/api/clyde";

const listSlowmodeValues: Command = {
  id: "list-slowmode-values",

  name: "slowmode list",
  displayName: "slowmode list",

  description: "List the values that are currently in the slowmode list",
  displayDescription: "List the values that are currently in the slowmode list",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [{
    name: "whisper",
    displayName: "whisper",

    description: "Only you can see the response",
    displayDescription: "Only you can see the response",

    type: ApplicationCommandOptionType.Boolean,
    required: false
  }],

  execute: async function (args, message) {
    const whisper = args[args.findIndex(x => x.name === 'whisper')];

    try {
      const embed = {
        type: 'rich',
        title: 'Slowmode Values',
        description: (Constants.SLOWMODE_VALUES?.length > 0 ? Constants.SLOWMODE_VALUES.map((x: number) => `${x}s (${Math.floor(x / 60)}m)`).join('\n') : 'No values found'),
        footer: {
          text: 'Not every value will work. This is a limitation set by Discord.'
        },
        color: "0xff0069"
      }

      if (whisper?.value ?? true) {
        sendReply(message?.channel.id ?? "0", { embeds: [embed] });
        return
      } else {
        return {
          content: (Constants.SLOWMODE_VALUES?.length > 0 ? Constants.SLOWMODE_VALUES.map((x: number) => `${x}s (${Math.floor(x / 60)}m)`).join('\n') : 'No values found')
        }
      }
    } catch (err) {
      console.log("[ listSlowmodeValues Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while fetching and listing the slowmode values. Check debug logs for more info.");
    }
  }
}

export { listSlowmodeValues }
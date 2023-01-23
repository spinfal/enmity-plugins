/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { sendReply } from "enmity/api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { REST } from "enmity/modules/common";

const subreddits = [
  "feet",
  "feetpics",
  "NSFW_Feet",
  "Feet_NSFW"
]

const feet: Command = {
  id: "feet-command",

  name: "feet",
  displayName: "feet",

  description: "Get an image of a feet",
  displayDescription: "Get an image of a feet",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [{
    name: "whisper",
    displayName: "whisper",

    description: "Only you can see the result",
    displayDescription: "Only you can see the result",

    type: ApplicationCommandOptionType.Boolean,
    required: false
  }],

  execute: async function (args, message) {
    const whisper = args[args.findIndex(x => x.name === "whisper")] as any;
    const sub = subreddits[Math.floor(Math.random() * subreddits.length)];

    try {
      let response = await REST.get(`https://www.reddit.com/r/${sub}.json`);
      response = response.body?.data?.children?.[Math.floor(Math.random() * response.body?.data?.children?.length)]?.data;

      const embed = {
        type: "rich",
        title: response?.title,
        url: `https://reddit.com${response?.permalink}`,
        image: {
          proxy_url: response?.url_overridden_by_dest ?? response?.url,
          url: response?.url_overridden_by_dest ?? response?.url,
          width: response?.preview?.images?.[0]?.source?.width,
          height: response?.preview?.images?.[0]?.source?.height
        },
        footer: {
          text: `Posted by u/${response?.author} in r/${sub}`
        },
        color: "0xff0069"
      }

      if (message?.guild?.id == "950850315601711176" && whisper?.value === false) whisper.value = true;

      if (whisper?.value ?? true) {
        sendReply(message?.channel.id ?? "0", { content: (message?.guild?.id == "950850315601711176" ? "anywhere else but this server smh - spin" : ""), embeds: [embed] });
        return
      } else {
        return {
          content: response?.url_overridden_by_dest ?? response?.url
        }
      }
    } catch (err) {
      console.log("[ Gotfeets Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while fetching and returning the feet image. Check debug logs for more info.");
    }
  }
}

export { feet };

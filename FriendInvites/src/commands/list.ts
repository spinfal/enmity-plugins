/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { sendReply } from "enmity/api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { getByProps } from "enmity/metro";

const listFriendInvites: Command = {
  id: "list-friend-invites",

  name: "invites list",
  displayName: "invites list",

  description: "List your current friend invite links",
  displayDescription: "List your current friend invite links",

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
    const whisper = args[args.findIndex(x => x.name === "whisper")];

    try {
      const response = await getByProps("getAllFriendInvites").getAllFriendInvites();

      if (response) {
        const embed = {
          type: "rich",
          title: "Friend Invites",
          description: (response.length == 0 ? "You have no friend invites!" : `${response.map((invite: object) => `**https://discord.gg/${invite["code"]}**\nUses: ${invite["uses"]}/${invite["max_uses"]}\nExpires <t:${new Date(invite["expires_at"]).getTime() / 1000}:R>`).join("\n\n")}`),
          footer: {
            text: `Friend invites are mostly undocumented and any of these features may break at any time.`
          },
          color: "0xff0069"
        }

        if (whisper?.value ?? true) {
          sendReply(message?.channel.id ?? "0", { embeds: [embed] });
          return
        } else {
          if (response.length == 0) {
            sendReply(message?.channel.id ?? "0", "You have no friend invites!");
            return
          } else {
            return {
              content: `${response.map((invite: object) => `\`discord.gg/${invite["code"]}\` - uses: ${invite["uses"]}/${invite["max_uses"]} - expires <t:${new Date(invite["expires_at"]).getTime() / 1000}:R>`).join("\n")}`
            }
          }
        }
      } else {
        console.log("[ listFriendInvites Response ]", response);
        sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response sent to console.");
      }
    } catch (err) {
      console.log("[ listFriendInvites Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while fetching and listing friend invites. Check debug logs for more info.");
    }
  }
}

export { listFriendInvites };


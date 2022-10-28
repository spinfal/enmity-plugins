/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { getByKeyword } from "enmity/metro";
import { sendReply } from "enmity/api/clyde";

const createFriendInvite: Command = {
  id: "create-friend-invite",

  name: "createinvite",
  displayName: "createinvite",

  description: "Create a friend invite link",
  displayDescription: "Create a friend invite link",

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
      const response = await getByKeyword('friendinvite').createFriendInvite();

      if (response) {
        if (whisper?.value ?? true) {
          sendReply(message?.channel.id ?? "0", `Your friend invite link is: discord.gg/${response.code}\nMax uses: ${response.max_uses}\nExpires: <t:${new Date(response.expires_at).getTime() / 1000}:R>`);
          return
        } else {
          return {
            content: `discord.gg/${response.code}`
          }
        }
      } else {
        console.log('[ createFriendInvite Response ]', response);
        sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response sent to console.");
      }
    } catch (err) {
      console.log('[ createFriendInvite Error ]', err);
      sendReply(message?.channel.id ?? "0", "An error occured while creating the friend invite. Check debug logs for more info.");
    }
  }
}

export { createFriendInvite }
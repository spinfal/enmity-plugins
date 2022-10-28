/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { getByKeyword } from "enmity/metro";
import { sendReply } from "enmity/api/clyde";

const listFriendInvites: Command = {
  id: "list-friend-invites",

  name: "listinvites",
  displayName: "listinvites",

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
    const whisper = args[args.findIndex(x => x.name === 'whisper')];

    try {
      const response = await getByKeyword('friendinvite').getAllFriendInvites()

      if (response) {
        const embed = {
          type: 'rich',
          title: 'Friend Invites',
          description: (response.length == 0 ? 'You have no friend invites!' : `${response.map(x => `\`discord.gg/${x.code}\` - uses: ${x.uses}/${x.max_uses} - expires <t:${new Date(x.expires_at).getTime() / 1000}:R>`).join('\n')}`),
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
            sendReply(message?.channel.id ?? "0", 'You have no friend invites!');
            return
          } else {
            return {
              content: `${response.map(x => `\`discord.gg/${x.code}\` - uses: ${x.uses}/${x.max_uses} - expires <t:${new Date(x.expires_at).getTime() / 1000}:R>`).join('\n')}`
            }
          }
        }
      } else {
        console.log('[ listFriendInvites Response ]', response);
        sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response sent to console.");
      }
    } catch (err) {
      console.log('[ listFriendInvites Error ]', err);
      sendReply(message?.channel.id ?? "0", "An error occured while fetching and listing friend invites. Check debug logs for more info.");
    }
  }
}

export { listFriendInvites }
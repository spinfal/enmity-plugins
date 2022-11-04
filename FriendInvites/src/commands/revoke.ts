/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { getByKeyword } from "enmity/metro";
import { sendReply } from "enmity/api/clyde";

const revokeFriendInvites: Command = {
  id: "revoke-friend-invites",

  name: "invites revoke",
  displayName: "invites revoke",

  description: "Revoke all of your friend invites (this is irreversible and will delete all of your friend invites)",
  displayDescription: "Revoke all of your friend invites (this is irreversible and will delete all of your friend invites)",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  execute: async function (args, message) {
    try {
      await getByKeyword('friendinvite').revokeFriendInvites();
      const response = await getByKeyword('friendinvite').getAllFriendInvites();

      if (response.length == 0) {
        sendReply(message?.channel.id ?? "0", 'All of your friend invites have been revoked.');
        return
      } else {
        console.log('[ revokeFriendInvites Response ]', response);
        sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response sent to console.");
      }
    } catch (err) {
      console.log('[ revokeFriendInvites Error ]', err);
      sendReply(message?.channel.id ?? "0", "An error occured while revoking friend invites. Check debug logs for more info.");
    }
  }
}

export { revokeFriendInvites }
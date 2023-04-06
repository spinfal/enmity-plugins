/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { sendReply } from "enmity/api/clyde";
import { ApplicationCommandInputType, ApplicationCommandType, Command } from "enmity/api/commands";
import { getByProps } from "enmity/metro";

const friendInvites = getByProps("getAllFriendInvites");

const revokeFriendInvites: Command = {
  id: "revoke-friend-invites",

  name: "invites revoke",
  displayName: "invites revoke",

  description: "Revoke all of your friend invites (this is irreversible and will delete all of your friend invites)",
  displayDescription: "Revoke all of your friend invites (this is irreversible and will delete all of your friend invites)",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  // options: [{
  //   name: "invite",
  //   displayName: "invite",

  //   description: "The invite that you wish to revoke",
  //   displayDescription: "The invite that you wish to revoke",

  //   type: ApplicationCommandOptionType.String,
  //   required: false
  // }],

  execute: async function (args, message) {
    const specificInvite = args[args.findIndex(x => x.name === "invite")];

    try {
      // specificInvite ? await friendInvites.revokeFriendInvite(specificInvite.value.match(/(?<=\/)[a-zA-Z0-9-]+(?=\/*$)/)?.[0]) : await friendInvites.revokeAllFriendInvites();
      await friendInvites.revokeFriendInvites().then(() => {
        friendInvites.getAllFriendInvites().then((response: any) => {
          if (response.length == 0) {
            sendReply(message?.channel.id ?? "0", specificInvite ? "Successfully revoked invite." : "Successfully revoked all invites.");
            return
          } else {
            console.log("[ revokeFriendInvites Response ]", response);
            sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response sent to console.");
          }
        })
      })
    } catch (err) {
      console.log("[ revokeFriendInvites Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while revoking friend invites. Check debug logs for more info.");
    }
  }
}

export { revokeFriendInvites };


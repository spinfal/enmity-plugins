/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { sendReply } from "enmity/api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { bulk, filters } from "enmity/metro";

const [
  friendInvites,
  API,
  v4,
  currentUser
] = bulk(
  filters.byProps("getAllFriendInvites"),
  filters.byProps("get", "post"),
  filters.byProps("v4"),
  filters.byProps("getCurrentUser")
);

const createFriendInvite: Command = {
  id: "create-friend-invite",

  name: "invites create",
  displayName: "invites create",

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
    const whisper = args[args.findIndex(x => x.name === "whisper")];

    try {
      if (!currentUser.getCurrentUser().phone) sendReply(message?.channel.id ?? "0", "Using friend invites requires you to have a phone number linked. This is a Discord limitation for some odd reason. You can still try the plugin, however you will be met with errors.");

      const uuid = v4.v4();
      const invite = await API.post({ url: '/friend-finder/find-friends', body: { modified_contacts: { [uuid]: [1, '', ''] } } }).then((x: object) => friendInvites.createFriendInvite({ "code": x["body"]["invite_suggestions"][0][3], "recipient_phone_number_or_email": uuid })).catch((error: any) => console.log("[ createFriendInvite Error ]", error)); // what in the hell is this, WHY the hell is this??? thank you nikosszzz, i dont know how you figured this out. this snippet is licensed under the "unlicensed license" (aka public domain)
      console.log(invite)

      if (invite) {
        if (whisper?.value ?? true) {
          sendReply(message?.channel.id ?? "0", `Your friend invite link is: discord.gg/${invite.code}\nMax uses: ${invite.max_uses}\nExpires: <t:${new Date(invite.expires_at).getTime() / 1000}:R>`);
          return
        } else {
          return {
            content: `discord.gg/${invite.code}`
          }
        }
      } else {
        console.log("[ createFriendInvite Response ]", invite);
        sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response sent to console.");
      }
    } catch (err) {
      console.log("[ createFriendInvite Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while creating the friend invite. Check debug logs for more info.");
    }
  }
}

export { createFriendInvite };


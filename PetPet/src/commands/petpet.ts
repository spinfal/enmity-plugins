/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { getByProps } from "enmity/metro";
import { sendReply } from "enmity/api/clyde";
import { REST } from "enmity/modules/common";

const petpet: Command = {
  id: "petpet-command",

  name: "petpet",
  displayName: "petpet",

  description: "Generate a petpet gif from a given image",
  displayDescription: "Generate a petpet gif from a given image",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [{
    name: "url",
    displayName: "url",

    description: "The URL of the image to petpet",
    displayDescription: "The URL of the image to petpet",

    type: ApplicationCommandOptionType.String,
    required: false
  },
  {
    name: "user",
    displayName: "user",

    description: "Grab a user's avatar to petpet",
    displayDescription: "Grab a user's avatar to petpet",

    type: ApplicationCommandOptionType.User,
    required: false
  },
  {
    name: "size",
    displayName: "size",

    description: "Change the size of the petpet gif. Max is 512. Defaults to 100, higher values equal larger files and potentially no Discord embeds",
    displayDescription: "Change the size of the petpet gif. Max is 512. Defaults to 100, higher values equal larger files and potentially no Discord embeds",

    type: ApplicationCommandOptionType.Integer,
    required: false
  },
  {
    name: "delay",
    displayName: "delay",

    description: "The delay between each frame, defaults to 20",
    displayDescription: "The delay between each frame, defaults to 20",

    type: ApplicationCommandOptionType.Integer,
    required: false
  },
  {
    name: "whisper",
    displayName: "whisper",

    description: "Only you can see the result",
    displayDescription: "Only you can see the result",

    type: ApplicationCommandOptionType.Boolean,
    required: false
  }],

  execute: async function (args, message) {
    const url = args[args.findIndex(x => x.name === 'url')];
    const user = args[args.findIndex(x => x.name === 'user')];
    const size = args[args.findIndex(x => x.name === 'size')];
    const delay = args[args.findIndex(x => x.name === 'delay')];
    const whisper = args[args.findIndex(x => x.name === 'whisper')];

    const apiVersion = 'v2';

    // Argument checks
    if (!url && !user) return sendReply(message?.channel.id ?? "0", "No argument provided, nothing will happen. Here's a banana instead 🍌");

    try {
      const response = await REST.get(`https://petpet-api.clit.repl.co/petpet?url=${url?.value ? url.value : getByProps("getUser").getUser(user?.value).getAvatarURL().split('?')[0].replace(/gif|webp/, 'png')}&size=${size ? size.value : 100}&delay=${delay ? delay.value : 20}&version=${apiVersion}`).then(res => res.body);

      if (response.status == true) {
        const embed = {
          type: 'rich',
          image: {
            proxy_url: response?.result,
            url: response?.result,
            width: size ? size.value : 100,
            height: size ? size.value : 100
          },
          footer: {
            text: `Files are purged every 24 hours • Powered by ${response?.github}`
          },
          color: "0xff0069"
        }

        if (whisper?.value ?? true) {
          sendReply(message?.channel.id ?? "0", { embeds: [embed] });
          return
        } else {
          return {
            content: response?.result
          }
        }
      } else {
        console.log('[ PetPet Fetch Response ]', response, response?.status);
        console.log('[ PetPet Arguments ]', url, user, size, delay, whisper);
        sendReply(message?.channel.id ?? "0", "Something went wrong, please try again later. Fetch response and PetPet arguments sent to console.");
      }
    } catch (err) {
      console.log('[ PetPet Error ]', err);
      console.log('[ PetPet Arguments ]', url, user, size, delay, whisper);
      sendReply(message?.channel.id ?? "0", "An error occured while fetching and preparing the petpet image. Check debug logs for more info.");
    }
  }
}

export { petpet }
/* Enmity slash command structure created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
/* Modified by Spinfal aka Spin */
/* "Why rewrite what is already written?" */
import { ApplicationCommandInputType, ApplicationCommandType, Command } from "enmity/api/commands";
import { Navigation } from "enmity/metro/common";
import Page from "../../../common/components/_pluginSettings/Page";
import Logs from "../Logs";
import { sendReply } from "enmity/api/clyde";

const logs: Command = {
  id: "logs-command",

  name: "logs",
  displayName: "logs",

  description: "Open the NoDelete message logs page",
  displayDescription: "Open the NoDelete message logs page",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  execute: async function (args, message) {
    try {
      Navigation.push(Page, { component: Logs, name: "NoDelete Message Logs" })
    } catch (err) {
      console.log("[ NoDelete Error ]", err);
      sendReply(message?.channel.id ?? "0", "An error occured while trying to open NoDelete message logs. Check debug logs for more info.");
    }
  }
}

export { logs }
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { create } from "enmity/patcher";
import { Toasts } from "enmity/metro/common";
import manifest from "../manifest.json";
import * as Assets from "enmity/api/assets";
import { React } from "enmity/metro/common";
import { makeStore } from "enmity/api/settings";
import { ScrollView } from "enmity/components";
import UpdateButton from "../../common/components/updateButton";
const Patcher = create("Amongus");
const FluxDispatcher = getByProps(
  "_currentDispatchActionType",
  "_subscriptions",
  "_waitQueue"
);
const BlockedStore = getByProps("isBlocked", "isFriend");
const amogus = "https://assets-prd.ignimgs.com/2020/09/15/among-us-button-1600131255112.jpg";
const Amongus: Plugin = {
  ...manifest,
  onStart() {
    const Settings = makeStore(this.name);
    FluxDispatcher.dispatch({
      type: "LOAD_MESSAGES",
    });
    Settings.set("test", "test");
    FluxDispatcher.dispatch({
      type: "LOAD_MESSAGES_SUCCESS",
      channelId: 0,
      messages: [],
      isBefore: false,
      isAfter: false,
      hasMoreBefore: false,
      hasMoreAfter: false,
      limit: 25,
      jump: undefined,
      isStale: false,
      truncate: undefined,
    }); // wake up the handler?????? this does nothing lmao
    let attempt = 0;
    let attempts = 3;
    const lateStartup = () => {
      try {
        attempt++;
        console.log(
          `Amongus delayed start attempt ${attempt}/${attempts}.`
        );
        Toasts.open({
          content: `Amongus start attempt ${attempt}/${attempts}.`,
          source: { uri: amogus },
        });
        const MessageCreate = FluxDispatcher._orderedActionHandlers.MESSAGE_CREATE.find((h) => h.name === "MessageStore");
        const MessageUpdate = FluxDispatcher._orderedActionHandlers.MESSAGE_UPDATE.find((h) => h.name === "MessageStore");

        const LoadMessages =
          FluxDispatcher._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
            (h) => h.name === "MessageStore"
          );
            Patcher.before(MessageCreate, "actionHandler", (_, args: any) => {
              args.message.content = "sus";

              console.log("MessageCreate", args);
            });
            Patcher.before(MessageUpdate, "actionHandler", (_, args: any) => {
              args.message.content = "sus";
              console.log("MessageUpdate", args);
            });
          Patcher.before(LoadMessages, "actionHandler", (_, args: any) => {
          args[0].messages = args[0].messages.map((n) => {
            n.content = "sus";
            return n;
          })
        });
        console.log(`Amongus delayed start successful.`);
        Toasts.open({
          content: `Amongus delayed start successful.`,
          source: { uri: amogus },
        });
      } catch {
        if (attempt < attempts) {
          console.warn(
            `Amongus failed to start. Trying again in ${attempt}0s.`
          );
          Toasts.open({
            content: `Amongus failed to start trying again in ${attempt}0s.`,
            source: { uri: amogus },
          });
          setTimeout(lateStartup, attempt * 10000);
        } else {
          console.error(`Amongus failed to start. Giving up.`);
          Toasts.open({
            content: `Amongus failed to start. Giving up.`,
            source: { uri: amogus },
          });
        }
      }
    };
    setTimeout(lateStartup, 300);

    
  },
  onStop() {
    Patcher.unpatchAll();
  },
  patches: [],
};

registerPlugin(Amongus);

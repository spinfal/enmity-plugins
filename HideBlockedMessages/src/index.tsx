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
const Patcher = create("HideBlockedMessages");
const FluxDispatcher = getByProps(
    "_currentDispatchActionType",
    "_subscriptions",
    "_waitQueue"
);
const BlockedStore = getByProps("isBlocked", "isFriend");

const HideBlockedMessages: Plugin = {
    ...manifest,
    onStart() {
        // const Settings = makeStore(this.name);
        // FluxDispatcher.dispatch({
        //     type: "LOAD_MESSAGES",
        // });
        // // Settings.set("test", "test");
        // FluxDispatcher.dispatch({
        //     type: "LOAD_MESSAGES_SUCCESS",
        //     channelId: 0,
        //     messages: [],
        //     isBefore: false,
        //     isAfter: false,
        //     hasMoreBefore: false,
        //     hasMoreAfter: false,
        //     limit: 25,
        //     jump: undefined,
        //     isStale: false,
        //     truncate: undefined,
        // }); // wake up the handler?????? this does nothing lmao
        /* ^ this broke the plugin lol */
        let attempt = 0;
        let attempts = 3;
        const lateStartup = () => {
            try {
                attempt++;
                console.log(
                    `HideBlockedMessages delayed start attempt ${attempt}/${attempts}.`
                );
                Toasts.open({
                    content: `HideBlockedMessages start attempt ${attempt}/${attempts}.`,
                    source: Assets.getIDByName("debug"),
                });
                const LoadMessages =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
                        (h) => h.name === "MessageStore"
                    );
                const MessageCreate =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_CREATE.find(
                        (h) => h.name === "MessageStore"
                    );
                const MessageUpdate =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_UPDATE.find(
                        (h) => h.name === "MessageStore"
                    );
                const MessageStore = getByProps("getMessage", "getMessages");

                Patcher.before(
                    MessageCreate,
                    "actionHandler",
                    (_, args: any) => {
                        const msg = args[0].message;
                        args[0].message = BlockedStore.isBlocked(msg?.author?.id)
                            ? null
                            : msg;
                    }
                );
                Patcher.before(
                    MessageUpdate,
                    "actionHandler",
                    (_, args: any) => {
                        const msg = args[0].message;
                        args[0].message = BlockedStore.isBlocked(msg?.author?.id)
                            ? null
                            : msg;
                    }
                );
                Patcher.after(
                    MessageStore,
                    "getMessage",
                    (_, _args: any, response: any) => {
                        response = BlockedStore.isBlocked(response?.author?.id)
                            ? null
                            : response;
                    }
                );
                Patcher.before(
                    LoadMessages,
                    "actionHandler",
                    (_, args: any) => {
                        args[0].messages = args[0].messages.filter(
                            (msg) => !BlockedStore.isBlocked(msg.author.id)
                        );
                    }
                );
                console.log(`HideBlockedMessages delayed start successful.`);
                Toasts.open({
                    content: `HideBlockedMessages delayed start successful.`,
                    source: Assets.getIDByName("Check"),
                });
            } catch (err) {
                console.log('[HideBlockedMessages Error]', err);
                
                if (attempt < attempts) {
                    console.warn(
                        `HideBlockedMessages failed to start. Trying again in ${attempt}0s.`
                    );
                    Toasts.open({
                        content: `HideBlockedMessages failed to start trying again in ${attempt}0s.`,
                        source: Assets.getIDByName("ic_message_retry"),
                    });
                    setTimeout(lateStartup, attempt * 10000);
                } else {
                    console.error(
                        `HideBlockedMessages failed to start. Giving up.`
                    );
                    Toasts.open({
                        content: `HideBlockedMessages failed to start. Giving up.`,
                        source: Assets.getIDByName("Small"),
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
    getSettingsPanel({ settings }) {
        return (
            <ScrollView settings={settings}>
                <UpdateButton pluginUrl={manifest.sourceUrl} />
            </ScrollView>
        );
    },
};

registerPlugin(HideBlockedMessages);

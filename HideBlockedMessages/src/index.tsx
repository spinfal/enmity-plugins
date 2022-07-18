import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import * as Assets from "enmity/api/assets";
import { create } from "enmity/patcher";
import { Toasts } from "enmity/metro/common";
import manifest from "../manifest.json";
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
        Toasts.open({
            content: "Waiting for LOAD_MESSAGES_SUCCESS.",
        });

        let LoadMessagesSuccess = null;
        while (LoadMessagesSuccess === null) {
            try {
                LoadMessagesSuccess =
                    FluxDispatcher._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
                        (h) => h.name === "MessageStore"
                    );
            } catch (e) { console.log(e.message)}
        }
        Toasts.open({
            content: "LOAD_MESSAGES_SUCCESS acquired.",
            source: Assets.getIDByName("Check"),
        });
        // const MessageCreate = FluxDispatcher._orderedActionHandlers.MESSAGE_CREATE.find((h) => h.name === "MessageStore");
        // const MessageUpdate = FluxDispatcher._orderedActionHandlers.MESSAGE_UPDATE.find((h) => h.name === "MessageStore");
        Patcher.before(LoadMessagesSuccess, "actionHandler", (_, args: any) => {
            args[0].messages = args[0].messages.filter(
                (msg) => !BlockedStore.isBlocked(msg.author.id)
            );
        });
    },
    onStop() {
        Patcher.unpatchAll();
    },
    patches: [],
};

registerPlugin(HideBlockedMessages);

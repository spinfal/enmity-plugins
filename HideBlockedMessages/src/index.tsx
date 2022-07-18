import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { create } from "enmity/patcher";
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
        FluxDispatcher.dispatch({
            type: "LOAD_MESSAGES",
        });
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
        }); // wake up the handler??????
        const LoadMessages =
            FluxDispatcher._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
                (h) => h.name === "MessageStore"
            );
        // const MessageCreate = FluxDispatcher._orderedActionHandlers.MESSAGE_CREATE.find((h) => h.name === "MessageStore");
        // const MessageUpdate = FluxDispatcher._orderedActionHandlers.MESSAGE_UPDATE.find((h) => h.name === "MessageStore");
        Patcher.before(LoadMessages, "actionHandler", (_, args: any) => {
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

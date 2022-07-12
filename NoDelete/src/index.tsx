import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
const MessageStore = getByProps("getMessage", "getMessages");
const ChannelStore = getByProps("getChannel", "getDMFromUserId");
const FluxDispatcher = getByProps(
    "_currentDispatchActionType",
    "_subscriptions",
    "_waitQueue"
);
const Patcher = create("NoDelete");

const NoDelete: Plugin = {
    ...manifest,
    patches: [],

    onStart() {
            const MessageDelete =
                FluxDispatcher._orderedActionHandlers.MESSAGE_DELETE.find(
                    (h) => h.name === "MessageStore"
                );
            if (!MessageDelete) {
                console.error("MessageDelete not found");
                return;
            }
            const MessageUpdate =
                FluxDispatcher._orderedActionHandlers.MESSAGE_UPDATE.find(
                    (h) => h.name === "MessageStore"
                );

            Patcher.before(MessageDelete, "actionHandler", (_, args) => {
                const originalMessage = MessageStore.getMessage(
                    args[0].channelId,
                    args[0].id
                );
                args[0] = {};
                if (
                    !originalMessage.editedTimestamp ||
                    originalMessage.editedTimestamp._isValid
                ) {
                    const editEvent = {
                        type: "MESSAGE_UPDATE",
                        message: {
                            ...originalMessage,
                            edited_timestamp: "invalid_timestamp",
                            content: originalMessage.content + " `[deleted]`",
                            guild_id: ChannelStore.getChannel(
                                originalMessage.channel_id
                            ).guild_id,
                        },
                    };
                    FluxDispatcher.dispatch(editEvent);
                }
            });

            Patcher.before(MessageUpdate, "actionHandler", (_, args) => {
                try {
                    const originalMessage = MessageStore.getMessage(
                        args[0].message.channel_id,
                        args[0].message.id
                    );
                    try {
                        if (!args[0].edited_timestamp._isValid) return;
                    } catch {}
                    args[0].message.content =
                        originalMessage.content +
                        " `[edited]`\n" +
                        args[0].message.content;
                    return;
                } catch {}
            });
        // setTimeout(() => {plugin()}, 300); // give Flux some time to initialize -- 300ms should be more than enough
        // Make sure the MESSAGE_UPDATE and MESSAGE_DELETE action handlers are available
        // for (const handler of ["MESSAGE_UPDATE", "MESSAGE_DELETE"]) {
        //     try {
        //         FluxDispatcher.dispatch({
        //             type: handler,
        //             message: {}, // should be enough to wake them up
        //         });
        //     } catch {}
        // }
        // apparently it wasn't

        // FluxDispatcher.dispatch({
        //     type: "MESSAGE_UPDATE",
        //     message: {
        //         edited_timestamp: "",
        //         content: "",
        //         guild_id: "0000000",
        //     },
        // });

        // FluxDispatcher.dispatch({
        //     type: "MESSAGE_DELETE",
        //     message: {
        //         channel_id: "",
        //         id: "",
        //     },
        // });
        //this doesn't work either
    },

    onStop() {
        Patcher.unpatchAll();
    },
};

registerPlugin(NoDelete);

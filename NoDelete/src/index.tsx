import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps, getModule } from "enmity/metro";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import * as Assets from "enmity/api/assets";
import { React } from "enmity/metro/common";
import { ScrollView } from "enmity/components";
import UpdateButton from "../../common/components/updateButton";
const Patcher = create("NoDelete");
const Toast = getModule(m => m.open !== undefined && m.close !== undefined && !m.openLazy && !m.startDrag && !m.init && !m.openReplay && !m.openChannelCallPopout)
const NoDelete: Plugin = {
    ...manifest,
    patches: [],

    onStart() {
        let attempt = 0;
        let attempts = 3;
        const plugin = () => {
            try {
                // FluxDispatcher.dispatch({
                //     type: "MESSAGE_DELETE",
                //     message: {
                //         channel_id: "0000000000",
                //         id: "00000000000",
                //     },
                // });
                attempt++;
                // FluxDispatcher.dispatch({
                //     type: "MESSAGE_UPDATE",
                //     message: {
                //         edited_timestamp: "",
                //         content: "",
                //         guild_id: "0000000",
                //     },
                // });
        

                const FluxDispatcher = getByProps(
                    "_currentDispatchActionType",
                    "_subscriptions",
                    "_actionHandlers",
                    "_waitQueue"
                );
                const MessageStore = getByProps("getMessage", "getMessages");
                const ChannelStore = getByProps(
                    "getChannel",
                    "getDMFromUserId"
                );
                // console.log('[NoDelete Dispatch]', FluxDispatcher);
                console.log(
                    `NoDelete delayed start attempt ${attempt}/${attempts}.`
                );
                Toast.open({
                    content: `NoDelete start attempt ${attempt}/${attempts}.`,
                    source: Assets.getIDByName('debug'),
                });

                for (const handler of ["MESSAGE_UPDATE", "MESSAGE_DELETE"]) {
                    try {
                        FluxDispatcher.dispatch({
                            type: handler,
                            message: {}, // should be enough to wake them up
                        });
                    } catch {}
                }

                const MessageDelete = FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_DELETE.find(
                    (h) => h.name === "MessageStore"
                );

                const MessageUpdate = FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_UPDATE.find(
                    (h) => h.name === "MessageStore"
                );

                Patcher.before(MessageDelete, "actionHandler", (_, args) => {
                    const originalMessage = MessageStore.getMessage(
                        args[0].channelId,
                        args[0].id
                    );
                    args[0] = {};
                    if (
                        !originalMessage?.editedTimestamp ||
                        originalMessage?.editedTimestamp._isValid
                    ) {
                        const editEvent = {
                            type: "MESSAGE_UPDATE",
                            message: {
                                ...originalMessage,
                                edited_timestamp: "invalid_timestamp",
                                content:
                                    originalMessage.content + " `[deleted]`",
                                guild_id: ChannelStore.getChannel(
                                    originalMessage.channel_id
                                ).guild_id,
                            },
                            log_edit: false
                        };
                        FluxDispatcher.dispatch(editEvent);
                    }
                });

                Patcher.before(MessageUpdate, "actionHandler", (_, args) => {
                    try {
                        if (args[0].log_edit == false) return;
                        
                        const originalMessage = MessageStore.getMessage(
                            args[0].message.channel_id,
                            args[0].message.id
                        );
                        try {
                            if (!args[0].edited_timestamp._isValid) return;
                        } catch {}
                        args[0].message.content =
                            originalMessage.content.replace(/`\[edited\]`\n/gm, "") +
                            " `[edited]`\n" +
                            args[0].message.content;
                        return;
                    } catch {}
                });

                console.log("NoDelete delayed start successful.");
                Toast.open({
                    content: `NoDelete delayed start successful.`,
                    source: Assets.getIDByName('Check'),
                });
            } catch (e) {
                console.log('[NoDelete Plugin Error]', e);

                if (attempt < attempts) {
                    console.warn(
                        `NoDelete failed to start. Trying again in ${attempt}0s.`
                    );
                    Toast.open({
                        content: `NoDelete failed to start trying again in ${attempt}0s.`,
                        source: Assets.getIDByName('ic_message_retry'),
                    });
                    setTimeout(plugin, attempt * 10000);
                } else {
                    console.error(`NoDelete failed to start. Giving up.`);
                    Toast.open({
                        content: `NoDelete failed to start. Giving up.`,
                        source: Assets.getIDByName('Small'),
                    });
                }
            }
        };
        
        setTimeout(() => {
            plugin();
        }, 300); // give Flux some time to initialize -- 300ms should be more than enough
    },

    onStop() {
        Patcher.unpatchAll();
    },
    getSettingsPanel({ settings }) {
        return (
            <ScrollView settings={settings}>
                <UpdateButton pluginUrl={manifest.sourceUrl} />
            </ScrollView>
        );
    },
};

registerPlugin(NoDelete);

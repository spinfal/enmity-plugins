import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import { React, Toasts } from "enmity/metro/common";
import { getBoolean } from "enmity/api/settings";
import { Icons } from "../../common/components/_pluginSettings/utils";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
const Patcher = create("NoDelete");
const NoDelete: Plugin = {
    ...manifest,
    patches: [],

    onStart() {
        let attempt = 0;
        let attempts = 3;
        const plugin = () => {
            let enableToasts = getBoolean(manifest.name, `${manifest.name}-toastEnable`, false)

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
                // console.log(`[${manifest.name} Dispatch]`, FluxDispatcher);
                console.log(
                    `${manifest.name} delayed start attempt ${attempt}/${attempts}.`
                );
                enableToasts ? Toasts.open({
                    content: `[${manifest.name}] start attempt ${attempt}/${attempts}.`,
                    source: Icons.Debug,
                }) : "https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"

                for (const handler of ["MESSAGE_UPDATE", "MESSAGE_DELETE"]) {
                    try {
                        FluxDispatcher.dispatch({
                            type: handler,
                            message: {}, // should be enough to wake them up
                        });
                    } catch (err) {
                        console.log(`[${manifest.name} Dispatch Error]`, err);
                    }
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

                        if (!args[0]?.message?.content) return;

                        try {
                            if (!args[0].edited_timestamp._isValid) return;
                        } catch { }
                        args[0].message.content =
                            originalMessage.content +
                            " `[edited]`\n" +
                            args[0].message.content;
                        return;
                    } catch (err) {
                        console.log(`[${manifest.name} Error]`, err);
                    }
                });

                console.log(`${manifest.name} delayed start successful.`);
                enableToasts ? Toasts.open({
                    content: `[${manifest.name}] start successful.`,
                    source: Icons.Settings.Toasts.Settings,
                }) : "https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"
            } catch (err) {
                console.log(`[${manifest.name} Plugin Error]`, err);

                if (attempt < attempts) {
                    console.warn(
                        `${manifest.name} failed to start. Trying again in ${attempt}0s.`
                    );
                    enableToasts ? Toasts.open({
                        content: `[${manifest.name}] failed to start trying again in ${attempt}0s.`,
                        source: Icons.Failed,
                    }) : "https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"
                    setTimeout(plugin, attempt * 10000);
                } else {
                    console.error(`${manifest.name} failed to start. Giving up.`);
                    Toasts.open({
                        content: `${manifest.name} failed to start. Giving up.`,
                        source: Icons.Failed,
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
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={null} commands={null} />;
    },
};

registerPlugin(NoDelete);

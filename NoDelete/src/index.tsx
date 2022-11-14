import { FormDivider, FormSwitch, FormRow, FormSection, FormInput } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps, getByKeyword } from "enmity/metro";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import { React, Toasts, Storage, Navigation, Constants, StyleSheet } from "enmity/metro/common";
import { SettingsStore, getBoolean, get, set } from "enmity/api/settings";
import { Icons } from "../../common/components/_pluginSettings/utils";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import Page from "../../common/components/_pluginSettings/Page";
import Logs from "./Logs";
import { commands } from './commands';
import { updateLogStorage } from "../functions/updateLogStorage";

interface SettingsProps {
    settings: SettingsStore;
}

const Patcher = create("NoDelete");
const NoDelete: Plugin = {
    ...manifest,
    patches: [],

    onStart() {
        // async function checkCompat() {
        //     await check_if_compatible_device(manifest);
        // }

        Storage.getItem("NoDeleteLogs").then(res => {
            if (res == null) Storage.setItem("NoDeleteLogs", "[]")
        }).catch(err => {
            console.log(`[${manifest.name} Storage Error]`, err);
        })

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

                const MessageDelete = FluxDispatcher._actionHandlers._orderedActionHandlers?.MESSAGE_DELETE.find(
                    (h) => h.name === "MessageStore"
                );

                const MessageUpdate = FluxDispatcher._actionHandlers._orderedActionHandlers?.MESSAGE_UPDATE.find(
                    (h) => h.name === "MessageStore"
                );

                Patcher.before(MessageDelete, "actionHandler", (_, args) => {
                    const originalMessage = MessageStore.getMessage(
                        args[0].channelId,
                        args[0].id
                    );
                    if (!originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0) return;

                    if (getBoolean("_nodelete", "_storageLog", false) == true || getBoolean("_nodelete", "_logSelf", false) === false && originalMessage?.author?.id == getByKeyword('getCurrentUser').getCurrentUser()?.id) return;

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
                                    originalMessage?.content + " `[deleted]`",
                                guild_id: ChannelStore.getChannel(
                                    originalMessage?.channel_id
                                )?.guild_id,
                            },
                            log_edit: false
                        };

                        FluxDispatcher.dispatch(editEvent);
                    }

                    updateLogStorage("delete", `${originalMessage?.author?.username}#${originalMessage?.author?.discriminator}`, originalMessage?.author?.id, originalMessage?.author?.avatar, { time: originalMessage?.timestamp, original: originalMessage?.content?.replace("`[deleted]`", "").trim() })
                });

                Patcher.before(MessageUpdate, "actionHandler", (_, args) => {
                    try {
                        if (args[0].log_edit == false || getBoolean("_nodelete", "_logSelf", false) === false && args[0]?.message?.author?.id == getByKeyword('getCurrentUser').getCurrentUser()?.id) return;

                        const originalMessage = MessageStore.getMessage(
                            args[0].message.channel_id,
                            args[0].message.id
                        );

                        if (args[0]?.message?.content == "undefined" && args[0]?.message?.attachments?.length == 0 && args[0]?.message?.embeds?.length == 0) return;

                        try {
                            if (!args[0].edited_timestamp._isValid) return;
                        } catch { }
                        const newEditMessage = args[0].message.content;

                        if (getBoolean("_nodelete", "_storageLog", false) == false) {
                            args[0].message.content =
                                originalMessage?.content +
                                " `[edited]`\n" +
                                args[0]?.message?.content;
                        }

                        updateLogStorage("edit", `${args[0]?.message?.author?.username}#${args[0]?.message?.author?.discriminator}`, args[0]?.message?.author?.id, args[0]?.message?.author?.avatar, { time: args[0]?.message?.edited_timestamp, original: originalMessage?.content?.replace(/\`\[edited\]\`/gim, "")?.replace("`[deleted]`", "").trim(), edited: `${newEditMessage?.replace(/\`\[edited\]\`/gim, "")?.replace("`[deleted]`", "").trim()}` })
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
            // checkCompat();
            plugin();
        }, 300); // give Flux some time to initialize -- 300ms should be more than enough

        this.commands = commands;
    },

    onStop() {
        Patcher.unpatchAll();
        this.commands = [];
    },
    getSettingsPanel({ settings }: SettingsProps): any {
        const styles = StyleSheet.createThemedStyleSheet({
            icon: {
                color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
            },
            item: {
                color: Constants.ThemeColorMap.TEXT_MUTED
            }
        });

        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={
            <>
                <FormSection title="Message Logs">
                    <FormRow
                        label="View Message Logs"
                        subLabel="Tap on an item to copy to clipboard"
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Debug} />}
                        onPress={() => {
                            Navigation.push(Page, { component: Logs, name: "NoDelete Message Logs" }) // opens custom page with logs
                        }}
                    />
                </FormSection>
                <FormDivider />
                <FormSection title="Plugin Settings">
                    <FormRow
                        label="Log my own messages"
                        subLabel="Whether or not your own edits and deleted messages will be logged"
                        leading={<FormRow.Icon source={Icons.Settings.Self} />}
                        trailing={
                            <FormSwitch
                                value={settings.getBoolean("_nodelete_logSelf", false)}
                                onValueChange={() => {
                                    try {
                                        settings.toggle("_nodelete_logSelf", false);
                                        if (settings.getBoolean("_nodelete_logSelf", false)) {
                                            set("_nodelete", "_logSelf", true);
                                        } else {
                                            set("_nodelete", "_logSelf", false);
                                        }
                                        Toasts.open({
                                            content: `Log self-events has been set to: ${get("_nodelete", "_logSelf", false)}.`,
                                            source: Icons.Settings.Toasts.Settings,
                                        });
                                    } catch (err) {
                                        console.log("[ NoDelete Toggle Error ]", err);

                                        Toasts.open({
                                            content: "An error has occurred. Check debug logs for more info.",
                                            source: Icons.Failed,
                                        });
                                    }
                                }}
                            />
                        }
                    />
                    <FormDivider />
                    <FormRow
                        label="Only log to Storage"
                        subLabel="Message logs will not show in chat, only in Storage"
                        leading={<FormRow.Icon source={Icons.Pencil} />}
                        trailing={
                            <FormSwitch
                                value={settings.getBoolean("_nodelete", false)}
                                onValueChange={() => {
                                    try {
                                        settings.toggle("_nodelete", false);
                                        if (settings.getBoolean("_nodelete", false)) {
                                            set("_nodelete", "_storageLog", true);
                                        } else {
                                            set("_nodelete", "_storageLog", false);
                                        }
                                        Toasts.open({
                                            content: `Storage-only log has been set to: ${get("_nodelete", "_storageLog", false)}.`,
                                            source: Icons.Settings.Toasts.Settings,
                                        });
                                    } catch (err) {
                                        console.log("[ NoDelete Toggle Error ]", err);

                                        Toasts.open({
                                            content: "An error has occurred. Check debug logs for more info.",
                                            source: Icons.Failed,
                                        });
                                    }
                                }}
                            />
                        }
                    />
                    <FormDivider />
                    <FormInput
                        value={get("_nodelete", "maxLogs", "1000")}
                        onChange={(value: string) => (/^\d+$/.test(value) ? set("_nodelete", "maxLogs", value.trim()) : set("_nodelete", "maxLogs", "1000"))}
                        title="Max Logs to Store"
                    />
                    <FormRow
                        label="Auto-clear logs"
                        subLabel="Message logs will automatically clear after they have exceeded your max logs limit"
                        leading={<FormRow.Icon source={Icons.Clear} />}
                        trailing={
                            <FormSwitch
                                value={settings.getBoolean("_nodelete_autoClear", false)}
                                onValueChange={() => {
                                    try {
                                        settings.toggle("_nodelete_autoClear", false);
                                        if (settings.getBoolean("_nodelete_autoClear", false)) {
                                            set("_nodelete", "autoClear", true);
                                        } else {
                                            set("_nodelete", "autoClear", false);
                                        }
                                        Toasts.open({
                                            content: `Logs auto-clearing has been set to: ${get("_nodelete", "autoClear", false)}.`,
                                            source: Icons.Settings.Toasts.Settings,
                                        });
                                    } catch (err) {
                                        console.log("[ NoDelete Toggle Error ]", err);

                                        Toasts.open({
                                            content: "An error has occurred. Check debug logs for more info.",
                                            source: Icons.Failed,
                                        });
                                    }
                                }}
                            />
                        }
                    />
                </FormSection>
            </>
        } commands={commands} />;
    },
};

registerPlugin(NoDelete);

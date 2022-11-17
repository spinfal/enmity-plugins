/*
    "When I wrote this, only God and I understood what I was doing.
    Now, God only knows."
*/

import { get, getBoolean, set, SettingsStore } from "enmity/api/settings";
import { FormDivider, FormInput, FormRow, FormSection, FormSwitch } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByKeyword, getByProps } from "enmity/metro";
import { Constants, Navigation, React, Storage, StyleSheet, Toasts } from "enmity/metro/common";
import { create } from "enmity/patcher";
import Page from "../../common/components/_pluginSettings/Page";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import { updateLogStorage } from "../functions/updateLogStorage";
import manifest from "../manifest.json";
import { commands } from './commands';
import Logs from "./Logs";

interface SettingsProps {
    settings: SettingsStore;
}

const currentUserID = getByKeyword('getCurrentUser').getCurrentUser()?.id;
const Patcher = create("NoDelete");
const NoDelete: Plugin = {
    ...manifest,
    patches: [],

    onStart() {
        Storage.getItem("NoDeleteLogs").then((res: any) => {
            if (res == null) Storage.setItem("NoDeleteLogs", "[]")
        }).catch((err: any) => {
            console.log(`[${manifest.name} Storage Error]`, err);
        })

        let attempt = 0;
        const attempts = 3;
        const plugin = () => {
            const enableToasts = getBoolean(manifest.name, `${manifest.name}-toastEnable`, false)

            try {
                attempt++;

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
                    (h: any) => h.name === "MessageStore"
                );

                const MessageUpdate = FluxDispatcher._actionHandlers._orderedActionHandlers?.MESSAGE_UPDATE.find(
                    (h: any) => h.name === "MessageStore"
                );

                Patcher.before(MessageDelete, "actionHandler", (_, args) => {
                    const originalMessage = MessageStore.getMessage(
                        args[0].channelId,
                        args[0].id
                    );
                    if (!originalMessage?.author?.id || !originalMessage?.author?.username || !originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0) return;

                    if (getBoolean("_nodelete", "_logBots", false) === false && originalMessage?.author?.bot) return;
                    if (getBoolean("_nodelete", "_logSelf", false) === false && originalMessage?.author?.id == currentUserID) return;
                    if (getBoolean("_nodelete", "_storageLog", false) == false) args[0] = {};

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

                    updateLogStorage("delete", { username: `${originalMessage?.author?.username}#${originalMessage?.author?.discriminator}`, id: originalMessage?.author?.id, avatar: originalMessage?.author?.avatar, bot: originalMessage?.author?.bot }, { guild: ChannelStore.getChannel(originalMessage?.channel_id)?.guild_id, channel: originalMessage?.channel_id, message: originalMessage?.id }, { time: originalMessage?.timestamp, original: originalMessage?.content?.replace("`[deleted]`", "").trim() })
                });

                Patcher.before(MessageUpdate, "actionHandler", (_, args) => {
                    try {
                        const originalMessage = MessageStore.getMessage(
                            args[0].message.channel_id,
                            args[0].message.id
                        );

                        if (!originalMessage?.content || !args[0]?.message?.content) return;
                        if (!args[0]?.message?.content && args[0]?.message?.attachments?.length == 0 && args[0]?.message?.embeds?.length == 0 || args[0]?.message?.embeds?.[0]?.type === "link") return;

                        if (args[0].log_edit == false) return;
                        if (getBoolean("_nodelete", "_logBots", false) === false && args[0]?.message?.author?.bot) return;
                        if (getBoolean("_nodelete", "_logSelf", false) === false && args[0]?.message?.author?.id == currentUserID) return;

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

                        updateLogStorage("edit", { username: `${args[0]?.message?.author?.username}#${args[0]?.message?.author?.discriminator}`, id: args[0]?.message?.author?.id, avatar: args[0]?.message?.author?.avatar, bot: args[0]?.message?.author?.bot }, { guild: args[0].message.guild_id, channel: args[0].message.channel_id, message: args[0].message.id }, { time: args[0]?.message?.edited_timestamp, original: originalMessage?.content?.replace(/\`\[edited\]\`/gim, "")?.replace("`[deleted]`", "").trim(), edited: `${newEditMessage?.replace(/\`\[edited\]\`/gim, "")?.replace("`[deleted]`", "").trim()}` })
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
                        label="Log bot messages"
                        subLabel="Whether or not bot message events should be logged"
                        leading={<FormRow.Icon source={Icons.Settings.Robot} />}
                        trailing={
                            <FormSwitch
                                value={settings.getBoolean("_nodelete_logBots", false)}
                                onValueChange={() => {
                                    try {
                                        settings.toggle("_nodelete_logBots", false);
                                        if (settings.getBoolean("_nodelete_logBots", false)) {
                                            set("_nodelete", "_logBots", true);
                                        } else {
                                            set("_nodelete", "_logBots", false);
                                        }
                                        Toasts.open({
                                            content: `Log self-events has been set to: ${get("_nodelete", "_logBots", false)}.`,
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

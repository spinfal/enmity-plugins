import { getBoolean } from "enmity/api/settings";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { React, Toasts } from "enmity/metro/common";
import { create } from "enmity/patcher";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";
const Patcher = create(manifest.name);
const FluxDispatcher = getByProps(
    "_currentDispatchActionType",
    "_subscriptions",
    "_waitQueue"
);

const Amongus: Plugin = {
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
        }); // wake up the handler?????? this does nothing lmao
        let attempt = 0;
        let attempts = 3;
        const lateStartup = () => {
            let enableToasts = getBoolean(manifest.name, `${manifest.name}-toastEnable`, false)

            try {
                attempt++;
                console.log(
                    `[${manifest.name}] delayed start attempt ${attempt}/${attempts}.`
                );
                enableToasts ? Toasts.open({
                    content: `[${manifest.name}] start attempt ${attempt}/${attempts}.`,
                    source: Icons.Debug,
                }) : "https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"
                const MessageCreate =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_CREATE.find(
                        (h: any) => h.name === "MessageStore"
                    );
                const MessageUpdate =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_UPDATE.find(
                        (h: any) => h.name === "MessageStore"
                    );

                const LoadMessages =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
                        (h: any) => h.name === "MessageStore"
                    );
                Patcher.before(
                    MessageCreate,
                    "actionHandler",
                    (_, args: any) => {
                        args[0].message.content = "sus";
                    }
                );
                Patcher.before(
                    MessageUpdate,
                    "actionHandler",
                    (_, args: any) => {
                        args[0].message.content = "sus";
                    }
                );
                Patcher.before(
                    LoadMessages,
                    "actionHandler",
                    (_, args: any) => {
                        args[0].messages = args[0].messages.map((n) => {
                            n.content = "sus";
                            return n;
                        });
                    }
                );
                console.log(`${manifest.name} delayed start successful.`);
                enableToasts ? Toasts.open({
                    content: `${manifest.name} start successful.`,
                    source: Icons.Settings.Toasts.Settings,
                }) : "https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"
            } catch {
                if (attempt < attempts) {
                    console.warn(
                        `${manifest.name} failed to start. Trying again in ${attempt}0s.`
                    );
                    enableToasts ? Toasts.open({
                        content: `${manifest.name} failed to start trying again in ${attempt}0s.`,
                        source: Icons.Failed,
                    }) : "https://discord.com/vanityurl/dotcom/steakpants/flour/flower/index11.html"
                    setTimeout(lateStartup, attempt * 10000);
                } else {
                    console.error(`${manifest['name']} failed to start. Giving up.`);
                    Toasts.open({
                        content: `${manifest.name} failed to start. Giving up.`,
                        source: Icons.Failed,
                    });
                }
            }
        };
        setTimeout(() => {
            lateStartup();
        }, 300);
    },
    onStop() {
        Patcher.unpatchAll();
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={true} commands={null} />;
    },
};

registerPlugin(Amongus);

import { get, set, SettingsStore } from "enmity/api/settings";
import { FormRow, FormSection, FormSwitch } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { Messages, React, Toasts } from "enmity/metro/common";
import { create } from "enmity/patcher";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";

interface SettingsProps {
    settings: SettingsStore;
}

const Patcher = create(manifest.name);

// the basic structure of some of this code was taken from https://github.com/jqms/enmity-plugins/blob/fb2b6d60a5054128c4b2e44ab3358d524e0c2154/ChangeDiscordLink/src/index.tsx#L13-L30 -- thank you :)
const BTE: Plugin = {
    ...manifest,
    onStart() {
        try {
            if (!get("_twitter", "_type", false)) set("_twitter", "_type", "fxtwitter");

            Patcher.before(Messages, "sendMessage", (_self, args, _orig) => {
                const content = args[1]["content"];
                const twitterLinks = content.match(/http(s)?:\/\/(www\.)?(twitter\.com|x\.com)\/\w{4,15}\/status\/\d+/gim);
                if (!twitterLinks) return;
                args[1]["content"] = content.replace(/http(s)?:\/\/(www\.)?(twitter\.com|x\.com)/gim, `https://${get("_twitter", "_type", false)}.com`);
            });
        } catch (err) {
            console.log("[ BetterTwitterEmbeds Error ]", err);
        }
    },
    onStop() {
        Patcher.unpatchAll();
    },
    patches: [],
    getSettingsPanel({ settings }: SettingsProps) {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={null}>
            <FormSection title="Plugin Settings">
                <FormRow
                    label="Use vxtwitter.com instead of fxtwitter.com"
                    leading={<FormRow.Icon source={Icons.Copy} />}
                    trailing={
                        <FormSwitch
                            value={settings.getBoolean("_vxtwitter", false)}
                            onValueChange={() => {
                                try {
                                    settings.toggle("_vxtwitter", false);
                                    if (settings.getBoolean("_vxtwitter", false)) {
                                        set("_twitter", "_type", "vxtwitter");
                                    } else {
                                        set("_twitter", "_type", "fxtwitter");
                                    }
                                    Toasts.open({
                                        content: `Switched to ${get("_twitter", "_type", false)}.`,
                                        source: Icons.Success,
                                    });
                                } catch (err) {
                                    console.log("[ BetterTwitterEmbeds Error ]", err);

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
        </SettingsPage>
    },
};

registerPlugin(BTE);

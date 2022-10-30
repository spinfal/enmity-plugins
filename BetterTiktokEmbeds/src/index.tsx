import { FormSection, FormRow, FormSwitch } from 'enmity/components';
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { SettingsStore, get, set } from 'enmity/api/settings';
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import { React, Messages, Toasts } from "enmity/metro/common";
import { Icons } from "../../common/components/_pluginSettings/utils";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";

interface SettingsProps {
    settings: SettingsStore;
}

const Patcher = create("BTE");

// the basic structure of some of this code was taken from https://github.com/jqms/enmity-plugins/blob/fb2b6d60a5054128c4b2e44ab3358d524e0c2154/ChangeDiscordLink/src/index.tsx#L13-L30 -- thank you :)
const BTE: Plugin = {
    ...manifest,
    onStart() {
        try {
            if (!get('_tiktok', '_type', false)) set('_tiktok', '_type', 'tiktxk.com');

            Patcher.before(Messages, "sendMessage", (self, args, orig) => {
                const content = args[1]["content"];
                const tiktokLinks = content.match(/http(s)?:\/\/(\w+.)?tiktok.com\/(@[a-zA-Z0-9_.]{2,24}\/video\/\d+|(\w{1}\/)?[a-zA-Z0-9_.-]{8,12})(\/)?/gim);
                if (!tiktokLinks) return;
                args[1]["content"] = content.replace(/http(s)?:\/\/(\w+.)?tiktok.com/gim, `https://${get('_tiktok', '_type', false)}`);
            });
        } catch (err) {
            console.log('[ BetterTiktokEmbeds Error ]', err);
        }
    },
    onStop() {
        Patcher.unpatchAll();
    },
    patches: [],
    getSettingsPanel({ settings }: SettingsProps) {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={
            <FormSection title="Plugin Settings">
                <FormRow
                    label='Use vm.dstn.to instead of tiktxk.com'
                    leading={<FormRow.Icon source={Icons.Copy} />}
                    trailing={
                        <FormSwitch
                            value={settings.getBoolean('_tiktxk', false)}
                            onValueChange={() => {
                                try {
                                    settings.toggle('_tiktxk', false);
                                    if (settings.getBoolean('_tiktxk', false)) {
                                        set('_tiktok', '_type', 'vm.dstn.to');
                                    } else {
                                        set('_tiktok', '_type', 'tiktxk.com');
                                    }
                                    Toasts.open({
                                        content: `Switched to ${get('_tiktok', '_type', false)}.`,
                                        source: Icons.Settings.Toasts.Settings,
                                    });
                                } catch (err) {
                                    console.log('[ BetterTiktokEmbeds Error ]', err);

                                    Toasts.open({
                                        content: 'An error has occurred. Check debug logs for more info.',
                                        source: Icons.Failed,
                                    });
                                }
                            }}
                        />
                    }
                />
            </FormSection>
        } commands={null}
        />;
    },
};

registerPlugin(BTE);

import { FormSection, FormRow, FormSwitch } from 'enmity/components';
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { SettingsStore, get, set } from 'enmity/api/settings';
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import { React, Messages } from "enmity/metro/common";
import { getModule } from "enmity/metro";
import { ScrollView } from "enmity/components";
import UpdateButton from "../../common/components/updateButton";
import * as Assets from "enmity/api/assets";

interface SettingsProps {
    settings: SettingsStore;
}

const Toast = getModule(m => m.open !== undefined && m.close !== undefined && !m.openLazy && !m.startDrag && !m.init && !m.openReplay && !m.openChannelCallPopout);
const Patcher = create("BTE");

// the basic structure of some of this code was taken from https://github.com/jqms/enmity-plugins/blob/fb2b6d60a5054128c4b2e44ab3358d524e0c2154/ChangeDiscordLink/src/index.tsx#L13-L30 -- thank you :)
const BTE: Plugin = {
    ...manifest,
    onStart() {
        try {
            if (!get('_twitter', '_type', false)) set('_twitter', '_type', 'fxtwitter');

            Patcher.before(Messages, "sendMessage", (self, args, orig) => {
                const content = args[1]["content"];
                const twitterLinks = content.match(/http(s)?:\/\/twitter.com\/\w{4,15}\/status\/\d+/gim);
                if (!twitterLinks) return;
                args[1]["content"] = content.replace(/http(s)?:\/\/twitter.com/gim, `https://${get('_twitter', '_type', false)}.com`);
            });
        } catch (err) {
            console.log('[ BetterTwitterEmbeds Error ]', err);
        }
    },
    onStop() {
        Patcher.unpatchAll();
    },
    patches: [],
    getSettingsPanel({ settings }: SettingsProps) {
        return (
            <ScrollView settings={settings}>
                <FormSection title="Settings">
                    <FormRow
                        label='Use vxtwitter.com instead of fxtwitter.com'
                        leading={<FormRow.Icon source={Assets.getIDByName('toast_copy_link')} />}
                        trailing={
                            <FormSwitch
                                value={settings.getBoolean('_vxtwitter', false)}
                                onValueChange={() => {
                                    try {
                                        settings.toggle('_vxtwitter', false);
                                        if (settings.getBoolean('_vxtwitter', false)) {
                                            set('_twitter', '_type', 'vxtwitter');
                                        } else {
                                            set('_twitter', '_type', 'fxtwitter');
                                        }
                                        Toast.open({
                                            content: `Switched to ${get('_twitter', '_type', false)}.`,
                                            source: Assets.getIDByName('check'),
                                        });
                                    } catch (err) {
                                        console.log('[ BetterTwitterEmbeds Error ]', err);

                                        Toast.open({
                                            content: 'An error has occurred. Check debug logs for more info.',
                                            source: Assets.getIDByName('Small'),
                                        });
                                    }
                                }}
                            />
                        }
                    />
                </FormSection>
                <FormSection title="Plugin">
                    <UpdateButton pluginUrl={manifest.sourceUrl} />
                </FormSection>
            </ScrollView>
        );
    },
};

registerPlugin(BTE);

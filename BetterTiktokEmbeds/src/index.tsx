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
            if (!get('_tiktok', '_type', false)) set('_tiktok', '_type', 'tt-embed.com');

            Patcher.before(Messages, "sendMessage", (self, args, orig) => {
                const content = args[1]["content"];
                const tiktokLinks = content.match(/^http(s)?:\/\/(www.)?tiktok.com\/(@[a-zA-Z0-9_.]{2,24}\/video\/\d+|\w{1}\/[a-zA-Z0-9_.-]{8,12})(\/)?$/gim);
                if (!tiktokLinks) return;
                args[1]["content"] = (get('_tiktok', '_type', false) === 'tt-embed.com' ? content.replace(/^http(s)?:\/\/(www.)?tiktok.com/gim, `https://tt-embed.com/?q=https://tiktok.com`) : content.replace(/http(s)?:\/\/(www.)?tiktok.com/gim, `https://vm.dstn.to`));
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
        return (
            <ScrollView settings={settings}>
                <FormSection title="Settings">
                    <FormRow
                        label='Use vm.dstn.to instead of tt-embed.com'
                        leading={<FormRow.Icon source={Assets.getIDByName('toast_copy_link')} />}
                        trailing={
                            <FormSwitch
                                value={settings.getBoolean('_tt-embed', false)}
                                onValueChange={() => {
                                    try {
                                        settings.toggle('_tt-embed', false);
                                        if (settings.getBoolean('_tt-embed', false)) {
                                            set('_tiktok', '_type', 'vm.dstn.to');
                                        } else {
                                            set('_tiktok', '_type', 'tt-embed.com');
                                        }
                                        Toast.open({
                                            content: `Switched to ${get('_tiktok', '_type', false)}.`,
                                            source: Assets.getIDByName('check'),
                                        });
                                    } catch (err) {
                                        console.log('[ BetterTiktokEmbeds Error ]', err);

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

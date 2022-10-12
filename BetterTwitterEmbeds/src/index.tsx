import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
import { React, Messages } from "enmity/metro/common";
import { ScrollView } from "enmity/components";
import UpdateButton from "../../common/components/updateButton";

const Patcher = create("BTE");

// the basic structure of some of this code was taken from https://github.com/jqms/enmity-plugins/blob/fb2b6d60a5054128c4b2e44ab3358d524e0c2154/ChangeDiscordLink/src/index.tsx#L13-L30 -- thank you :)
const BTE: Plugin = {
    ...manifest,
    onStart() {
        try {
            Patcher.before(Messages, "sendMessage", (self, args, orig) => {
                const content = args[1]["content"];
                const twitterLinks = content.match(/https:\/\/twitter.com\/\w{4,15}\/status\/\d+/gim);
                if (!twitterLinks) return;
                args[1]["content"] = content.replace(/https:\/\/twitter.com/gim, 'https://fxtwitter.com');
            });
        } catch (err) {
            console.log('[BetterTwitterEmbeds Error]', err);
        }
    },
    onStop() {
        Patcher.unpatchAll();
    },
    patches: [],
    getSettingsPanel({ settings }) {
        return (
            <ScrollView settings={settings}>
                <UpdateButton pluginUrl={manifest.sourceUrl} />
            </ScrollView>
        );
    },
};

registerPlugin(BTE);

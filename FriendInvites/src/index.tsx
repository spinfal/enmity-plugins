import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { commands } from './commands';
import { React } from "enmity/metro/common";
import { ScrollView } from "enmity/components";
import UpdateButton from "../../common/components/updateButton";

const FriendInvites: Plugin = {
    ...manifest,
    onStart() {
        this.commands = commands
    },
    onStop() {
        this.commands = []
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

registerPlugin(FriendInvites);

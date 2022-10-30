import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { commands } from './commands';
import { React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";

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
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={[]} />;
    },
};

registerPlugin(FriendInvites);

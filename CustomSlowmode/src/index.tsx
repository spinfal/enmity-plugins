import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { commands } from './commands';
import { get } from "enmity/api/settings";
import { React, Constants } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";

const defaultSlowmodeValues = [0, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 21600];

const FriendInvites: Plugin = {
    ...manifest,
    onStart() {
        this.commands = commands;
        Constants.SLOWMODE_VALUES = get('_customSlowmode', 'slowmodeValues', defaultSlowmodeValues);
    },
    onStop() {
        this.commands = [];
        Constants.SLOWMODE_VALUES = defaultSlowmodeValues;
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={null} commands={commands} />;
    },
};

registerPlugin(FriendInvites);

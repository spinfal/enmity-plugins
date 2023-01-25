import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import manifest from '../manifest.json';
import { commands } from './commands';

const GotFemboys: Plugin = {
    ...manifest,
    onStart() {
        this.commands = commands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={null} commands={commands} />;
    },
};

registerPlugin(GotFemboys);

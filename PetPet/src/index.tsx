import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { pluginCommands } from './commands';
import { React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";

const PetPet: Plugin = {
    ...manifest,
    onStart() {
        this.commands = pluginCommands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={null} commands={[{name: pluginCommands[0].name, description: pluginCommands[0].description}]} />;
    },
};

registerPlugin(PetPet);

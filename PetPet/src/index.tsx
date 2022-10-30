import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { petpetCommands } from './commands';
import { React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";

const PetPet: Plugin = {
    ...manifest,
    onStart() {
        this.commands = petpetCommands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }) {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={null} commands={['petpet']} />;
    },
};

registerPlugin(PetPet);

import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { commands } from './commands';
import { React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { check_if_compatible_device } from "../../common/components/_pluginSettings/utils";

const PetPet: Plugin = {
    ...manifest,
    onStart() {
        async function checkCompat() {
            await check_if_compatible_device(manifest);
        }
        this.commands = commands

        checkCompat();
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={null} commands={commands} />;
    },
};

registerPlugin(PetPet);

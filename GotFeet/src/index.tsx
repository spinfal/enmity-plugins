import { get, set } from "enmity/api/settings";
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { Dialog, React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import manifest from '../manifest.json';
import { commands } from './commands';

const GotFeet: Plugin = {
    ...manifest,
    onStart() {
        if (!get("_age", "_confirmed", false)) {
            Dialog.show({
                title: "Wait!",
                body: "This plugin might show content that is not suitable for ages under 18. By clicking \"I'm 18 or older\" you are stating that you are 18 or older, and spin is not responsible for any content you see.",
                confirmText: "I'm 18 or older",
                cancelText: "I'm under 18",

                onConfirm: () => { set("_age", "_confirmed", true) },

                // @ts-ignore 
                onCancel: () => { window.enmity.plugins.disablePlugin("GotFeet") },
            });
        }
        this.commands = commands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={commands} />;
    },
};

registerPlugin(GotFeet);

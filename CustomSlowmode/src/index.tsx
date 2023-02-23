import { get } from "enmity/api/settings";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { Constants, React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import manifest from "../manifest.json";
import { commands } from "./commands";

const defaultSlowmodeValues = [0, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 21600];

const FriendInvites: Plugin = {
    ...manifest,
    onStart() {
        this.commands = commands;
        Constants.SLOWMODE_VALUES = get("_customSlowmode", "slowmodeValues", defaultSlowmodeValues);
    },
    onStop() {
        this.commands = [];
        Constants.SLOWMODE_VALUES = defaultSlowmodeValues;
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={commands} />;
    },
};

registerPlugin(FriendInvites);

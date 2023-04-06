import { reload } from "enmity/api/native";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { Dialog, Linking, React } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import manifest from "../manifest.json";

const ReviewDB: Plugin = {
  ...manifest,
  onStart() {
    // @ts-ignore
    window.enmity.plugins.disablePlugin(manifest.name)

    Dialog.show({
      title: "Oh no!",
      body: "You have installed the old and deprecated version of ReviewDB. Please uninstall this plugin and install the new one.",
      confirmText: "Get the new version",
      cancelText: "Not now",

      onConfirm: () => {
        // @ts-ignore
        window.enmity.plugins.installPlugin("https://raw.githubusercontent.com/StupidityDB/EnmityPlugin/master/dist/ReviewDB.js", ({ data }) => {
          // as a callback, waits for a success of "installed-plugin" or "overriden-plugin"
          // before showing the dialog to reload discord
          data == "installed_plugin" || data == "overridden_plugin"
            ? Dialog.show({
              title: "Upgrade successful!",
              body: "The plugin has been successfully replaced. Would you like to reload Discord now?",
              confirmText: "Yep!",
              cancelText: "Not now",
              // reload discord from native function
              onConfirm: () => { reload() },
            })
            : Dialog.show({
              title: "Error",
              body: `Something went wrong while updating ${manifest['name']}.`,
              confirmText: "Report this issue",
              cancelText: "Cancel",
              onConfirm: () => {
                Linking.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${manifest['name']}%20Upgrade%20Error%3A%20${manifest.version}`);
              }
            });
        })
      },
    });
  },
  onStop() { },
  getSettingsPanel({ settings }): any {
    return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={null}></SettingsPage>
  },
};

registerPlugin(ReviewDB);

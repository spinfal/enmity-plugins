// Dependencies used in the script
import { Dialog, REST, Toasts } from "enmity/metro/common";
import { reload } from "enmity/api/native";
import { Icons } from './icons';

interface Props {
    manifest: object;
}

async function check_for_updates({ manifest }: Props) {
    // get the plugin source
    const url = `${manifest['sourceUrl']}?${Math.floor(Math.random() * 1001)}.js`

    const res = await REST.get(url);
    const content = await res.text;

    // get the version from the source
    let external_version = content.match(/[0-9].[0-9].[0-9]/g);
    if (!external_version) return;

    // format the remote version
    external_version = external_version[0].replaceAll('"', ""); // make the string into a plain version (1.1.6 etc)

    /* 
    i dont need to match specific parts of the version, here are some tests~
        -> version 1.1.6, latest is 1.1.9 (not the same so update)
        -> version 1.1.7 latest is 1.3.2 (not the same so update)
        -> version 1.2.5 latest is 1.2.5 (is the same so no update)
    ~ theres no need to match for if the latest is higher than the current 
        because the latest will always be larger or equal to the current version
    */

    // if the version is not the current one, that means its newer, otherwise run the no update function
    external_version != manifest['version'] ? show_update_dialog(url, external_version, manifest) : no_updates(manifest['name'], manifest['version'])
    return // finish the function
}

const show_update_dialog = (url: string, version: string, manifest: object) => {
    // open a dialog to show that a new version is available
    Dialog.show({
        title: "Update found",
        body: `A newer version is available for ${manifest['name']}.\nWould you like to install version ${version} now?`,
        confirmText: "Update",
        cancelText: "Not now",

        // run the install function
        onConfirm: () => install_plugin(url, version, manifest),
    });
}

const no_updates = (name: string, version: string) => {
    // logs the fact that youre on the latest version with both a toast a
    console.log(`[${name}] is on the latest version (${version})`)
    Toasts.open({ content: `${name} is on the latest version (${version})`, source: Icons.Delete });
}

async function install_plugin(url: string, version: string, manifest: object) {
    //@ts-ignore
    window.enmity.plugins.installPlugin(pluginUrl, ({ data }) => {
        console.log(`${manifest['name']} Update Error`, data);
        // as a callback, waits for a success of "installed-plugin" or "overriden-plugin"
        // before showing the dialog to reload discord
        data == "installed-plugin" || data == "overriden-plugin" ? Dialog.show({
            title: `Updated ${manifest['name']}`,
            body: `Successfully updated to version ${manifest['version']}. \nWould you like to reload Discord now?`,
            confirmText: "Yep!",
            cancelText: "Later",
            // reload discord from native function
            onConfirm: () => { reload() },
        }) : Dialog.show({
            title: "Error",
            body: `Something went wrong while updating ${manifest['name']}.`,
            confirmText: "Report this issue",
            cancelText: "Cancel",
            onConfirm: () => { Dialog.close() },
            onCancel: () => {
                // @ts-ignore
                Router.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${manifest['name']}%20Update%20Error`);
            }
        });
        // otherwise show an error dialog when the update fails ^^^
    })
}

export { check_for_updates }
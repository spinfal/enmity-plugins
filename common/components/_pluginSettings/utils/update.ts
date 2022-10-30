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

    // get the version and build from the source
    let external_version = content.match(/\d\.\d\.\d+/g);
    let external_build = content.match(/patch\-\d\.\d\.\d+/g)
    if (!external_version || !external_build) return no_updates(manifest['name'], manifest['version']);

    // set the versions to their index
    external_version = external_version[0]
    external_build = external_build[0]

    /* 
    i dont need to match specific parts of the version, here are some tests~
        -> version 1.1.6, latest is 1.1.9 (not the same so update)
        -> version 1.1.7 latest is 1.3.2 (not the same so update)
        -> version 1.2.5 latest is 1.2.5 (is the same so no update)
    ~ theres no need to match for if the latest is higher than the current 
        because the latest will always be larger or equal to the current version
    */

    // if the version is not the current one, that means its newer, otherwise run the no update function
    if (external_version != manifest['version']) return show_update_dialog(url, external_version, external_build.split('-')[1], manifest, false)
    if (external_build != manifest['build']) return show_update_dialog(url, external_version, external_build.split('-')[1], manifest, true)
    return no_updates(manifest['name'], manifest['version'])
}

const show_update_dialog = (url: string, version: string, build: string, manifest: object, is_ghost_patch: boolean) => {
    // open a dialog to show that a new version is available
    const type = is_ghost_patch ? build : version
    Dialog.show({
        title: "Update found",
        body: `A newer ${is_ghost_patch ? "build" : "version"} is available for ${manifest['name']}. ${is_ghost_patch ? `\nThe version will remain at ${version}, but the build will update to ${build}.` : ""}\nWould you like to install ${is_ghost_patch ? `build \`${build}\`` : `version \`${version}\``}  now?`,
        confirmText: "Update",
        cancelText: "Not now",

        // run the install function
        onConfirm: () => install_plugin(url, type, manifest, is_ghost_patch),
    });
}

const no_updates = (name: string, type: string) => {
    // logs the fact that youre on the latest version with both a toast a
    console.log(`[${name}] Plugin is on the latest version, which is ${type}`)
    Toasts.open({ content: `${name} is on latest version (${type})`, source: Icons.Settings.Toasts.Settings });
}

async function install_plugin(url: string, type: string, manifest: object, is_ghost_patch: boolean) {
    //@ts-ignore
    window.enmity.plugins.installPlugin(url, ({ data }) => {
        // as a callback, waits for a success of "installed-plugin" or "overriden-plugin"
        // before showing the dialog to reload discord
        data == "installed_plugin" || data == "overridden_plugin"
            ? Dialog.show({
                title: `Updated ${manifest['name']}`,
                body: `Successfully updated to ${is_ghost_patch ? `build` : `version`} \`${type}\`. \nWould you like to reload Discord now?`,
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
                    // @ts-ignore
                    Router.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${manifest['name']}%20Update%20Error%3A%20${!is_ghost_patch ? `v${version}` : `b${version}`}`);
                },
                onCancel: () => { Dialog.close() }
            });
        // otherwise log an issue when updating to console ^^^
    })
}

export { check_for_updates }
// Dependencies used in the script
import { reload } from "enmity/api/native";
import { getByProps } from 'enmity/metro';
import { Dialog, REST, Toasts } from "enmity/metro/common";
import { Icons } from './icons';

const Router = getByProps('transitionToGuild');

interface Props {
    manifest: object;
}

/**
 * It gets the source of the plugin, gets the version and build from the source, and if the version or
 * build is not the same as the current one, it shows an update dialog
 * @param {object} manifest - the manifest of the plugin
 * @returns calls the show_update_dialog function if an update is available, otherwise calls the no_updates function
 */
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

/**
 * It shows a dialog to the user, and if the user confirms, it runs the install function to update the plugin
 * @param {string} url - The URL to the plugin's zip file
 * @param {string} version - The version of the plugin that is available.
 * @param {string} build - The build number of the plugin.
 * @param {object} manifest - the manifest of the plugin
 * @param {boolean} is_ghost_patch - Whether or not the update is a ghost patch.
 */
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

/**
 * It logs the fact that you're on the latest version with both a toast and a console log
 * @param {string} name - The name of the plugin
 * @param {string} type - The type of update, either "major", "minor", or "patch"
 */
const no_updates = (name: string, type: string) => {
    // logs the fact that youre on the latest version with both a toast a
    console.log(`[${name}] Plugin is on the latest version, which is ${type}`)
    Toasts.open({ content: `${name} is on latest version (${type})`, source: Icons.Success });
}

/**
 * It installs a plugin from a given url, and then shows a dialog to reload discord if the plugin was
 * successfully installed otherwise it shows a dialog to the user saying that the plugin failed to install
 * @param {string} url - The URL of the plugin to install
 * @param {string} type - The type of update, either "version" or "build"
 * @param {object} manifest - the manifest of the plugin
 * @param {boolean} is_ghost_patch - boolean
 */
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
                    Router.openURL(`https://github.com/spinfal/enmity-plugins/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D%20${manifest['name']}%20Update%20Error%3A%20${!is_ghost_patch ? `v${type}` : `b${type}`}`);
                }
            });
        // otherwise log an issue when updating to console ^^^
    })
}

export { check_for_updates };

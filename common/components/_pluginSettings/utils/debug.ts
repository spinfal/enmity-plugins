import { Native } from 'enmity/metro/common'
import { get_device_list } from './devices'

/**
 * It returns a string containing the plugin name, version, build, Discord build, software version, and
 * device
 * @param {string} name - The name of your plugin
 * @param {string} version - The version of the plugin
 * @param {string} build - The build number of the plugin.
 * @returns A string
 */
async function debug_info(name: string, version: string, build: string) {
    let devices = await get_device_list() // get list of devices

    return `**[${name}] Debug Information**
> **Plugin Version:** ${version}
> **Plugin Build:** ${(build).split('-')[1]}
> **Discord Build:** ${Native.InfoDictionaryManager.Version} (${Native.InfoDictionaryManager.Build})
> **Software Version:** ${Native.DCDDeviceManager.systemVersion}
> **Device:** ${devices[Native.DCDDeviceManager.device]}`
}

export { debug_info }

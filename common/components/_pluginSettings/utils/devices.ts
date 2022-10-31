import { REST, Storage } from "enmity/metro/common";
import { format_object } from "./format_object";

/**
 * It gets the device list from storage, if it doesn't exist then it fetches it from github, formats
 * it, and sets it to storage
 * @returns A list of all the devices that are available
 */
async function get_device_list() {
    try {
        // try to get the device list already from storage
        let existing = await Storage.getItem("device_list")
        if (existing) return JSON.parse(existing); // if it exists already then just return that

        // if not, then fetch the list from  github
        let res = await REST.get(`https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt`);
        let encoded = res.text; // main list text

        // this function is just a whole bunch of formatting the text into a js object format
        let final = format_object(encoded)

        // set the item to storage and wait for it to resolve
        await Storage.setItem("device_list", final)

        // fetch the list it just set to storage
        let device_list = await Storage.getItem("device_list")
        return JSON.parse(device_list)
    } catch (err) {
        console.warn(`[SpinsPlugins Local Error — Issue when getting devices: ${err}]`)
        return // makes sure all code paths actually return something
    }
}

export { get_device_list }
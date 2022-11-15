/*
    Thank you Acquite for this detailed compatibility check.
*/

import { Dialog, Native, Storage } from "enmity/metro/common";
import { get_device_list } from "./devices";

/**
 * It checks if the device is an iPhone, and if it is, it checks if it's an iPhone X or below, and if
 * it is, it shows a dialog saying that the plugin may not behave correctly.
 * @param {object} manifest - object - The manifest of the app.
 */
async function check_if_compatible_device(manifest: object) {
    let device = Native.DCDDeviceManager.device; // current device
    let devices = await get_device_list() // list of devices

    // first check if the device is an iPhone as this issue only occurs on iPhone models
    if (device.includes("iPhone")) {
        device = device.replace("iPhone", "") // remove the word iPhone (iPhone12,8) -> (12,8)
        device = device.replace(",", ".") // replace the comma (,) with a dot (.) to make the number formattable as a float
        if (
            // checks all iphones under iPhone X which arent "iPhone X Global"
            (parseFloat(device) < 10.6 && parseFloat(device) != 10.3)
            // triggers if the device is iPhone SE 3rd Gen or 2nd Gen
            || parseFloat(device) == 14.6
            || parseFloat(device) == 12.8
        ) {
            Storage.getItem(`__${manifest["name"]}_incompatible_dialog__`).then((res: any) => {
                // opens a dialog showing the message that the iPhone model in question may cause issues.
                res ?? Dialog.show({
                    title: "Incompatible iPhone",
                    body: `Please note that you're on an${devices[Native.DCDDeviceManager.device]}.\nSome features in ${manifest["name"]} may behave in an unexpected manner.`,
                    confirmText: "Don't show again",
                    cancelText: "Close",
                    onConfirm: () => Storage.setItem(`__${manifest["name"]}_incompatible_dialog__`, "true")
                })
            })
        }
    }
}

export { check_if_compatible_device };

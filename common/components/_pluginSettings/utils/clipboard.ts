// imports needed to use
import { Toasts } from "enmity/metro/common";
import { Icons } from "./icons";

/**
 * Shows a toast that informs the user that the text was copied to the clipboard
 * @param {string} originSource - The string indicating what has been copied
 */
const clipboard_toast = (originSource: string) => {
    Toasts.open({ content: `Copied ${originSource} to clipboard.`, source: Icons.Clipboard });
}

export { clipboard_toast };

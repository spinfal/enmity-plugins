import { FormRow, ScrollView } from "enmity/components";
import { React, Dialog } from "enmity/metro/common";
import * as plugins from "enmity/managers/plugins";
import { reload } from "enmity/api/native";
interface Props {
    pluginUrl: string;
}

export default ({ pluginUrl }: Props) => {
    return (
        <FormRow
            label="Update Plugin"
            trailing={FormRow.Arrow}
            onPress={() => {
                console.log(pluginUrl);
                plugins.installPlugin(`${pluginUrl}?${Math.floor(Math.random() * 1001)}.js`);
                Dialog.show({
                    title: "Plugin Update",
                    body: "Updating the plugin using this button will require you to reload Discord. Would you like to reload Discord now?",
                    confirmText: "Yep!",
                    cancelText: "Later",
                    onConfirm: reload,
                });
            }}
        />
    );
};

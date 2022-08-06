import { FormRow, ScrollView } from "enmity/components";
import { React, Toasts } from "enmity/metro/common";
import * as plugins from "enmity/managers/plugins";
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
            }}
        />
    );
};

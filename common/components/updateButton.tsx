import { FormRow, ScrollView } from "enmity/components";
import { React, Toasts } from "enmity/metro/common";
import { installPlugin } from "enmity/managers/plugins";
interface Props {
  pluginUrl: string;
}

export default ({ pluginUrl }: Props) => {
  return (
    <FormRow
      label="Update plugin"
      trailing={FormRow.Arrow}
      onPress={() => {
        console.log(pluginUrl);
        installPlugin(
          `${pluginUrl}?${Math.random() * 1001}.js`,
          () => {
            Toasts.show({
              content: "Plugin updated.",
              type: "success",
            });
          }
        );
      }}
    />
  );
};

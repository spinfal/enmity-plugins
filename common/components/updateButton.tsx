import { FormRow, ScrollView } from "enmity/components";
import { React } from "enmity/metro/common";
import * as Plugins from "enmity/managers/plugins";
interface Props {
  pluginUrl: string;
}

export default ({ pluginUrl }: Props) => {
  return (
    <FormRow
      label="Reset messageStore"
      trailing={FormRow.Arrow}
      onPress={() => {
        Plugins.installPlugin(
          `${pluginUrl}?${Math.random() * 101}.js`,
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

import { FormRow, ScrollView } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { React } from 'enmity/metro/common';
import UpdateButton from '../../../common/components/updateButton'
interface SettingsProps {
  settings: SettingsStore;
  pluginUrl: string;
}

export default ({ settings, pluginUrl }: SettingsProps) => {
  return (
    <ScrollView>
        <UpdateButton pluginUrl={pluginUrl} />
    </ScrollView>
  );
};
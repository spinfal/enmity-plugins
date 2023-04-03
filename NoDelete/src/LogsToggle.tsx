
import { FormRow, FormSection } from 'enmity/components';
import { NavigationNative } from 'enmity/metro/common';
import { Icons } from '../../common/components/_pluginSettings/utils';
import Logs from './Logs';

export default ({ styles, renderPage }) => {
    const Navigation = NavigationNative.useNavigation();

    return <FormSection title="Message Logs">
        <FormRow
            label="View Message Logs"
            subLabel="Tap on an item to copy to clipboard"
            leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Debug} />}
            onPress={() => {
                renderPage(Navigation, {
                    pageName: "NoDelete Message Logs",
                    pagePanel: Logs
                })
            }}
        />
    </FormSection>
}
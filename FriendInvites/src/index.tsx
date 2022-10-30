import { FormSection, FormRow, FormDivider } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { commands } from './commands';
import { getByKeyword, bulk, filters } from "enmity/metro";
import { React, Constants, StyleSheet } from "enmity/metro/common";
import { Icons, clipboard_toast } from "../../common/components/_pluginSettings/utils";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";

const [
    Clipboard // used to copy the dl link to keyboard
] = bulk(
    filters.byProps('setString')
);

const styles = StyleSheet.createThemedStyleSheet({
    icon: {
        color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    },
    item: {
        color: Constants.ThemeColorMap.TEXT_MUTED
    },
    text_container: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const FriendInvites: Plugin = {
    ...manifest,
    async onStart() {
        this.commands = commands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        const [invites, setInvites] = React.useState()
        React.useEffect(async function () {
            setInvites(await getByKeyword('friendinvite').getAllFriendInvites())
        }, [])

        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={
            <>
                {invites && <FormSection title="Invite Links">
                    {invites.map((invite) => {
                        return <FormRow
                            key={invite['code']}
                            label={`discord.gg/${invite['code']}`}
                            subLabel={`This invite has been used ${invite['uses']} times out of ${invite['max_uses']} and will expire ${new Date(invite['expires_at']).toLocaleString()}`}
                            leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Share} />}
                            trailing={FormRow.Arrow}
                            onPress={function () {
                                Clipboard.setString(`discord.gg/${invite['code']}`); // copy the command to clipboard`
                                clipboard_toast(`the invite discord.gg/${invite['code']}`);
                            }}
                        />
                    })}
                </FormSection >}
                <FormDivider />
            </>
        } commands={commands} />;
    },
};

registerPlugin(FriendInvites);

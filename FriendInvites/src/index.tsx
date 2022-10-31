import { FormSection, FormRow, FormDivider } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { commands } from './commands';
import { getByKeyword, bulk, filters } from "enmity/metro";
import { React, Constants, StyleSheet, Dialog, Toasts } from "enmity/metro/common";
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
    onStart() {
        this.commands = commands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }): any {
        const [invites, setInvites] = React.useState(null)
        React.useEffect(async function () {
            const inviteLinks = await getByKeyword('friendinvite').getAllFriendInvites();

            (!inviteLinks || inviteLinks.length === 0) ? setInvites(null) : setInvites(inviteLinks)
        }, [])

        return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={
            <>
                <FormSection title="Invite Links">
                    {invites && (<>
                        {
                            invites.map((invite) => {
                                return <FormRow
                                    key={invite['code']}
                                    label={`discord.gg/${invite['code']}`}
                                    subLabel={`This invite has been used ${invite['uses']} times out of ${invite['max_uses']} and will expire ${new Date(invite['expires_at']).toLocaleString()}`}
                                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Share} />}
                                    trailing={FormRow.Arrow}
                                    onPress={function () {
                                        Clipboard.setString(`discord.gg/${invite['code']}`); // copy the invite to clipboard
                                        clipboard_toast(`the invite discord.gg/${invite['code']}`);
                                    }}
                                    onLongPress={function () {
                                        Dialog.show({
                                            title: "Revoke friend invites",
                                            body: "Would you like to revoke all friend invites?\nThis action is permanent and cannot be undone.",
                                            confirmText: "Revoke",
                                            cancelText: "Cancel",
                                            onConfirm: () => {
                                                getByKeyword('friendinvite').revokeFriendInvites().then(() => {
                                                    getByKeyword('friendinvite').getAllFriendInvites().then((inviteLinks: any) => {
                                                        if (!inviteLinks || inviteLinks.length == 0) {
                                                            Toasts.open({ content: "Friends invites have been revoked", source: Icons.Settings.Toasts.Settings });
                                                            return
                                                        } else {
                                                            console.log('[ revokeFriendInvites Response ]', inviteLinks);
                                                            Toasts.open({ content: "Something went wrong. Invite list sent to console", source: Icons.Failed });
                                                        }
                                                    }).catch((err: any) => {
                                                        console.log('[ revokeFriendInvites Response ]', err);
                                                        Toasts.open({ content: "Something went wrong. Details sent to console", source: Icons.Failed });
                                                    })
                                                });
                                            }
                                        });
                                    }}
                                />
                            })
                        }
                    </>) || (<>
                        <FormRow
                            key={Math.floor(Math.random() * 1001)}
                            label="Create a friend invite"
                            subLabel="You do not have any friend invites! Try creating one."
                            leading={<FormRow.Icon style={styles.icon} source={Icons.Add} />}
                            trailing={FormRow.Arrow}
                            onPress={function () {
                                getByKeyword('friendinvite').createFriendInvite().then((invite: object) => {
                                    if (!invite) {
                                        console.log('[ createFriendInvite Response ]', invite);
                                        Toasts.open({ content: "Something went wrong. Invite list sent to console", source: Icons.Failed });
                                    } else {
                                        Clipboard.setString(`discord.gg/${invite['code']}`); // copy the invite to clipboard
                                        clipboard_toast(`the invite discord.gg/${invite['code']}`);
                                    }
                                }).catch((err: any) => {
                                    console.log('[ createFriendInvite Response ]', err);
                                    Toasts.open({ content: "Something went wrong. Details sent to console", source: Icons.Failed });
                                })
                            }}
                        />
                    </>)}
                </FormSection >
                <FormDivider />
            </>
        } commands={commands} />;
    },
};

registerPlugin(FriendInvites);

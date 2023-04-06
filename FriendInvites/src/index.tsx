import { get, set } from "enmity/api/settings";
import { FormDivider, FormRow, FormSection } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { bulk, filters } from "enmity/metro";
import { Constants, Dialog, React, StyleSheet, Toasts, Users } from "enmity/metro/common";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons, clipboard_toast } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";
import { commands } from "./commands";

const [
  friendInvites,
  API,
  v4,
  Clipboard,
  currentUser,
] = bulk(
  filters.byProps("getAllFriendInvites"),
  filters.byProps("get", "post"),
  filters.byProps("v4"),
  filters.byProps("setString"),
  filters.byProps("getCurrentUser")
);

const styles = StyleSheet.createThemedStyleSheet({
  icon: {
    color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
  },
  item: {
    color: Constants.ThemeColorMap.TEXT_MUTED
  },
  text_container: {
    display: "flex",
    flexDirection: "column"
  }
});

const FriendInvites: Plugin = {
  ...manifest,
  onStart() {
    this.commands = commands;
  },
  onStop() {
    this.commands = [];
  },
  patches: [],
  getSettingsPanel({ settings }): any {
    const [invites, setInvites] = React.useState(null)
    React.useEffect(() => {
      friendInvites.getAllFriendInvites().then((inviteLinks: any) => {
        (!inviteLinks || inviteLinks.length === 0) ? setInvites(null) : setInvites(inviteLinks)
      }).catch((err: any) => {
        console.log("[ getAllFriendInvites Error ]", err);
        Toasts.open({ content: "Something went wrong. Error details sent to console", source: Icons.Failed });
      });
    }, []);

    return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={commands}>
      <FormSection title="Invite Links">
        {invites && (<>
          {
            invites.map((invite: object) => {
              return <FormRow
                key={invite["code"]}
                label={`discord.gg/${invite["code"]}`}
                subLabel={`This invite has been used ${invite["uses"]} times out of ${invite["max_uses"]} and will expire ${new Date(invite["expires_at"]).toLocaleString()}`}
                leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Share} />}
                trailing={FormRow.Arrow}
                onPress={() => {
                  Clipboard.setString(`discord.gg/${invite["code"]}`); // copy the invite to clipboard
                  clipboard_toast(`the invite discord.gg/${invite["code"]}`);
                }}
                onLongPress={() => {
                  Dialog.show({
                    title: "Revoke friend invites",
                    body: "Would you like to revoke all friend invites?\nThis action is permanent and cannot be undone.",
                    confirmText: "Revoke",
                    cancelText: "Cancel",
                    onConfirm: () => {
                      friendInvites.revokeFriendInvites().then(() => {
                        friendInvites.getAllFriendInvites().then((inviteLinks: any) => {
                          if (!inviteLinks || inviteLinks.length == 0) {
                            Toasts.open({ content: "Friends invites have been revoked", source: Icons.Success });
                            setInvites(null);
                          } else {
                            console.log("[ revokeFriendInvites Response ]", inviteLinks);
                            Toasts.open({ content: "Something went wrong. Invite list sent to console", source: Icons.Failed });
                          }
                        }).catch((err: any) => {
                          console.log("[ revokeFriendInvites Response ]", err);
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
            onPress={() => {
              if (!currentUser.getCurrentUser().phone) Dialog.show({
                title: "Oh no!",
                body: "Using friend invites requires you to have a phone number linked. This is a Discord limitation for some odd reason. You can still try the plugin, however you will be met with errors.",
                confirmText: "Okay",
                cancelText: "So stupid",
              });

              const uuid = v4.v4();
              API.post({ url: '/friend-finder/find-friends', body: { modified_contacts: { [uuid]: [1, '', ''] } } }).then((x: object) => friendInvites.createFriendInvite({ "code": x["body"]["invite_suggestions"][0][3], "recipient_phone_number_or_email": uuid })).catch((error: any) => console.log("[ createFriendInvite Error ]", error)).then((invite: any) => {
                if (!invite) {
                  console.log("[ createFriendInvite Error ]", invite);
                  Toasts.open({ content: "Something went wrong. Error details sent to console", source: Icons.Failed });
                } else {
                  Toasts.open({ content: "Friend invite created", source: Icons.Success });
                  Clipboard.setString(`discord.gg/${invite["code"]}`); // copy the invite to clipboard
                  clipboard_toast(`the invite discord.gg/${invite["code"]}`);

                  friendInvites.getAllFriendInvites().then((inviteLinks: any) => {
                    (!inviteLinks || inviteLinks.length === 0) ? setInvites(null) : setInvites(inviteLinks)
                  }).catch((err: any) => {
                    console.log("[ getAllFriendInvites Error ]", err);
                    Toasts.open({ content: "Something went wrong. Error details sent to console", source: Icons.Failed });
                  });
                }
              })
            }}
          />
        </>)}
      </FormSection >
      <FormDivider />
    </SettingsPage>
  },
};

registerPlugin(FriendInvites);

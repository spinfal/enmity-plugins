// main imports of elements and dependencies
import { FormDivider, FormRow, ScrollView, FormSwitch, FormSection, Text } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { React, Toasts, Constants, StyleSheet, Navigation, Storage } from 'enmity/metro/common';
import { bulk, filters } from 'enmity/metro';
import Credits from './credits';
import { debug_info, clipboard_toast, Icons, check_for_updates } from './utils';

// main settingsStore and manifest interface
interface SettingsProps {
  settings: SettingsStore;
  manifest: object;
  hasToasts: boolean;
  section: object;
}

// main declaration of modules being altered by the plugin
const [
  Router, // used to open a url externally
  Clipboard // used to copy the dl link to keyboard
] = bulk(
  filters.byProps('transitionToGuild'),
  filters.byProps('setString')
);

export default ({ manifest, settings, hasToasts, section }: SettingsProps) => {
  // icon and styles

  const styles = StyleSheet.createThemedStyleSheet({
    icon: {
      color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    },
    item: {
      color: Constants.ThemeColorMap.TEXT_MUTED
    }
  }); // main stylesheet

  const [touchX, setTouchX] = React.useState() // the start x position of swiping on the screen
  const [touchY, setTouchY] = React.useState() // the start y position of swiping on the screen;

  return <>
    <ScrollView
      onTouchStart={e => {
        // set them to new position
        setTouchX(e.nativeEvent.pageX)
        setTouchY(e.nativeEvent.pageY)
      }
      }
      onTouchEnd={e => {
        // only triggers if x is negative over 100 (moved right) and y is more than -40 but less than 40 (not much movement)
        if (
          touchX - e.nativeEvent.pageX < -100
          && touchY - e.nativeEvent.pageY < 40
          && touchY - e.nativeEvent.pageY > -40
        ) {
          Navigation.pop() // removes the page from the stack
        }
      }}
    >
      <Credits manifest={manifest} /* main credits gui, created from scratch exclusively for dislate */ />
      {section}
      <FormSection title="Utility">
        {hasToasts && <>
          <FormRow
            label='Initialization Toasts'
            leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Toasts.Context} />}
            subLabel={`If available, show toasts when ${manifest['name']} is starting`}
            trailing={
              <FormSwitch
                value={settings.getBoolean(`${manifest['name']}-toastEnable`, false)} // main toast function function
                onValueChange={() => {
                  settings.toggle(`${manifest['name']}-toastEnable`, false)
                  Toasts.open({
                    content: `Successfully ${settings.getBoolean(`${manifest['name']}-toastEnable`, false) ? 'enabled' : 'disabled'} Initialization Toasts.`,
                    source: Icons.Settings.Toasts.Settings
                  }); // overwrites it with the opposite
                }
                }
              />
            }
          />
          <FormDivider />
        </>}

        <FormRow
          label='Copy Debug Info'
          subLabel={`Copy useful debug information of ${manifest['name']} to clipboard.`}
          leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Debug} />}
          trailing={FormRow.Arrow}
          onPress={async function () {
            Clipboard.setString(await debug_info(manifest['name'], manifest['version']));
            clipboard_toast('plugin debug information');
          }}
        />
        <FormDivider />
        <FormRow
          label='Clear Device List Cache'
          subLabel={`Remove the fetched device list storage. This will not clear Discord's or your iDevice's cache.`}
          leading={<FormRow.Icon style={styles.icon} source={Icons.Delete} />}
          trailing={FormRow.Arrow}
          onPress={async function () {
            await Storage.removeItem('device_list') // removes the item and waits for promise resolve
            Toasts.open({
              content: `Cleared device list storage.`,
              source: Icons.Settings.Toasts.Settings
            }); // declares success
          }}
        />
      </FormSection>
      <FormSection title="Source">
        <FormRow
          label="Check for Updates"
          subLabel={`Check for any plugin updates for ${manifest['name']}.`}
          leading={<FormRow.Icon style={styles.icon} source={Icons.Copy} />}
          trailing={FormRow.Arrow}
          onPress={() => {
            check_for_updates({ manifest })
          }}
        />
        <FormDivider />
        <FormRow
          label="Source"
          subLabel={`View ${manifest['name']} source code`}
          leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
          trailing={FormRow.Arrow}
          onPress={() => {
            Router.openURL(`https://github.com/spinfal/enmity-plugins/tree/master/${manifest['name']}`)
          }}
        />
      </FormSection>
      <FormRow label={`Plugin Version: ${manifest['version']}`} />
    </ScrollView>
  </>
};
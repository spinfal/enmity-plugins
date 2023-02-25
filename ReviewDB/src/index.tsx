import { get, set } from "enmity/api/settings";
import { FormDivider, FormInput, FormRow, FormSection } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { Linking, React, Users } from "enmity/metro/common";
import { create } from "enmity/patcher";
import { findInReactTree } from "enmity/utilities";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";
import Reviews from "./utils/Reviews";

const Patcher = create(manifest.name);
const UserProfile = getByProps("PRIMARY_INFO_TOP_OFFSET", "SECONDARY_INFO_TOP_MARGIN", "SIDE_PADDING");

const ReviewDB: Plugin = {
  ...manifest,
  onStart() {
    let currentUserID = get(manifest.name, "currentUser", undefined) as string | undefined;
    let currentUserAttempts = 0;
    const ensureCurrentUserInitialized = () => {
      if (currentUserID || currentUserAttempts >= 3) return;
      currentUserAttempts++;
      setTimeout(() => {
        currentUserID = Users.getCurrentUser().id;
        if (!currentUserID) return ensureCurrentUserInitialized();
        set(manifest.name, "currentUser", currentUserID);
      }, 500);
    }

    ensureCurrentUserInitialized();

    /*
      massive huge thanks to rosie. :3
      https://github.com/acquitelol
    */
    Patcher.after(UserProfile.default, "type", (_, __, res) => {
      const profileCardSection = findInReactTree(res, r =>
        r?.props?.children.find((res: any) => typeof res?.props?.displayProfile?.userId === "string")
        && r?.type?.displayName === "View"
        && Array.isArray(r?.props?.style)
      )

      if (!profileCardSection) return res;

      const { userId } = profileCardSection.props.children?.find((r: any) => typeof r?.props?.displayProfile?.userId === "string")?.props?.displayProfile ?? {};

      if (!userId) return res

      profileCardSection.props.children.push(<Reviews userID={userId} currentUserID={currentUserID as string} />)
    });
  },
  onStop() {
    Patcher.unpatchAll();
  },
  getSettingsPanel({ settings }): any {
    return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={null}>
      {/* @ts-ignore */}
      <FormSection title="Plugin Settings">
        <FormRow
          // @ts-ignore
          label="Get ReviewDB Auth Token"
          trailing={FormRow.Arrow}
          // @ts-ignore
          leading={<FormRow.Icon source={Icons.Settings.Self} />}
          onPress={() => {
            Linking.openURL("https://discord.com/api/v9/oauth2/authorize?client_id=915703782174752809&response_type=code&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&scope=identify")
          }}
        />
        <FormDivider />
        <FormInput
          placeholder="token"
          value={get(manifest.name, "rdbToken", "")}
          onChange={(value: string) => (/^[A-Za-z0-9]{30,32}$/.test(value) ? set(manifest.name, "rdbToken", value.trim()) : set(manifest.name, "rdbToken", ""))}
          title="ReviewDB Auth Token"
        />
      </FormSection>
    </SettingsPage>
  },
};

registerPlugin(ReviewDB);

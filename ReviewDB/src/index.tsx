import { get, set } from "enmity/api/settings";
import { FormDivider, FormInput, FormRow, FormSection } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { React, Users } from "enmity/metro/common";
import { create } from "enmity/patcher";
import { findInReactTree } from "enmity/utilities";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";
import Reviews from "./utils/Reviews";
import { showOAuth2Modal } from './utils/RDBAPI';

const Patcher = create(manifest.name);
const UserProfile = getByProps("PRIMARY_INFO_TOP_OFFSET", "SECONDARY_INFO_TOP_MARGIN", "SIDE_PADDING");

const ReviewDB: Plugin = {
  ...manifest,
  async onStart() {
    let currentUserID = get(manifest.name, "currentUser", undefined) as string | undefined;
    let currentUserAttempts = 0;

    const ensureCurrentUserInitialized = () => {
      if (currentUserID || currentUserAttempts >= 20) return;
      currentUserAttempts++;
      setTimeout(() => {
        currentUserID = Users.getCurrentUser().id;
        if (!currentUserID) return ensureCurrentUserInitialized();
        set(manifest.name, "currentUser", currentUserID);
      }, 25);
    }

    ensureCurrentUserInitialized();

    const admins = await fetch(manifest.API_URL + "/admins")
      .then(res => res.json())

    /*
      massive huge thanks to rosie. :3
      https://github.com/acquitelol
    */
    Patcher.after(UserProfile.default, "type", (_, __, res) => {
      const profileCardSection = findInReactTree(res, r =>
        r?.props?.children.find((res: any) => typeof res?.props?.displayProfile?.userId === "string")
        && r?.type?.displayName === "View"
        && Array?.isArray(r?.props?.style)
      )?.props?.children

      if (!profileCardSection) return res;

      const { userId } = profileCardSection?.find((r: any) => typeof r?.props?.displayProfile?.userId === "string")?.props?.displayProfile ?? {};

      if (!userId) return res

      profileCardSection?.push(<Reviews userID={userId} currentUserID={currentUserID as string} admins={admins} />)
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
          label="Authenticate with ReviewDB"
          subLabel="Open a modal to authenticate your account with the ReviewDB API."
          trailing={FormRow.Arrow}
          // @ts-ignore
          leading={<FormRow.Icon source={Icons.Settings.Self} />}
          onPress={() => showOAuth2Modal()}
        />
        <FormDivider />
        <FormInput
          placeholder="Your token goes here"
          value={get(manifest.name, "rdbToken", "")}
          onChange={(value: string) => (/^[A-Za-z0-9]{30,32}$/.test(value) 
            ? set(manifest.name, "rdbToken", value.trim()) 
            : set(manifest.name, "rdbToken", ""))}
          title="ReviewDB Authentication Token"
        />
      </FormSection>
    </SettingsPage>
  },
};

registerPlugin(ReviewDB);

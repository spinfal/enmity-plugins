import { get, set } from "enmity/api/settings";
import { FormDivider, FormInput, FormRow, FormSection } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByKeyword, getByProps } from "enmity/metro";
import { Linking, React } from "enmity/metro/common";
import { create } from "enmity/patcher";
import { findInReactTree } from "enmity/utilities";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";
import Reviews from "./utils/Reviews";

const Patcher = create("reviewdb");
const UserProfile = getByProps("PRIMARY_INFO_TOP_OFFSET", "SECONDARY_INFO_TOP_MARGIN", "SIDE_PADDING");

const ReviewDB: Plugin = {
  ...manifest,
  onStart() {
    /*
      massive huge thanks to rosie. they are v cool and they make very cool code.
      https://github.com/acquitelol
    */
    Patcher.after(UserProfile.default, "type", (_, __, res) => {
      const profileCardSection = findInReactTree(res, r =>
        r?.props?.children.find((res: any) => typeof res?.props?.displayProfile?.userId === "string")
        && r?.type?.displayName === "View"
        && Array.isArray(r?.props?.style)
      )?.props?.children

      if (!profileCardSection) return res;

      const { userId } = profileCardSection?.find((r: any) => typeof r?.props?.displayProfile?.userId === "string")?.props?.displayProfile ?? {};

      if (/**
           * If this is true, @arg userId was not found.
           */
        !userId
      ) return res

      /**
       * @param {any} review: User reviews that will display in the user"s profile
       */
      profileCardSection.push(<Reviews userID={userId} currentUserID={getByKeyword('getCurrentUser').getCurrentUser().id} />)
    });
  },
  onStop() {
    Patcher.unpatchAll();
  },
  patches: [],
  getSettingsPanel({ settings }): any {
    return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} section={
      <>
        <FormSection title="Plugin Settings">
          <FormRow
            label="Get ReviewDB Auth Token"
            trailing={FormRow.Arrow}
            leading={<FormRow.Icon source={Icons.Settings.Self} />}
            onPress={() => {
              Linking.openURL("https://discord.com/api/v9/oauth2/authorize?client_id=915703782174752809&response_type=code&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth%3FclientMod%3Denmity&scope=identify")
            }}
          />
          <FormDivider />
          <FormInput
            placeholder="token"
            value={get("_rdb", "rdbToken", "")}
            onChange={(value: string) => (/^[A-Za-z0-9]{30,32}$/.test(value) ? set("_rdb", "rdbToken", value.trim()) : set("_rdb", "rdbToken", ""))}
            title="ReviewDB Auth Token"
          />
        </FormSection>
      </>
    } commands={null} />;
  },
};

registerPlugin(ReviewDB);

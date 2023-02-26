import { get, set, SettingsStore } from "enmity/api/settings";
import { FormRow, FormSection, FormSwitch } from "enmity/components";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { Messages, React, Toasts } from "enmity/metro/common";
import { create } from "enmity/patcher";
import SettingsPage from "../../common/components/_pluginSettings/settingsPage";
import { Icons } from "../../common/components/_pluginSettings/utils";
import manifest from "../manifest.json";

interface SettingsProps {
  settings: SettingsStore;
}

const sarpGaveMeAnImageAndIhadToWriteAllOfTheseByHand = [
  "wig snatched",
  "its giving",
  "period sis",
  "yasss you ate it",
  "omg thats so charli xcx",
  "you go girliepop!",
  "slay it babes",
  "nauurrrrr snatched that wig",
  "you flopped and tanked",
  "ATE XOXOXO",
  "keysmashed it queen",
  "omg yass skinny legend",
  "HELP YOU ATE THAT-",
  "slay it girliepop you literally devoured that",
  "period pooh...",
  "YASS HAILY UR A QUEEN...",
  "you chewed that",
  "you go doll xoxo",
  "work that tush biatch",
  "um yes queen skinny legend versace boots the house down slay queen hunty mama and oop daddy work charli xcx snatch my wig"
]

const Patcher = create(manifest.name);

const slayify: Plugin = {
  ...manifest,
  onStart() {
    try {
      Patcher.before(Messages, "sendMessage", (_self, args, _orig) => {
        const phrase = sarpGaveMeAnImageAndIhadToWriteAllOfTheseByHand[Math.floor(Math.random() * sarpGaveMeAnImageAndIhadToWriteAllOfTheseByHand.length)]
        const content = args[1]["content"].trim()

        args[1]["content"] = (get(manifest.name, "_mode", "append") === "append" ? `${content} ${phrase}` : phrase)
      });
    } catch (err) {
      console.log(`[ ${manifest.name} Error ]`, err);
    }
  },
  onStop() {
    Patcher.unpatchAll();
  },
  patches: [],
  getSettingsPanel({ settings }: SettingsProps) {
    return <SettingsPage manifest={manifest} settings={settings} hasToasts={false} commands={null}>
      <FormSection title="Plugin Settings">
        <FormRow
          label="Replace your messages"
          leading={<FormRow.Icon source={Icons.Pencil} />}
          trailing={
            <FormSwitch
              value={settings.getBoolean("_textMode", false)}
              onValueChange={() => {
                try {
                  settings.toggle("_textMode", false);
                  if (settings.getBoolean("_textMode", false)) {
                    set(manifest.name, "_mode", "replace");
                  } else {
                    set(manifest.name, "_mode", "append");
                  }
                  Toasts.open({
                    content: `Switched to ${get(manifest.name, "_mode", "append")} mode.`,
                    source: Icons.Success,
                  });
                } catch (err) {
                  console.log(`[ ${manifest.name} Error ]`, err);

                  Toasts.open({
                    content: "An error has occurred. Check debug logs for more info.",
                    source: Icons.Failed,
                  });
                }
              }}
            />
          }
        />
        <FormRow
          label="Include large phrase"
          leading={<FormRow.Icon source={Icons.Cancel} />}
          trailing={
            <FormSwitch
              value={settings.getBoolean("_largePhrase", false)}
              onValueChange={() => {
                try {
                  settings.toggle("_largePhrase", false);
                  if (settings.getBoolean("_largePhrase", false)) {
                    set(manifest.name, "_large", "include");
                    sarpGaveMeAnImageAndIhadToWriteAllOfTheseByHand.push("slay it girliepop you literally devoured that its like giving period sistah yass thats so paris nicole you go girlie pop period work that tush babe i mean period i guess yasss its giving so slay charli xcx yas queen skinny legernd versace boots the house down you literally chewed devoured ate that! walk em like a dog poo you literally slayed that ;-; !!!!! thats so barbie doll nicki minaj ayesha nicole smith!!!!! HELP ME SKSKSKS YOU ATE IT GIRL! YOU BETTER WORK BITCH! PERIOD SLAYED IT POOH! STAY CHARLI XCX AND STREAM SUPER FREAKY GIRL! YOU ATE THAT!!!")
                  } else {
                    set(manifest.name, "_large", "exclude");
                    sarpGaveMeAnImageAndIhadToWriteAllOfTheseByHand.pop()
                  }
                  Toasts.open({
                    content: `Large phrase ${get(manifest.name, "_large", "exclude")}d.`,
                    source: Icons.Success,
                  });
                } catch (err) {
                  console.log(`[ ${manifest.name} Error ]`, err);

                  Toasts.open({
                    content: "An error has occurred. Check debug logs for more info.",
                    source: Icons.Failed,
                  });
                }
              }}
            />
          }
        />
      </FormSection>
    </SettingsPage>
  },
};

registerPlugin(slayify);

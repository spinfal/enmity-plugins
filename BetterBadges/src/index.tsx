import * as p from "enmity/patcher";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByDisplayName, getByProps } from "enmity/metro";
import { create } from "enmity/patcher";
import { React, Theme, Toasts } from "enmity/metro/common";
import manifest from "../manifest.json";
import * as Assets from "enmity/api/assets";
import { Image, TouchableOpacity, View } from "enmity/components";
import { default as wrapInHooks } from "./wrapInHooks";

interface Badge {
  name: string;
  id: string;
  script: string;
  url: {
    dark: string;
    light: string;
  };
}
const BadgesUrl =
  "https://raw.githubusercontent.com/notmarek/enmitybadges/main/";
const Patcher = p.create("BetterBadges");
const Badges = getByDisplayName("ProfileBadges", { default: false });

const BetterBadges: Plugin = {
  ...manifest,
  onStart() {},
  onStop() {
    p.unpatchAll("badges");

    Patcher.after(
      Badges,
      "default",
      (_, [{ user, isEnmity, ...rest }], res) => {
        if (isEnmity) return;
        const [badges, setBadges] = React.useState([]);
        React.useEffect(() => {
          try {
            fetchUserBadges(user.id).then(setBadges);
          } catch (e) {
            console.error(`Failed to request/parse badges for ${user.id}`);
          }
        }, []);

        if (!badges.length) return res;
        if (!res) {
          res = wrapInHooks(Badges.default)({
            user: new Proxy(
              {},
              {
                get: (_, prop) => {
                  if (prop === "flags") {
                    return -1;
                  }

                  return user[prop];
                },
              }
            ),
            isEnmity: true,
            ...rest,
          });

          res.props.badges = [];
        }

        res.props.badges.push(
          ...badges.map((badge) => (
            <View
              key={badge}
              __enmity={true}
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Badge type={badge} />
            </View>
          ))
        );

        return res;
      }
    );

    Patcher.unpatchAll();
  },
  patches: [],
};

function Badge({ type }: { type: string }) {
  const [badge, setBadge] = React.useState(null);

  React.useEffect(() => {
    try {
      fetchBadge(type).then(setBadge);
    } catch (e) {
      console.error(`Failed to get badge data for ${type}.`, e.message);
    }
  }, []);

  if (!badge?.url) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        Toasts.open({
          content: badge.name,
          source: { uri: badge.url[Theme.theme] },
        });
      }}
    >
      <Image
        source={{ uri: badge.url[Theme.theme] }}
        style={{
          width: 24,
          height: 24,
          resizeMode: "contain",
          marginHorizontal: 2,
        }}
      />
    </TouchableOpacity>
  );
}

async function fetchUserBadges(id: string): Promise<string[]> {
  const res = await fetch(`${BadgesUrl}${id}.json`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then((r) => r.json())
    .catch(() => []);
  return res;
}

async function fetchBadge(type: string): Promise<Badge> {
  const res = await fetch(`${BadgesUrl}data/${type}.json`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then((r) => r.json())
    .catch(() => {});
  return res;
}

registerPlugin(BetterBadges);

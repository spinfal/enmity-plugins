import { Image, Text, TouchableOpacity, View, FormRow } from "enmity/components";
import { bulk, filters } from "enmity/metro";
import { Profiles, React, Users } from 'enmity/metro/common';
import styles from "./StyleSheet";
import { ReviewContentProps } from "./types";
import { Toasts } from 'enmity/metro/common';
import { Icons } from '../../../common/components/_pluginSettings/utils/icons';

const [
  { ProfileGradientCard }, // used to render a card with the external colors being the user's profile theme. requires padding tobe set as a result.
  ProfileFetcher
] = bulk(
  filters.byProps("ProfileGradientCard"),
  filters.byProps("fetchProfile")
);

interface ReviewProps {
  item: ReviewContentProps;
  onSubmit: Function;
}

export default ({ item, onSubmit }: ReviewProps) => {
  const [formattedTime, setFormattedTime] = React.useState<string>();

  React.useEffect(() => {
    Boolean(item["timestamp"]) && setFormattedTime(new Date(item["timestamp"] * 1000)
        .toLocaleString(undefined, { 
            hour: 'numeric', 
            minute: 'numeric', 
            day: 'numeric', 
            month: 'numeric', 
            year: 'numeric' })
        .split(",")
        .map(item => item.replace(/ /g, ""))
        .reverse()
        .join(" "))
  })


  // This was a lot easier than i thought, it automatically uses the correct profile theme colors when rendered.
  // if the user has no profile theme colors or this is not rendered inside of a profile, then the fallback color will be used.
  return <ProfileGradientCard style={styles.reviewContainer} fallbackBackground={styles.fallback.color}>
    <TouchableOpacity onPress={onSubmit}>
      <View style={{ padding: 8 }}>
        <TouchableOpacity
          onPress={() => {
            Users.getUser(item["senderdiscordid"])
              ? Profiles.showUserProfile({ userId: item["senderdiscordid"] })
              : ProfileFetcher.getUser(item["senderdiscordid"]).then(() => Profiles.showUserProfile({ userId: item["senderdiscordid"] }))
          }}
          style={styles.avatarContainer}
        >
          {Boolean(item["profile_photo"]) && <Image
            loading="lazy"
            style={styles.avatarAuthor}
            source={{
              uri: (item["profile_photo"] as string)?.replace("?size=128", "?size=48"),
            }}
          />}
          {Boolean(item["username"]) && <View style={{ marginLeft: 6 }}>
            <Text style={[styles.mainText, styles.authorName]}>
              {item["username"]}
            </Text>
          </View>}
          {item["isSystemMessage"] && <TouchableOpacity
            style={styles.systemContainer}
            onPress={() => Toasts.open({
              source: Icons.Shield,
              content: "This is an automated system review."
            })}
          >
            {/* @ts-ignore */}
            <FormRow.Icon source={Icons.Warning} style={[
              styles.systemIcon, 
              styles.dangerousIcon
            ]} />
            <Text style={[
              styles.text,
              styles.mainText, 
              styles.dangerousText,
              styles.systemText
            ]}>
              SYSTEM
            </Text> 
          </TouchableOpacity>}
          {Boolean(item["badges"].length > 0) && item["badges"].map(badge => <TouchableOpacity
            onPress={() => Toasts.open({
              source: {
                uri: badge["badge_icon"]
              },
              content: badge["badge_name"]
          })}>
            <Image
              loading="lazy"
              style={styles.rdbBadge}
              source={{
                uri: badge["badge_icon"],
              }}
            />
          </TouchableOpacity>)}
          {Boolean(item["timestamp"]) && <Text style={{ 
              ...styles.mainText, 
              ...styles.timestamp
          }}>
            {formattedTime}
          </Text>}
        </TouchableOpacity>
        <Text style={styles.messageContent}>
          {item["comment"] ?? "Invalid message content."}
        </Text>
      </View>
    </TouchableOpacity>
  </ProfileGradientCard>
}

import { Image, Text, TouchableOpacity, View } from "enmity/components";
import { bulk, filters } from "enmity/metro";
import { Profiles, React, Toasts } from 'enmity/metro/common';
import { Icons } from "../../../common/components/_pluginSettings/utils";
import styles from "./StyleSheet";

const [
  GetProfile, // used to get the user's profile
  { ProfileGradientCard } // used to render a card with the external colors being the user's profile theme. requires padding tobe set as a result.
] = bulk(
  filters.byProps("fetchProfile"),
  filters.byProps("ProfileGradientCard")
);

interface ReviewProps {
  item: { [key: string]: string | number | undefined }
  onSubmit: Function
}

export default ({ item, onSubmit }: ReviewProps) => {
  // This was a lot easier than i thought, it automatically uses the correct profile theme colors when rendered.
  // if the user has no profile theme colors or this is not rendered inside of a profile, then the fallback color will be used.
  return <ProfileGradientCard style={styles.reviewContainer} fallbackBackground={styles.fallback.color}>
    <TouchableOpacity onPress={onSubmit}>
      <View style={{ padding: 8 }}>
        <TouchableOpacity onPress={() => {
          GetProfile.fetchProfile(item["senderdiscordid"]).then(() => {
            Profiles.showUserProfile({ userId: item["senderdiscordid"] });
          }).catch((err: any) => {
            Toasts.open({
              content: "Could not fetch user. Check logs for more info.",
              source: Icons.Failed,
            })
            console.log("[ReviewDB User Fetch Error]", err)
          })
        }} style={styles.avatarContainer}>
          <Image
            loading="lazy"
            style={styles.authorAvatar}
            source={{
              uri: (item["profile_photo"] as string).replace("?size=128", "?size=48"),
            }} />
          <View style={{ marginLeft: 6 }}>
            <Text style={[styles.mainText, styles.authorName]}>
              {item["username"]}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.messageContent}>
          {item["comment"]}
        </Text>
      </View>
    </TouchableOpacity>
  </ProfileGradientCard>
}

import { FormDivider, Image, Text, TouchableOpacity, View } from "enmity/components";
import { bulk, filters } from "enmity/metro";
import { Profiles, React, Toasts } from 'enmity/metro/common';
import { Icons } from "../../../common/components/_pluginSettings/utils";
import styles from "./StyleSheet";

const [
  GetProfile // used to get the user's profile
] = bulk(
  filters.byProps("fetchProfile")
);

export default ({ item, onSubmit }) => {
  return <React.Fragment key={item["senderdiscordid"]}>
    <View style={styles.itemContainer}>
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
            uri: item["profile_photo"].replace("?size=128", "?size=96"),
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSubmit} style={styles.textContainer}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewSubHeader}>
            <Text style={[styles.mainText, styles.authorName]}>
              {item["username"]}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.messageContent}>
            {item["comment"]}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
    <FormDivider />
  </React.Fragment>
}

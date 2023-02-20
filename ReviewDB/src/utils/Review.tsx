import { FormDivider, Image, Text, TouchableOpacity, View } from "enmity/components";
import { Profiles, React, Toasts } from 'enmity/metro/common';
import { Icons } from "../../../common/components/_pluginSettings/utils";
import styles from "./StyleSheet";

export default ({ item, onSubmit }) => {
  return <>
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => {
        try {
          Profiles.showUserProfile({ userId: item["senderdiscordid"] });
        } catch (err) {
          Toasts.open({
            content: "Error while fetching user. Check logs for more info.",
            source: Icons.Failed,
          });
          console.log("[ReviewDB User Fetch Error]");
          console.log(err);
        }
      }} style={styles.avatarContainer}>
        <Image
          style={styles.authorAvatar}
          source={{
            uri: item["profile_photo"],
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
  </>
}

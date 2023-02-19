import { View, TouchableOpacity, Image, Text, FormDivider } from "enmity/components";
import styles from "./StyleSheet";
import { Icons } from "../../../common/components/_pluginSettings/utils";
import { Profiles, React, Toasts } from 'enmity/metro/common';
import { getByProps } from "enmity/metro";

const GetProfile = getByProps("fetchProfile");

export default ({ item, onSubmit }) => {
    return <>
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
                GetProfile.fetchProfile(item["senderdiscordid"]).then(() => {
                    Profiles.showUserProfile({ userId: item["senderdiscordid"] });
                }).catch((err: any) => {
                    Toasts.open({
                        content: "Error while fetching user. Check logs for more info.",
                        source: Icons.Failed,
                    });
                    console.log("[ReviewDB User Fetch Error]");
                    console.log(err);
                });
            } } style={styles.avatarContainer}>
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
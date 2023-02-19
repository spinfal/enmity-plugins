// thank you again rosie :prayge:

/**
 * Imports
 * @param { getByProps, getModule }: Functions used to filter and get modules from metro.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 *               This is required in all TSX components, or Dislate will crash.
 * @param Debug: The main Debug Info page.
 */
import { FormDivider, Image, Text, TouchableOpacity, View } from 'enmity/components';
import { bulk, filters, getByProps, getModule } from "enmity/metro";
import { Profiles, React, Toasts } from "enmity/metro/common";
import { Icons } from "../../../common/components/_pluginSettings/utils";
import Button from "./Button";
import { canDeleteReview, reportReview } from './RDBAPI';
import styles from "./StyleSheet";

/**
 * @param ActionSheet: The main ActionSheet component. This renders any type of @arg ActionSheet, but I'm going to render an @arg BottomSheetScrollView
 * @param BottomSheetScrollView: A scrollview component which is rendered inside an @arg ActionSheet, and can render anything inside itself.
 */
const ActionSheet = (getModule(x => x.default?.render?.name == "ActionSheet") ?? { default: { render: false } }).default.render;
const BottomSheetScrollView = getByProps("BottomSheetScrollView").BottomSheetScrollView;
const [
  GetProfile, // used to get the user's profile
  LazyActionSheet // used to render/manage the action sheet
] = bulk(
  filters.byProps("fetchProfile"),
  filters.byProps("openLazy", "hideActionSheet")
);

export function renderActionSheet(onConfirm: Function, item: any, currentUserID: string) {
  /**
   * Opens an @arg ActionSheet to the user and passes an onConfirm and type of @arg Send because this is inside the Command, not Settings.
   */
  ActionSheet
    ? LazyActionSheet.openLazy(new Promise(r => r({ default: ReviewActionSheet })), "ReviewActionSheet", { onConfirm, item, currentUserID })
    : Toasts.open({ content: "You cannot open ActionSheets on this version! Upgrade to 163+", source: Icons.Failed })
}

export default function ReviewActionSheet({ onConfirm, item, currentUserID }: { onConfirm: Function, item: any, currentUserID: string }) {
  /**
   * @returns @arg ActionSheet {scrollable}: Allows you to expand the actionsheet and scroll through it.
   */
  return <ActionSheet scrollable>
    <BottomSheetScrollView contentContainerStyle={{ marginBottom: 10 }}>
      <View style={{
        flexDirection: "column",
        padding: 15,
      }}>
        <>
          <View style={styles.item_container}>
            <TouchableOpacity onPress={() => {
              GetProfile.fetchProfile(item["senderdiscordid"]).then(() => {
                Profiles.showUserProfile({ userId: item["senderdiscordid"] });
              }).catch((err: any) => {
                Toasts.open({
                  content: "Error while fetching user. Check logs for more info.",
                  source: Icons.Failed,
                })
                console.log("[ReviewDB User Fetch Error]")
                console.log(err)
              })
            }} style={styles.avatar_container}>
              <Image
                style={styles.author_avatar}
                source={{
                  uri: item["profile_photo"],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.text_container}>
              <View style={styles.review_header}>
                <View style={styles.review_sub_header}>
                  <Text style={[styles.main_text, styles.author_name]}>
                    {item["username"]}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.message_content}>
                  {item["comment"]}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <FormDivider />
        </>

        {canDeleteReview(item, currentUserID) ? <Button text="Delete Review" press={() => {
          reportReview(item["id"]).then(() => {
            onConfirm()
          })
        }} /> : null}
        <Button text="Report Review" press={() => {
          reportReview(item["id"]).then(() => {
            onConfirm()
          })
        }} />
      </View>
    </BottomSheetScrollView>
  </ActionSheet>
}

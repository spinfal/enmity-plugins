// thank you again rosie :prayge:

/**
 * Imports
 * @param { getByProps, getModule }: Functions used to filter and get modules from metro.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 *               This is required in all TSX components, or Dislate will crash.
 * @param Debug: The main Debug Info page.
 */
import { View } from 'enmity/components';
import { getByProps, getModule } from "enmity/metro";
import { React, Toasts } from "enmity/metro/common";
import { Icons } from "../../../common/components/_pluginSettings/utils";
import Button from "./Button";
import { canDeleteReview, deleteReview, reportReview } from './RDBAPI';
import Review from './Review';

/**
 * @param ActionSheet: The main ActionSheet component. This renders any type of @arg ActionSheet, but I'm going to render an @arg BottomSheetScrollView
 * @param BottomSheetScrollView: A scrollview component which is rendered inside an @arg ActionSheet, and can render anything inside itself.
 */
const ActionSheet = (getModule(x => x.default?.render?.name == "ActionSheet") ?? { default: { render: false } }).default.render;
const BottomSheetScrollView = getByProps("BottomSheetScrollView").BottomSheetScrollView;
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");
const Clipboard = getByProps("setString");

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
  return <ActionSheet>
    <BottomSheetScrollView contentContainerStyle={{ marginBottom: 10 }}>
      <View style={{
        flexDirection: "column",
        padding: 15,
      }}>
        <Review item={item} onSubmit={null} />

        {!!item["comment"] && <Button text="Copy Text" onPress={() => {
          Clipboard.setString(item["comment"])
          Toasts.open({ content: "Copied to clipboard!", source: Icons.Success })
        }} />}
        {!!item["id"] && <Button text="Copy ID" onPress={() => {
          Clipboard.setString(item["id"].toString())
          Toasts.open({ content: "Copied to clipboard!", source: Icons.Success })
        }} />}
        {canDeleteReview?.(item, currentUserID) && <Button text="Delete Review" onPress={() => {
          deleteReview(item["id"]).then(() => {
            onConfirm()
          })
        }} /> }
        {item["id"] && <Button text="Report Review" onPress={() => {
          reportReview(item["id"]).then(() => {
            onConfirm()
          })
        }} />}
      </View>
    </BottomSheetScrollView>
  </ActionSheet>
}

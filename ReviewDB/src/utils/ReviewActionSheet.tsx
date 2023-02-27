// thank you again rosie :prayge:
import { View } from 'enmity/components';
import { getByProps, getModule } from "enmity/metro";
import { React, Toasts } from "enmity/metro/common";
import { Icons } from "../../../common/components/_pluginSettings/utils";
import Button from "./Button";
import { canDeleteReview, deleteReview, reportReview } from './RDBAPI';
import Review from './Review';

const ActionSheet = (getModule(x => x.default?.render?.name == "ActionSheet") ?? { default: { render: false } }).default.render;
const BottomSheetScrollView = getByProps("BottomSheetScrollView").BottomSheetScrollView;
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");
const Clipboard = getByProps("setString");

export function renderActionSheet(onConfirm: Function, item: any, currentUserID: string) {
  ActionSheet
    ? LazyActionSheet.openLazy(new Promise(r => r({ default: ReviewActionSheet })), "ReviewActionSheet", { onConfirm, item, currentUserID })
    : Toasts.open({ content: "You cannot open ActionSheets on this version! Upgrade to 163+", source: Icons.Failed })
}

interface ReviewActionSheetProps {
  onConfirm: Function;
  item: { [key: string]: string | number | undefined }
  currentUserID: string;
}

export default function ReviewActionSheet({ onConfirm, item, currentUserID }: ReviewActionSheetProps) {
  // it is not scrollable, meaning the height is not predefined, and takes up however much is required to render the content, up to half of the screen.
  return <ActionSheet>
    <BottomSheetScrollView contentContainerStyle={{ marginBottom: 10 }}>
      <View style={{
        flexDirection: "column",
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 14,
        marginBottom: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Review 
          reviewerID={item["senderdiscordid"] as string} 
          comment={item["comment"] as string} 
          onSubmit={() => {}} 
        />

        {!!item["comment"] && <Button
          text="Copy Text"
          image="ic_message_copy"
          onPress={() => {
            Clipboard.setString(item["comment"])
            Toasts.open({ content: "Copied to clipboard!", source: Icons.Success })
            onConfirm()
          }}
        />}
        {!!item["id"] && <Button
          text="Copy ID"
          image="ic_copy_id"
          onPress={() => {
            Clipboard.setString((item["id"] as number).toString())
            Toasts.open({ content: "Copied to clipboard!", source: Icons.Success })
            onConfirm()
          }}
        />}
        {canDeleteReview(item, currentUserID) && <Button
          text="Delete Review"
          image="ic_message_delete"
          onPress={() => {
            deleteReview(item["id"] as number).then(() => {
              onConfirm()
            })
          }}
        />}
        {item["id"] && <Button
          text="Report Review"
          image="ic_warning_24px"
          onPress={() => {
            reportReview(item["id"] as number).then(() => {
              onConfirm()
            })
          }}
        />}
      </View>
    </BottomSheetScrollView>
  </ActionSheet>
}

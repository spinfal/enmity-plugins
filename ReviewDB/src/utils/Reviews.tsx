import { get, set } from "enmity/api/settings";
import { FormDivider, FormInput, Image, Text, TouchableOpacity, View } from 'enmity/components';
import { bulk, filters } from "enmity/metro";
import { Profiles, React, Toasts } from "enmity/metro/common";
import { Icons } from "../../../common/components/_pluginSettings/utils";
import Button from "./Button";
import { addReview, getReviews } from './RDBAPI';
import { renderActionSheet } from "./ReviewActionSheet";
import styles from "./StyleSheet";

const [
  GetProfile, // used to get the user's profile
  LazyActionSheet // used to render/manage the action sheet
] = bulk(
  filters.byProps("fetchProfile"),
  filters.byProps("openLazy", "hideActionSheet")
);

/**
 * Main @Reviews component implementation.
 * @param userID: The ID of the user, passed as a string
 * @returns TSX Component
 */
export default ({ userID, currentUserID }: { userID: string, currentUserID: string }) => {
  const [input, setInput] = React.useState("");
  const [reviews, setReviews] = React.useState([])

  React.useEffect(() => {
    getReviews(userID).then((reviews: any) => {
      setReviews(reviews)
    });
  }, [])

  return <View style={styles.container}>
    <Text style={styles.eyebrow}>
      User Reviews
    </Text>
    {reviews && reviews.length > 0 ? reviews.map((item: object) =>
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
          <TouchableOpacity onPress={() => {
            /**
             * Opens an @arg ActionSheet to the user and passes an onConfirm and type of @arg Copy because this is inside Settings, not the Command.
             */
            renderActionSheet(() => {
              /**
               * This closes the current ActionSheet.
               * @param LazyActionSheet.hideActionSheet: Removes the top level action sheet.
               */
              LazyActionSheet.hideActionSheet()
            }, item, currentUserID)
          }} style={styles.text_container}>
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
    ) : <Text style={[styles.text, styles.content]}>
      No reviews yet; you could be the first!
    </Text>}
    <FormInput
      id="reviewTextbox"
      placeholder="Tap here to review..."
      onChange={(value: string) => {
        set("_rdb", "tempReviewText", value);
      }}
    />
    <Button text="Submit" press={() => {
      const review = get("_rdb", "tempReviewText", "") as string;
      if (review) {
        addReview({
          "userid": userID,
          "comment": review.trim(),
          "star": -1,
          "token": get("_rdb", "rdbToken", "")
        }).then(() => {
          getReviews(userID).then((reviews: any) => {
            setReviews(reviews)
          });
        })
      } else {
        Toasts.open({
          content: "Please enter a review before submitting.",
          source: Icons.Failed,
        })
      }
    }} />
  </View>
}

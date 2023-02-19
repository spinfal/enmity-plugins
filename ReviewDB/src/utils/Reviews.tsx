import { get } from "enmity/api/settings";
import { FormInput, Text, View } from 'enmity/components';
import { getByProps } from "enmity/metro";
import { React, Toasts } from "enmity/metro/common";
import { Icons } from "../../../common/components/_pluginSettings/utils";
import Button from "./Button";
import { addReview, getReviews } from './RDBAPI';
import Review from "./Review";
import { renderActionSheet } from "./ReviewActionSheet";
import styles from "./StyleSheet";
import manifest from "../../manifest.json"

const LazyActionSheet = getByProps("openLazy", "hideActionSheet")

/**
 * Main @Reviews component implementation.
 * @param userID: The ID of the user, passed as a string
 * @returns TSX Component
 */
export default ({ userID, currentUserID }: { userID: string, currentUserID: string }) => {
  const [input, setInput] = React.useState("");
  const [reviews, setReviews] = React.useState([])

  React.useEffect(() => {
    getReviews(userID).then(reviews => {
      setReviews(reviews)
    });
  }, [])

  return <View style={styles.container}>
    <Text style={styles.eyebrow}>
      User Reviews
    </Text>
    {reviews && reviews.length > 0 ? reviews.map((item: object) =>
      <Review 
        item={item} 
        onSubmit={() => renderActionSheet(() => {
          /**
           * This closes the current ActionSheet.
           * @param LazyActionSheet.hideActionSheet: Removes the top level action sheet.
           */
          LazyActionSheet.hideActionSheet();
        }, item, currentUserID)}
      />
    ) : <Text style={[styles.text, styles.content]}>
      No reviews yet. You could be the first!
    </Text>}
    <FormInput
      id="reviewTextbox"
      placeholder="Tap here to add a review..."
      value={input}
      onChange={(value: string) => {
        setInput(value)
      }}
    />
    <Button text="Submit" onPress={() => {
      if (input) {
        addReview({
          "userid": userID,
          "comment": input.trim(),
          "star": -1,
          "token": get(manifest.name, "rdbToken", "")
        }).then(() => {
          getReviews(userID).then((reviews: any) => {
            setReviews(reviews)
          });
          setInput("")
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

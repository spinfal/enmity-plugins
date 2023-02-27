import { Image, Text, TouchableOpacity, View } from "enmity/components";
import { bulk, filters } from "enmity/metro";
import { Profiles, React } from 'enmity/metro/common';
import styles from "./StyleSheet";
import { getConditionalCachedUser } from './RDBAPI';

const [
  GetProfile, // used to get the user's profile
  { ProfileGradientCard } // used to render a card with the external colors being the user's profile theme. requires padding tobe set as a result.
] = bulk(
  filters.byProps("fetchProfile"),
  filters.byProps("ProfileGradientCard")
);

interface ReviewProps {
    reviewerID: string;
    comment: string;
    onSubmit: Function;
}

export default ({ reviewerID, comment, onSubmit }: ReviewProps) => {
    const [reviewerState, setReviewerState] = React.useState<{ [key: string]: any}>()

    React.useEffect(() => {
        getConditionalCachedUser(reviewerID).then(state => { setReviewerState(state) })
    }, [])

    // This was a lot easier than i thought, it automatically uses the correct profile theme colors when rendered.
    // if the user has no profile theme colors or this is not rendered inside of a profile, then the fallback color will be used.
    return reviewerState ? <ProfileGradientCard style={styles.reviewContainer} fallbackBackground={styles.fallback.color}>
        <TouchableOpacity onPress={onSubmit}>
            <View style={{ padding: 8 }}>
                <TouchableOpacity onPress={() => {
                    Profiles?.showUserProfile({ userId: reviewerState?.id });
                }} style={styles.avatarContainer}>
                    <Image
                        loading="lazy"
                        style={styles.authorAvatar}
                        source={{
                            uri: (reviewerState?.getAvatarURL() as string).replace(/\?size=(\d+)/, "?size=96"),
                    }}/>
                    <View style={{ marginLeft: 6 }}>
                        <Text style={[styles.mainText, styles.authorName]}>
                            {reviewerState?.username}#{reviewerState?.discriminator}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.messageContent}>
                    {comment}
                </Text>
            </View>
        </TouchableOpacity>
    </ProfileGradientCard> : <></>
}

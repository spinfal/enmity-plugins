import { StyleSheet, Constants } from "enmity/metro/common";

const AUTHOR_SIZE = 18;

const styles = StyleSheet.createThemedStyleSheet({
  container: {
    marginTop: 12,
    marginLeft: 12,
    alignSelf: 'flex-start',
    width: "95%"
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Constants.Fonts.PRIMARY_BOLD,
    color: Constants.ThemeColorMap.TEXT_NORMAL,
  },
  innerContainer: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Constants.ThemeColorMap.HEADER_PRIMARY,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#1e1f22",
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 12
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 12 / 2,
    backgroundColor: Constants.ThemeColorMap.HEADER_PRIMARY,
    marginLeft: 8,
    marginRight: 6
  },
  content: {
    fontSize: 14,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  text: {
    fontFamily: Constants.Fonts.DISPLAY_BOLD,
    color: Constants.ThemeColorMap.TEXT_NORMAL
  },
  buttonText: {
    fontSize: 16,
  },
  mainText: {
    opacity: 0.975,
    letterSpacing: 0.25,
  },
  singleReviewContainer: {
    padding: 8,
    marginBottom: 8,
    width: "98%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Constants.ThemeColorMap.HEADER_PRIMARY,
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
  },
  authorName: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.DISPLAY_BOLD,
    fontSize: AUTHOR_SIZE,
    letterSpacing: 0.25,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row"
  },
  authorAvatar: {
    width: AUTHOR_SIZE,
    height: AUTHOR_SIZE,
    borderRadius: 100,
    marginTop: 4,
  },
  reviewAuthor: {
    marginLeft: 6,
  },
  messageContent: {
    color: Constants.ThemeColorMap.TEXT_NORMAL,
    fontFamily: Constants.Fonts.DISPLAY_NORMAL,
    opacity: 0.985,
    fontSize: 16,
  },
  addReview: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  reviewWindow: {
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  }
})

export default styles;

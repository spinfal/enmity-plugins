import { Constants, StyleSheet } from "enmity/metro/common";

// the size of the author text, and the profile pictures, inside of a singular review. this is a constant so they all update simultaneously.
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
  button: {
    width: '98%',
    height: 40,
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_SECONDARY_ALT,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reviewContainer: {
    borderRadius: 9,
    padding: 1,
    marginBottom: 8,
    width: "98%"
  },
  fallback: {
    color: Constants.ThemeColorMap.BACKGROUND_SECONDARY_ALT
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
    marginLeft: 4
  },
  mainText: {
    opacity: 0.975,
    letterSpacing: 0.25,
  },
  authorName: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.DISPLAY_BOLD,
    fontSize: AUTHOR_SIZE,
    letterSpacing: 0.25,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 0,
    alignSelf: 'flex-start'
  },
  authorAvatar: {
    width: AUTHOR_SIZE,
    height: AUTHOR_SIZE,
    borderRadius: 100,
    marginTop: 1,
  },
  rdbBadge: {
    width: AUTHOR_SIZE,
    height: AUTHOR_SIZE,
    marginTop: 1,
    marginLeft: 4,
  },
  messageContent: {
    color: Constants.ThemeColorMap.TEXT_NORMAL,
    fontFamily: Constants.Fonts.DISPLAY_NORMAL,
    opacity: 0.985,
    fontSize: 16,
  },
  reviewWindow: {
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(75, 75, 75, 0.7)",
  },
  icon: {
    color: Constants.ThemeColorMap.INTERACTIVE_NORMAL,
    width: 16,
    height: 16,
    marginRight: 4,
  },
})

export default styles;

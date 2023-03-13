import { Constants, StyleSheet } from "enmity/metro/common";

// the size of the author text, and the profile pictures, inside of a singular review. this is a constant so they all update simultaneously.
const AUTHOR_SIZE = 18;

const styles = StyleSheet.createThemedStyleSheet({
  // styles for various containers
  container: {
    marginTop: 12,
    marginLeft: 12,
    alignSelf: 'flex-start',
    width: "95%"
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
  reviewWindow: {
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(75, 75, 75, 0.7)",
  },
  systemContainer: {
    marginLeft: 4,
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_SECONDARY,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },

  // styles for button
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

  // styles for content
  content: {
    fontSize: 14,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  messageContent: {
    color: Constants.ThemeColorMap.TEXT_NORMAL,
    fontFamily: Constants.Fonts.DISPLAY_NORMAL,
    opacity: 0.985,
    fontSize: 16,
  },

  // styles for various texts
  text: {
    fontFamily: Constants.Fonts.DISPLAY_BOLD
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 4
  },
  mainText: {
    opacity: 0.975,
    letterSpacing: 0.25,
  },
  safeText: {
    color: Constants.ThemeColorMap.TEXT_NORMAL
  },
  dangerousText: {
    color: Constants.ThemeColorMap.TEXT_MUTED
  },
  fallback: {
    color: Constants.ThemeColorMap.BACKGROUND_SECONDARY_ALT
  },
  systemText: {
    fontSize: 12,
    paddingVertical: 2,
    paddingRight: 4
  },
  
  // styles for more obscure texts
  timestamp: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.DISPLAY_NORMAL,
    opacity: 0.985,
    fontSize: 12,
    marginLeft: 4,
    marginTop: AUTHOR_SIZE/12
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Constants.Fonts.PRIMARY_BOLD,
    color: Constants.ThemeColorMap.TEXT_NORMAL,
  },

  // styles for author part of review
  authorName: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.DISPLAY_BOLD,
    fontSize: AUTHOR_SIZE,
    letterSpacing: 0.25,
    marginTop: -3
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 0,
    alignSelf: 'flex-start'
  },
  avatarAuthor: {
    width: AUTHOR_SIZE,
    height: AUTHOR_SIZE,
    borderRadius: 100,
    marginTop: 1,
  },

  // styles for badge
  rdbBadge: {
    width: AUTHOR_SIZE,
    height: AUTHOR_SIZE,
    marginTop: 1,
    marginLeft: 4,
  },
  
  // styles for icons in actionsheet buttons
  icon: {
    width: 16,
    height: 16,
    marginRight: 4
  },
  systemIcon: {
    width: 12,
    height: 12,
    marginHorizontal: 4
  },
  dangerousIcon: {
    tintColor: Constants.ThemeColorMap.TEXT_MUTED
  },
  safeIcon: {
    tintColor: Constants.ThemeColorMap.INTERACTIVE_NORMAL
  },

  // styles for authentication page
  authContainer: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
    flex: 0.5,
  },
  authCard: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
    color: Constants.ThemeColorMap.TEXT_NORMAL
  },
  authHeader: {
    backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
    shadowColor: 'transparent',
    elevation: 0,
  },
  authText: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.PRIMARY_NORMAL,
    fontSize: 16,
    marginLeft: 16,
    backgroundColor: 'transparent'
  },
})

export default styles;

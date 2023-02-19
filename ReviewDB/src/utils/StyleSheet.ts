import { StyleSheet, Constants } from "enmity/metro/common";

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
    mixBlendMode: "difference",
    marginBottom: 10
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
    marginBottom: 5
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
    fontFamily: Constants.Fonts.DISPLAY_NORMAL,
    color: Constants.ThemeColorMap.TEXT_NORMAL
  },
  buttonText: {
    fontSize: 16,
  },
  main_text: {
    opacity: 0.975,
    letterSpacing: 0.25,
  },
  item_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 6,
    width: "95%",
  },
  author_name: {
    color: Constants.ThemeColorMap.HEADER_PRIMARY,
    fontFamily: Constants.Fonts.DISPLAY_BOLD,
    fontSize: 18,
    letterSpacing: 0.25,
    paddingBottom: 4,
    mixBlendMode: "difference",
  },
  review_header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "90%",
  },
  review_sub_header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "65%",
  },
  avatar_container: {
    alignSelf: "start",
    justifySelf: "start",
  },
  author_avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  message_content: {
    color: Constants.ThemeColorMap.TEXT_NORMAL,
    opacity: 0.985,
    fontSize: 16,
    mixBlendMode: "difference",
  },
  text_container: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 4,
    paddingLeft: 8,
    width: "90%",
  },
})

export default styles;

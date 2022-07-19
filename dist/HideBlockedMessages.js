function p(o) {
  window.enmity.plugins.registerPlugin(o);
}
function c(...o) {
  return window.enmity.modules.getByProps(...o);
}
window.enmity.modules.common;
function S(o) {
  return window.enmity.patcher.create(o);
}
window.enmity.modules.common.Constants,
  window.enmity.modules.common.Clipboard,
  window.enmity.modules.common.Assets,
  window.enmity.modules.common.Messages,
  window.enmity.modules.common.Clyde,
  window.enmity.modules.common.Avatars,
  window.enmity.modules.common.Native;
const i = window.enmity.modules.common.React;
window.enmity.modules.common.Dispatcher, window.enmity.modules.common.Storage;
const t = window.enmity.modules.common.Toasts;
window.enmity.modules.common.Dialog,
  window.enmity.modules.common.Token,
  window.enmity.modules.common.REST,
  window.enmity.modules.common.Settings,
  window.enmity.modules.common.Users,
  window.enmity.modules.common.Navigation,
  window.enmity.modules.common.NavigationNative,
  window.enmity.modules.common.NavigationStack,
  window.enmity.modules.common.Theme,
  window.enmity.modules.common.Linking,
  window.enmity.modules.common.StyleSheet,
  window.enmity.modules.common.ColorMap,
  window.enmity.modules.common.Components,
  window.enmity.modules.common.Locale,
  window.enmity.modules.common.Profiles,
  window.enmity.modules.common.Lodash,
  window.enmity.modules.common.Logger,
  window.enmity.modules.common.Flux,
  window.enmity.modules.common.SVG,
  window.enmity.modules.common.Scenes;
var h = "HideBlockedMessages",
  F = "1.1.0",
  f = "For when you really need to shut someone the f*** up.",
  B = [{ name: "NotMarek", id: "206299359007080450" }],
  k = "#ff0069",
  v =
    "https://raw.githubusercontent.com/notmarek/enmity-plugins/master/dist/HideBlockedMessages.js",
  l = {
    name: h,
    version: F,
    description: f,
    authors: B,
    color: k,
    sourceUrl: v,
  };
function s(o) {
  return window.enmity.assets.getIDByName(o);
}
const { components: e } = window.enmity;
e.Alert,
  e.Button,
  e.FlatList,
  e.Image,
  e.ImageBackground,
  e.KeyboardAvoidingView,
  e.Modal,
  e.Pressable,
  e.RefreshControl;
const M = e.ScrollView;
e.SectionList,
  e.StatusBar,
  e.StyleSheet,
  e.Switch,
  e.Text,
  e.TextInput,
  e.TouchableHighlight,
  e.TouchableOpacity,
  e.TouchableWithoutFeedback,
  e.Touchable,
  e.View,
  e.VirtualizedList,
  e.Form,
  e.FormArrow,
  e.FormCTA,
  e.FormCTAButton,
  e.FormCardSection,
  e.FormCheckbox,
  e.FormDivider,
  e.FormHint,
  e.FormIcon,
  e.FormInput,
  e.FormLabel,
  e.FormRadio;
const u = e.FormRow;
e.FormSection,
  e.FormSelect,
  e.FormSubLabel,
  e.FormSwitch,
  e.FormTernaryCheckBox,
  e.FormText,
  e.FormTextColors,
  e.FormTextSizes;
var T = ({ pluginUrl: o }) =>
    i.createElement(u, {
      label: "Update plugin",
      trailing: u.Arrow,
      onPress: () => {
        (void 0)(`${o}?${Math.random() * 101}.js`, () => {
          Toasts.show({ content: "Plugin updated.", type: "success" });
        });
      },
    }),
  A = ({ settings: o }) =>
    i.createElement(M, null, i.createElement(T, { pluginUrl: l.pluginUrl }));
const w = S("HideBlockedMessages"),
  m = c("_currentDispatchActionType", "_subscriptions", "_waitQueue"),
  b = c("isBlocked", "isFriend"),
  C = {
    ...l,
    onStart() {
      m.dispatch({ type: "LOAD_MESSAGES" }),
        m.dispatch({
          type: "LOAD_MESSAGES_SUCCESS",
          channelId: 0,
          messages: [],
          isBefore: !1,
          isAfter: !1,
          hasMoreBefore: !1,
          hasMoreAfter: !1,
          limit: 25,
          jump: void 0,
          isStale: !1,
          truncate: void 0,
        });
      let o = 0,
        n = 3;
      const r = () => {
        try {
          o++,
            console.log(`HideBlockedMessages delayed start attempt ${o}/${n}.`),
            t.open({
              content: `HideBlockedMessages start attempt ${o}/${n}.`,
              source: s("ic_staff_guild_icon_blurple"),
            });
          const g = m._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
            (a) => a.name === "MessageStore"
          );
          w.before(g, "actionHandler", (a, d) => {
            d[0].messages = d[0].messages.filter(
              (y) => !b.isBlocked(y.author.id)
            );
          }),
            console.log("HideBlockedMessages delayed start successful."),
            t.open({
              content: "HideBlockedMessages delayed start successful.",
              source: s("Check"),
            });
        } catch {
          o < n
            ? (console.warn(
                `HideBlockedMessages failed to start. Trying again in ${o}0s.`
              ),
              t.open({
                content: `HideBlockedMessages failed to start trying again in ${o}0s.`,
                source: s("ic_message_retry"),
              }),
              setTimeout(r, o * 1e4))
            : (console.error("HideBlockedMessages failed to start. Giving up."),
              t.open({
                content: "HideBlockedMessages failed to start. Giving up.",
                source: s("Small"),
              }));
        }
      };
      setTimeout(r, 300);
    },
    onStop() {
      w.unpatchAll();
    },
    patches: [],
    getSettingsPanel({ settings: o }) {
      return React.createElement(A, { settings: o });
    },
  };
p(C);

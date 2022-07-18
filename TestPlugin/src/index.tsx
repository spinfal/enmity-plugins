import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { Messages, React } from "enmity/metro/common";
import { create } from "enmity/patcher";
import * as Assets from "enmity/api/assets";
import manifest from "../manifest.json";
const MessageStore = getByProps("getMessage", "getMessages");
const ChannelStore = getByProps("getChannel", "getDMFromUserId");
const Patcher = create("message-spoofer");
const Opener = getByProps("openLazy");
const FluxDispatcher = getByProps(
  "_currentDispatchActionType",
  "_subscriptions",
  "_waitQueue"
);

const TestPlugin: Plugin = {
  ...manifest,
  onStart() {
    Patcher.before(Opener, "openLazy", (_, [component, sheet]) => {
      if (sheet === "MessageLongPressActionSheet") {
        component.then((instance) => {
          let func = instance.default;
          instance.default = function (
            { message, user, channel, canAddNewReactions },
            _
          ) {
            let og = func({ message, user, channel, canAddNewReactions }, _);

            let ButtonRow =
              og.props.children.props.children.props.children[1][0].type;

            try {
              og.props.children.props.children.props.children[1].slice(4);
            } catch (e) {}
            return og;
          };
          return instance;
        });
      }
    });
  },
  onStop() {
    Patcher.unpatchAll();
  },
  patches: [],
};

registerPlugin(TestPlugin);

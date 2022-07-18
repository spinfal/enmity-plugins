import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByDisplayName, getByProps } from "enmity/metro";
import { Messages, React } from "enmity/metro/common";
import { create } from "enmity/patcher";
import * as Assets from "enmity/api/assets";
import manifest from "../manifest.json";
const MessageStore = getByProps("getMessage", "getMessages");
const ChannelStore = getByProps("getChannel", "getDMFromUserId");
const Patcher = create("test-plugin");
const Opener = getByProps("openLazy");
const FluxDispatcher = getByProps(
  "_currentDispatchActionType",
  "_subscriptions",
  "_waitQueue"
);
const TextInput = getByDisplayName("ChatInput")

const TestPlugin: Plugin = {
  ...manifest,
  onStart() {
    Patcher.before(TextInput, 'default', (...args) => {
      console.log(args);
    })
  },
  onStop() {
    Patcher.unpatchAll();
  },
  patches: [],
};

registerPlugin(TestPlugin);

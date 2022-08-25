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

const Spoofer: Plugin = {
    ...manifest,
    patches: [],
    onStart() {
        let dirtyEdit = false;
        Patcher.before(Opener, "openLazy", (_, [component, sheet]) => {
            if (sheet === "MessageLongPressActionSheet") {
                component.then((instance) => {
                    let func = instance.default;
                    instance.default = function (
                        { message, user, channel, canAddNewReactions },
                        _
                    ) {
                        let og = func(
                            { message, user, channel, canAddNewReactions },
                            _
                        );

                        if (
                            og.props.children.props.children.props
                                .children[1][0].key == "69"
                        )
                            return og;

                        let ButtonRow =
                            og.props.children.props.children.props
                                .children[1][0].type;

                        let myIdol = (
                            <ButtonRow
                                key="69"
                                onPressRow={(_) => {
                                    Opener.hideActionSheet();
                                    Messages.startEditMessage(
                                        `dirty-${channel.id}`,
                                        message.id,
                                        message.content
                                    );
                                }}
                                message="Spoof edit"
                                iconSource={Assets.getIDByName("ic_message_retry")}
                            />
                        );
                        og.props.children.props.children.props.children[1].unshift(
                            myIdol
                        );

                        return og;
                    };
                    return instance;
                });
            }
        });
        Patcher.before(Messages, "startEditMessage", (a0, a1, a2) => {
            if (a1[0].startsWith("dirty-")) {
                a1[0] = a1[0].replace("dirty-", "");
                dirtyEdit = true;
            } else {
                dirtyEdit = false;
            }
        });

        Patcher.before(Messages, "editMessage", (a0, a1, a2) => {
            if (dirtyEdit) {
                const originalMessage = MessageStore.getMessage(a1[0], a1[1]);
                FluxDispatcher.dispatch({
                    type: "MESSAGE_UPDATE",
                    message: {
                        ...originalMessage,
                        ...a1[2],
                        edited_timestamp: originalMessage.editedTimestamp,
                        mention_roles: originalMessage.mentionRoles,
                        mention_everyone: originalMessage.mentionEveryone,
                        member: originalMessage.author,
                        guild_id: ChannelStore.getChannel(
                            originalMessage.channel_id
                        ).guild_id,
                    },
                    log_edit: false
                });
                a1 = {} as any;
            }
        });
    },

    onStop() {
        Patcher.unpatchAll();
    },
};

registerPlugin(Spoofer);

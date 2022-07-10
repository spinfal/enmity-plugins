import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { Messages, React } from "enmity/metro/common";
import { create } from "enmity/patcher";
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
                console.log(JSON.stringify(component));
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
                                iconSource={582}
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
                        type: originalMessage.type,
                        tts: originalMessage.tts,
                        timestamp: originalMessage.timestamp,
                        pinned: originalMessage.pinned,
                        mentions: originalMessage.mentions,
                        mention_roles: originalMessage.mentionRoles,
                        mention_everyone: originalMessage.mentionEveryone,
                        member: originalMessage.author,
                        id: originalMessage.id,
                        flags: originalMessage.flags,
                        embeds: originalMessage.embeds,
                        edited_timestamp: originalMessage.editedTimestamp,
                        content: a1[2].content,
                        components: originalMessage.components,
                        channel_id: originalMessage.channel_id,
                        author: originalMessage.author,
                        attachments: originalMessage.originalMessage,
                        guild_id: ChannelStore.getChannel(
                            originalMessage.channel_id
                        ).guild_id,
                    },
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

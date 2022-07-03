import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps, getModule } from "enmity/metro";
import { create } from "enmity/patcher";
import manifest from "../manifest.json";
const MessageStore = getByProps("getMessage", "getMessages");
const ChannelStore = getByProps("getChannel", "getDMFromUserId");
const SelectedChannelStore = getByProps("getLastSelectedChannelId");
const DispatcherModule = getModule((e) => e.dispatch && !e.getCurrentUser);
const Patcher = create("logger");

const NoDelete: Plugin = {
    ...manifest,
    patches: [],

    onStart() {
        Patcher.before(DispatcherModule, "dispatch", (a0, event, a2) => {
            if (
                event[0].type === "MESSAGE_UPDATE" &&
                event[0].message.content !== undefined
            ) {
                const selectedGuild = ChannelStore.getChannel(
                    SelectedChannelStore.getChannelId()
                ).guild_id;
                if (event[0].message.guild_id !== selectedGuild) return;
                const originalMessage = MessageStore.getMessage(
                    event[0].message.channel_id,
                    event[0].message.id
                );
                event[0].message.content =
                    originalMessage.content +
                    " `[edited]`\n" +
                    event[0].message.content;
                return;
            }

            if (event[0].type === "MESSAGE_DELETE") {
                const originalMessage = MessageStore.getMessage(
                    event[0].channelId,
                    event[0].id
                );

                event[0].type = "MESSAGE_UPDATE";
                event[0].message = {
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
                    content: originalMessage.content + " `[deleted]`",
                    components: originalMessage.components,
                    channel_id: originalMessage.channel_id,
                    author: originalMessage.author,
                    attachments: originalMessage.originalMessage,
                    guild_id: ChannelStore.getChannel(
                        originalMessage.channel_id
                    ).guild_id,
                };
                return;
            }
        });
    },

    onStop() {
        Patcher.unpatchAll();
    },
};

registerPlugin(NoDelete);

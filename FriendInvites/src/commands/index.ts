import { createFriendInvite } from "./create";
import { listFriendInvites } from "./list";
import { revokeFriendInvites } from "./revoke";

const commands = [createFriendInvite, listFriendInvites, revokeFriendInvites];

export { commands };

import { Storage } from "enmity/metro/common";
import { getByKeyword } from "enmity/metro";
import { getBoolean } from "enmity/api/settings";

/**
 * It takes in a type, author, id, avatar, and content, and then it checks if the author, id, avatar,
 * or content is undefined, and if it is, it returns. If it isn't, it creates an object with the type,
 * author, id, avatar, and content, and then it gets the logs from storage, parses them, checks if the
 * itemObject is the same as the last item in the logs, and if it is, it returns. If it isn't, it
 * pushes the itemObject to the logs, and then it sets the logs in storage.
 * @param {string} type - The type of log, either "deleted" or "edited"
 * @param {string} author - The author of the message.
 * @param {string} id - The author's id
 * @param {string} avatar - string of the author's avatar hash
 * @param {object} content - the content of the message and the time it was sent put together in an object
 */
async function updateLogStorage(type: string, author: string, id: string, avatar: string, content: object) {
  // stops logging of items with undefined in them
  if (author.split("#").pop() == "undefined" || id == "undefined" || avatar == "undefined" || content["original"] == undefined) return;
  if (getBoolean("_nodelete", "_logSelf", false) === false && id == getByKeyword('getCurrentUser').getCurrentUser()?.id) return;

  const itemObject = {
    type: type,
    author: author,
    id: id,
    avatar: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${(avatar?.startsWith("a_") ? "gif" : "png")}?size=1024` : "https://cdn.discordapp.com/embed/avatars/0.png",
    content: (content["edited"] ? [new Date(content["time"]).toLocaleString(), content["original"], content["edited"]] : [new Date(content["time"]).toLocaleString(), content["original"]]),
  }
  let logs = await Storage.getItem("NoDeleteLogs") as any;
  logs = JSON.parse(logs);
  // stops logging of duplicate items
  if (itemObject === logs[logs.length - 1]) return;
  logs.push(itemObject);
  await Storage.setItem("NoDeleteLogs", JSON.stringify(logs));
}

export { updateLogStorage }
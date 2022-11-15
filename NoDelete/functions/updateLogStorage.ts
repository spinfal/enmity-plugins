import { Storage } from "enmity/metro/common";

/**
 * It takes in a type, author, id, avatar, and content, and then it checks if the author, id, avatar,
 * or content is undefined, and if it is, it returns. If it isn't, it creates an object with the type,
 * author, id, avatar, and content, and then it gets the logs from storage, parses them, checks if the
 * itemObject is the same as the last item in the logs, and if it is, it returns. If it isn't, it
 * pushes the itemObject to the logs, and then it sets the logs in storage.
 * @param {string} type - The type of log, either "deleted" or "edited"
 * @param {object} author - The author object of the message, which contains the username, id, and avatar
 * @param {object} context - Context of the log, which contains the guild id, channel id, and message id
 * @param {object} content - the content of the message and the time it was sent put together` in an object
 */
async function updateLogStorage(type: string, author: object, context: object, content: object): Promise<void> {
  const itemObject = {
    type: type,
    author: { ...author, avatar: author["avatar"] ? `https://cdn.discordapp.com/avatars/${author["id"]}/${author["avatar"]}.${(author["avatar"]?.startsWith("a_") ? "gif" : "png")}?size=1024` : "https://cdn.discordapp.com/embed/avatars/0.png" },
    context: context,
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
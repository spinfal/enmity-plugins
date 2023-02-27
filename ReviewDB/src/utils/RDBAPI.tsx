import { get } from 'enmity/api/settings';
import { Dialog, Linking, Toasts, Users } from 'enmity/metro/common';
import { Icons } from '../../../common/components/_pluginSettings/utils';
import manifest from "../../manifest.json";
import { getByProps } from 'enmity/metro';

const getRdbToken = () => get(manifest.name, "rdbToken", "");

let isShowing = false;
const checkToken = (): boolean => {
  if (isShowing) return false;

  if (!getRdbToken()) {
    isShowing = true;
    Dialog.show({
      title: "Unauthorized",
      body: "You have not set your ReviewDB Auth Token. Please do so in the settings panel.",
      confirmText: "Get ReviewDB Token",
      cancelText: "Close",

      // run the install function
      onConfirm: () => {
        Linking.openURL("https://discord.com/api/v9/oauth2/authorize?client_id=915703782174752809&response_type=code&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&scope=identify")
        isShowing = false;
      },

      onCancel: () => {
        isShowing = false
      }
    });
    return false;
  }

  return true;
}

export async function getReviews(userID: string) {
  try {
    const res = await fetch(`${manifest.API_URL}/getUserReviews?snowflakeFormat=string&discordid=${userID}`);
    return await res.json();
  } catch (err) {
    Toasts.open({
      content: "Error while fetching reviews. Check logs for more info.",
      source: Icons.Failed,
    });
    console.log("[ReviewDB] Error while fetching reviews:", err);
  }
}

export async function addReview(review: any) {
  if (!checkToken()) return new Promise((_, reject) => reject("Invalid token!"));

  const r = await fetch(manifest.API_URL + "/addUserReview", {
    method: "POST",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const res = await r.text();
  res && Toasts.open({
    content: res + "!",
    source: Icons.Pencil,
  });
  return console.log("[ReviewDB]", Response[res] ?? Response.error);
}

export async function deleteReview(id: number) {
  if (!checkToken()) return new Promise((_, reject) => reject("Invalid token!"));

  const r = await fetch(manifest.API_URL + "/deleteReview", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify({
      token: getRdbToken(),
      reviewid: id
    })
  });
  const res = await r.json();
  Toasts.open({
    content: (res?.message || "Response is empty") + "!",
    source: Icons.Success,
  });
}

export async function reportReview(id: number) {
  if (!checkToken()) return new Promise((_, reject) => reject("Invalid token!"));

  const res = await fetch(manifest.API_URL + "/reportReview", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify({
      reviewid: id,
      token: getRdbToken()
    })
  });
  Toasts.open({
    content: (await res.text()) + "!",
    source: Icons.Success,
  });
}

const ProfileFetcher = getByProps("fetchProfile");
export let userMap = {};

export async function getConditionalCachedUser(userId: string) {
  // first return the userId if it exists in my custom map
  if (userMap[userId]) return userMap[userId];

  // otherwise see if getUser has the user cached already, if so assign that to the map and return it
  if (Users.getUser(userId)) {
    Object.assign(userMap, { [userId]: Users.getUser(userId) })
    return userMap[userId] ?? Users.getUser(userId)
  }
  
  // otherwise, the user has not been fetched and cached yet, and needs to be fetched now.
  const user = await ProfileFetcher.getUser(userId);
  if (!user) {
    Toasts.open({
      content: `Failed to fetch profile for ${userId}!`,
      source: Icons.Failed
    })
    return console.error(`[ReviewDB] Error when fetching ${userId}. Returned undefined when getting from both Map, UserStore, and Fetcher.`)
  }
 
  // finally, set the user to the map to not need to be fetched again a second time. the map takes priority over UserStore, which would now also have it cached.
  Object.assign(userMap, { [userId]: user });
  return userMap[userId];
}

export const clearUserMap = () => {
  userMap = {};

  Toasts.open({
    content: "Successfully cleared user cache!",
    source: Icons.Success
  })
}

/**
 * coming to an update near you: new review notifications
 * eta? idk
 */
// export function getLastReviewID(userID: string) {
//   return fetch(manifest.API_URL + "/getLastReviewID?discordid=" + userID)
//     .then(r => r.text())
//     .then(Number);
// }

export const canDeleteReview = (review: { [key: string]: string | number | undefined }, currentUserID: string) => review["senderdiscordid"] == currentUserID;

import { get } from 'enmity/api/settings';
import { getByKeyword } from 'enmity/metro';
import { Dialog, Linking, Toasts } from 'enmity/metro/common';
import { Icons } from '../../../common/components/_pluginSettings/utils';
import manifest from "../../manifest.json";

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
    content: res,
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
    content: res?.message || "Response is empty",
    source: Icons.Debug_Command.Sent,
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
    content: await res.text(),
    source: Icons.Debug_Command.Sent,
  });
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

export function canDeleteReview(review: any, currentUserID: string) { return review.senderdiscordid == currentUserID };

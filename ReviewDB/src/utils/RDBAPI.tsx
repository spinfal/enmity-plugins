import { get, set } from 'enmity/api/settings';
import { Dialog, Linking, Toasts } from 'enmity/metro/common';
import { Icons } from '../../../common/components/_pluginSettings/utils';
import { API_URL } from '../../manifest.json';
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

export function getReviews(userID: string) {
  return fetch(`${API_URL}/getUserReviews?snowflakeFormat=string&discordid=${userID}`).then((res) => res.json()).catch((err) => {
    Toasts.open({
      content: "Error while fetching reviews. Check logs for more info.",
      source: Icons.Failed,
    })
    console.log("[ReviewDB] Error while fetching reviews:", err)
  });
}

export function addReview(review: any) {
  checkToken();

  return fetch(API_URL + "/addUserReview", {
    method: "POST",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(r => r.text())
    .then(res => {
      res && Toasts.open({
        content: res,
        source: Icons.Pencil,
      });
      return console.log("[ReviewDB]", Response[res] ?? Response.error);
    });
}

export function deleteReview(id: number) {
  checkToken();

  return fetch(API_URL + "/deleteReview", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify({
      token: getRdbToken(),
      reviewid: id
    })
  }).then(r => r.json()).then(res => {
    Toasts.open({
      content: res?.message || "Response is empty",
      source: Icons.Debug_Command.Sent,
    });
  })
}

export async function reportReview(id: number) {
  checkToken();

  const res = await fetch(API_URL + "/reportReview", {
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
//   return fetch(API_URL + "/getLastReviewID?discordid=" + userID)
//     .then(r => r.text())
//     .then(Number);
// }

export function canDeleteReview(review: any, currentUserID: string) {
  if (review.senderdiscordid == currentUserID) return true;
}
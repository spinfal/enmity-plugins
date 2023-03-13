import { get, set } from 'enmity/api/settings';
import { getByName } from 'enmity/metro';
import { Dialog, Navigation, Toasts } from 'enmity/metro/common';
import React from 'react';
import { Icons } from '../../../common/components/_pluginSettings/utils';
import manifest from "../../manifest.json";
import Page from './Page';
import { ReviewContentProps } from './types';

const getRdbToken = () => get(manifest.name, "rdbToken", "");
const OAuth2AuthorizeModal = getByName("OAuth2AuthorizeModal");

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
        showOAuth2Modal();
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

export const showOAuth2Modal = () => get(manifest.name, "rdbToken", "") == "" 
  ? Navigation.push(Page, {
    component: () => <OAuth2AuthorizeModal 
      clientId="915703782174752809"
      redirectUri={manifest.API_URL + "/URauth"}
      scopes={["identify"]}
      responseType={"code"}
      permissions={0n}
      cancelCompletesFlow={false}
      callback={async function({ location }) {
        try {
          const authURL = new URL(location);
          authURL.searchParams.append("returnType", "json");
          authURL.searchParams.append("clientMod", "enmity");

          const res = await fetch(authURL, { headers: { accept: "application/json" } });
          const { token, status } = await res.json();

          if (status === 0) {
            // success! we can set the token
            set(manifest.name, "rdbToken", token)
          } else {
            // failure :c
            throw new Error(`Status returned by backend was not OK: ${status}`);
          }
        } catch(e) {
          Navigation.pop();
          console.error(`[${manifest.name}] Error when authorizing account: ${e}`)
        }
      }}
      dismissOAuthModal={() => Navigation.pop()}
    />
  }) 
  : Toasts.open({
    content: "You already have a token set!",
    source: Icons.Initial
  })

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

/**
 * coming to an update near you: new review notifications
 * eta? idk
 */
// export function getLastReviewID(userID: string) {
//   return fetch(manifest.API_URL + "/getLastReviewID?discordid=" + userID)
//     .then(r => r.text())
//     .then(Number);
// }

export const canDeleteReview = (review: ReviewContentProps, currentUserID: string) => review["senderdiscordid"] == currentUserID;

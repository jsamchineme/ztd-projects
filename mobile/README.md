# ZTD Studio phone app

Rings your phone when something happens in Studio: Claude finishes (or fails) in your chat, a project is ready,
someone accepts your invitation, and, if you turn it on, when Claude finishes in a teammate's chat. You choose which
on Studio's **Account → Phone notifications**.

It's an Expo (React Native, SDK 58) app. It keeps a WebSocket open to Studio (`wss://<studio>/api/phone/socket`,
served by `lib/phone.mjs`), and for each message it shows a notification with sound and vibration. While the app is
open it keeps vibrating until you tap **Stop** (you can turn that off in the app).

| File | What it does |
| --- | --- |
| `App.js` | The screens: pairing (scan or paste the code), the connection, settings and recent messages, and the ringing screen |
| `src/socket.js` | The connection: hello with the phone's token, catching up on missed messages, pings, reconnecting |
| `src/alerts.js` | Notifications (an Android channel at the highest importance), the repeating vibration, opening Studio from a notification |
| `src/store.js` | The pairing in secure storage; recent messages and settings in app storage |

## Getting it on your phone

You need [Node](https://nodejs.org) on a computer, and the **Expo Go** app on your phone (App Store or Play Store).

**Quickest: run it from your computer.**

```sh
cd mobile
npm install
npx expo start --tunnel
```

Scan the QR code it prints with your phone's camera (iPhone) or with Expo Go (Android). The app opens in Expo Go.
It keeps working while the computer is on and `expo start` is running.

**Hosted on Expo, so the computer can be off.** Make a free account at expo.dev, then once:

```sh
cd mobile
npx eas-cli@latest login
npx eas-cli@latest init            # links the app to your Expo account
npx eas-cli@latest update:configure
```

and each time the app changes:

```sh
npx eas-cli@latest update --branch main --message "what changed"
```

Open the project on expo.dev → Updates, and scan the update's QR code with Expo Go.

**Its own app (Android), without Expo Go:** `npx eas-cli@latest build -p android --profile preview` builds an APK
on Expo's servers and gives you a link to install it. On iPhone, an installable build needs an Apple developer account.

## Pairing

1. On Studio, open **Account → Phone notifications** and press **Pair a phone**.
2. In the app, tap **Scan the code** and point the phone at the QR code (or copy the code and paste it).
3. Studio shows **✓ Connected**. Press **Send a test**: the phone should ring.

The code is shown once and only lets a phone receive your notifications. Remove a phone on the same Account page.

## What to expect

- Messages arrive instantly while the app is open, and for a while after you switch away from it. Phones pause apps
  in the background (iPhones within seconds, Android after some minutes), and then the connection stops.
- When you open the app again it reconnects and catches up on the last day's messages, with one notification for them.
- To never miss one, turn on **Keep the screen on** and leave the app open, for example on a charger on your desk.
- Ringing with the app fully closed would need push notifications through Apple and Google (Expo's push service and
  a build of the app of its own rather than Expo Go). The Studio side would then send a push as well as the
  WebSocket message.

## Checking it

```sh
npx expo-doctor                                   # dependencies and app.json
npx expo export --platform android --output-dir /tmp/expo-check   # it bundles
```

Studio's `ops/check.sh` skips this folder (it's not Node code), and Studio's install doesn't copy it to the server.

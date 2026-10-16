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

The app is built and hosted by Expo, in the Expo account `jsamchineme` (project
https://expo.dev/accounts/jsamchineme/projects/ztd-studio-phone). Nothing runs on a computer.

**Android:** open the latest build on that page (Builds) on the phone and install the APK. Android asks once to
allow installs from the browser.

**Changing the app** (run in `mobile/`, with an Expo access token from https://expo.dev/settings/access-tokens in
`EXPO_TOKEN`):

- JavaScript changes (`App.js`, `src/`): publish them, and the installed app picks them up the next time it's opened
  twice (once to download, once to use):
  `npx eas-cli@latest update --channel preview --message "what changed"`
- New native packages, permissions or icons in `app.json`, or a new Expo SDK: build a new APK and install it:
  `npx eas-cli@latest build --platform android --profile preview`

**iPhone:** an installable build needs an Apple developer account (`--platform ios`, the same commands otherwise).

**For development** you can still run it from a computer with Expo Go: `npm install`, then `npx expo start --tunnel`.

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

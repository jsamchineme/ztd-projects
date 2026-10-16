# ZTD Studio phone app

Rings your phone when something happens in Studio: Claude finishes (or fails) in your chat, a project is ready,
someone accepts your invitation, and, if you turn it on, when Claude finishes in a teammate's chat. You choose which
on Studio's **Account → Phone notifications**.

It's an Expo (React Native) app on SDK 57, the newest one Expo Go in the App Store runs. It keeps a WebSocket open to Studio (`wss://<studio>/api/phone/socket`,
served by `lib/phone.mjs`), and for each message it shows a notification with sound and vibration. Studio also sends
each message as a push, so it arrives with the app closed. While the app is
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
  `npx eas-cli@latest update --channel preview --environment preview --message "what changed"`
- New native packages, permissions or icons in `app.json`, or a new Expo SDK: build a new APK and install it:
  `npx eas-cli@latest build --platform android --profile preview`

**iPhone (Expo Go):** install **Expo Go** from the App Store and sign in with the same Expo account. Then, on the
iPhone, open https://studio.ztddevs.com/api/phone/app (also linked on Studio's Account → Phone notifications). It
forwards to the app in Expo Go,
`exp://u.expo.dev/13ca0973-4369-458f-b5da-dbaeb85ef01c?channel-name=expo-go&runtime-version=exposdk:57.0.0`, and Expo Go
keeps it in its recent projects. An app of its own on iPhone would need an Apple developer account.

To publish a change for Expo Go (`app.config.js` then marks it with the Expo SDK version, which is what Expo Go loads):
`EXPO_GO=1 npx eas-cli@latest update --channel expo-go --platform ios --environment preview --message "what changed"`.
After an Expo SDK upgrade, change `exposdk:57.0.0` in the link here and in `PHONE_APP_URL` in `lib/phone.mjs`.

**For development** you can still run it from a computer with Expo Go: `npm install`, then `npx expo start --tunnel`.

## Pairing

1. On Studio, open **Account → Phone notifications** and press **Pair a phone**.
2. In the app, tap **Scan the code** and point the phone at the QR code (or copy the code and paste it).
3. Studio shows **✓ Connected**. Press **Send a test**: the phone should ring.

The code is shown once and only lets a phone receive your notifications. Remove a phone on the same Account page.

## What to expect

- Once the app has been opened and allowed to send notifications, it gives Studio its Expo push token, and every
  message also goes through Expo's push service (`lib/phone.mjs`). The phone then shows it with sound even when the
  app is closed. Studio's Account page shows "rings with the app closed" for that phone.
- While the app is open, messages come over the WebSocket and the phone keeps vibrating until you tap **Stop**. The
  push copy of the same message is dropped, so nothing shows twice.
- On iPhone this works in Expo Go. On Android, Expo Go can't get pushes (since SDK 53); the APK build can, once a
  Firebase (FCM) key is added to the Expo project.
- Like an alarm: until you open the app (or tap the notification), Studio pushes it again every 30 seconds, up to 4
  more times, marked "Reminder 1 of 4" and so on. The app's **Keep ringing until I respond** switch turns this off
  for that phone. With the app open, it vibrates until you tap **Stop** instead.
- For banners that stay until you swipe them away: iPhone Settings → Notifications → Expo Go → Banner Style →
  Persistent.
- Louder, alarm-style ringing (Apple's AlarmKit, a custom sound, notifications that break through Focus) needs an
  app of its own rather than Expo Go, so an Apple developer account.

## Checking it

```sh
npx expo-doctor                                   # dependencies and app.json
npx expo export --platform android --output-dir /tmp/expo-check   # it bundles
```

Studio's `ops/check.sh` skips this folder (it's not Node code), and Studio's install doesn't copy it to the server.

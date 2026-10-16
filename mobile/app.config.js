// app.json is the app's settings. Publishing for Expo Go (EXPO_GO=1, see README.md) marks the update with the Expo
// SDK version instead of the app version, because that's what Expo Go loads. Builds of the app keep app.json's.
module.exports = ({ config }) => process.env.EXPO_GO === '1'
  ? { ...config, runtimeVersion: `exposdk:${require('expo/package.json').version.split('.')[0]}.0.0` }
  : config;

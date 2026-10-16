// What the app remembers. The pairing (it includes the token) is kept in the phone's secure storage; the recent
// messages and settings in ordinary app storage.
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAIRING = 'studio.pairing';
const MESSAGES = 'studio.messages';
const LAST_ID = 'studio.lastId';
const SETTINGS = 'studio.settings';
const KEEP = 100;

const json = async (p, fallback) => { try { const v = await p; return v ? JSON.parse(v) : fallback; } catch { return fallback; } };

export const loadPairing = () => json(SecureStore.getItemAsync(PAIRING), null);
export const savePairing = p => SecureStore.setItemAsync(PAIRING, JSON.stringify(p));
export async function forgetPairing(){
  await SecureStore.deleteItemAsync(PAIRING);
  await AsyncStorage.multiRemove([MESSAGES, LAST_ID]);
}

export const loadMessages = () => json(AsyncStorage.getItem(MESSAGES), []);
export const saveMessages = list => AsyncStorage.setItem(MESSAGES, JSON.stringify(list.slice(0, KEEP)));
export const loadLastId = () => json(AsyncStorage.getItem(LAST_ID), null);
export const saveLastId = id => AsyncStorage.setItem(LAST_ID, JSON.stringify(id));

export const DEFAULT_SETTINGS = { ring: true, keepAwake: false };
export const loadSettings = async () => ({ ...DEFAULT_SETTINGS, ...await json(AsyncStorage.getItem(SETTINGS), {}) });
export const saveSettings = s => AsyncStorage.setItem(SETTINGS, JSON.stringify(s));

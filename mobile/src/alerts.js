// What happens when a message arrives: a notification with sound (also on the lock screen), and, while the app is open,
// the phone keeps vibrating until you tap Stop. Studio also sends each message as a push (through Expo), which the
// phone shows by itself while the app is closed; while it's open, the app handles the push like a socket message.
import { Platform, Vibration, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const CHANNEL = 'studio-alerts';
const PATTERN = [0, 700, 400, 700, 400, 700];
const RING_FOR = 60000;   // stop ringing by itself after a minute

// While the app is open: show its own notifications; a push from Studio goes to onPush (the same message may already
// have come over the socket, and then it's dropped) and isn't shown twice.
let onPush = null;
export function handlePushes(fn){ onPush = fn; return () => { if (onPush === fn) onPush = null; }; }
const SHOW = { shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false };
const HIDE = { shouldShowBanner: false, shouldShowList: false, shouldPlaySound: false, shouldSetBadge: false };
Notifications.setNotificationHandler({
  handleNotification: async n => {
    const d = n.request.content.data;
    if (!d?.studio || !onPush) return SHOW;
    onPush({ id: d.id, at: d.at, event: d.event, title: d.title, body: d.body, url: d.url });
    return HIDE;
  },
});

// Where Studio sends pushes for this phone, or null (no permission, or not possible here).
export async function pushToken(){
  try {
    const projectId = Constants.easConfig?.projectId || Constants.expoConfig?.extra?.eas?.projectId;
    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (e){ console.warn('No push token', e?.message); return null; }
}

// Returns true when the phone lets the app show notifications.
export async function setUpNotifications(){
  if (Platform.OS === 'android'){
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Studio alerts',
      description: 'Claude finished, a project is ready, and the other events you choose in Studio.',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: PATTERN,
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') ({ status } = await Notifications.requestPermissionsAsync());
  return status === 'granted';
}

export function showNotification({ title, body, url }){
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default', data: { url, local: true }, priority: Notifications.AndroidNotificationPriority.MAX, vibrate: PATTERN },
    trigger: Platform.OS === 'android' ? { channelId: CHANNEL } : null,
  });
}

let ringTimer = null;
export function startRinging(){
  Vibration.vibrate(PATTERN, true);
  clearTimeout(ringTimer);
  ringTimer = setTimeout(stopRinging, RING_FOR);
}
export function stopRinging(){
  clearTimeout(ringTimer);
  Vibration.cancel();
}

// Tapping a notification opens its Studio page in the browser.
export function onNotificationTap(){
  const open = r => { const url = r?.notification?.request?.content?.data?.url; if (url) Linking.openURL(url).catch(() => {}); };
  const last = Notifications.getLastNotificationResponse();
  if (last){ open(last); Notifications.clearLastNotificationResponse(); }
  const sub = Notifications.addNotificationResponseReceivedListener(open);
  return () => sub.remove();
}

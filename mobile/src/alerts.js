// What happens when a message arrives: a notification with sound (also on the lock screen), and, while the app is open,
// the phone keeps vibrating until you tap Stop.
import { Platform, Vibration, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL = 'studio-alerts';
const PATTERN = [0, 700, 400, 700, 400, 700];
const RING_FOR = 60000;   // stop ringing by itself after a minute

// Show notifications even while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

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
    content: { title, body, sound: 'default', data: { url }, priority: Notifications.AndroidNotificationPriority.MAX, vibrate: PATTERN },
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

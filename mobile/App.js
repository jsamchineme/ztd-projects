// ZTD Studio phone app: pairs with Studio (Account → Phone notifications), keeps a connection open, and rings when
// Studio sends a notification. See README.md.
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, FlatList, Linking, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { connect, parseCode } from './src/socket';
import { setUpNotifications, showNotification, startRinging, stopRinging, onNotificationTap, pushToken, handlePushes } from './src/alerts';
import * as store from './src/store';

const C = { navy: '#00427c', gold: '#ffc349', bg: '#f9f8f5', panel: '#ffffff', line: '#e4e3dc', text: '#111111', muted: '#5f6368', ok: '#2f7d4f', bad: '#b3261e', warn: '#8a5b00' };

export default function App(){
  const [loaded, setLoaded] = useState(false);
  const [pairing, setPairing] = useState(null);
  const [notice, setNotice] = useState('');
  useEffect(() => { store.loadPairing().then(p => { setPairing(p); setLoaded(true); }); }, []);

  const unpair = async message => { await store.forgetPairing(); setPairing(null); setNotice(message || ''); };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.screen}>
        <StatusBar style="dark" />
        {!loaded ? null : pairing
          ? <Home pairing={pairing} onUnpair={unpair} />
          : <Pair notice={notice} onPaired={async p => { await store.savePairing(p); setNotice(''); setPairing(p); }} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ---------- pairing ----------
function Pair({ notice, onPaired }){
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const done = useRef(false);

  const use = text => {
    const p = parseCode(text);
    if (!p){ setError('That isn’t a Studio pairing code. On Studio, open Account → Phone notifications → Pair a phone.'); return false; }
    done.current = true;
    onPaired(p);
    return true;
  };
  const scan = async () => {
    setError('');
    if (!permission?.granted){
      const r = await requestPermission();
      if (!r.granted){ setError('Allow the camera to scan the code, or paste the code below instead.'); return; }
    }
    done.current = false;
    setScanning(true);
  };

  if (scanning) return (
    <View style={s.fill}>
      <CameraView style={s.fill} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => { if (done.current) return; if (!use(data)) setScanning(false); }} />
      <View style={s.scanBar}>
        <Text style={s.scanText}>Point at the code on Studio’s Account page</Text>
        <Btn label="Cancel" onPress={() => setScanning(false)} />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <Logo />
      <Text style={s.h1}>Studio notifications</Text>
      <Text style={s.p}>Your phone rings when Claude finishes in your chats, a project is ready, and the other things you choose in Studio.</Text>
      {notice ? <Text style={[s.box, s.badBox]}>{notice}</Text> : null}
      <View style={s.card}>
        <Text style={s.h2}>Pair this phone</Text>
        <Text style={s.p}>On Studio, open <Text style={s.b}>Account → Phone notifications</Text> and press <Text style={s.b}>Pair a phone</Text>. Then scan the code it shows.</Text>
        <Btn label="Scan the code" primary onPress={scan} />
        <Text style={[s.p, { marginTop: 18 }]}>Or copy the code on Studio and paste it here:</Text>
        <TextInput style={s.input} value={code} onChangeText={t => { setCode(t); setError(''); }} placeholder="https://studio…#…"
          autoCapitalize="none" autoCorrect={false} />
        <Btn label="Pair" onPress={() => use(code)} disabled={!code.trim()} />
        {error ? <Text style={[s.box, s.badBox]}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
}

// ---------- paired ----------
function Home({ pairing, onUnpair }){
  const [status, setStatus] = useState({ state: 'connecting' });
  const [info, setInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(store.DEFAULT_SETTINGS);
  const [allowed, setAllowed] = useState(true);
  const [pushOn, setPushOn] = useState(false);
  const [ringing, setRinging] = useState(null);
  const lastId = useRef(null);
  const push = useRef(null);   // this phone's Expo push token, once known
  const settingsRef = useRef(settings);
  const conn = useRef(null);
  const appState = useRef(AppState.currentState);

  const ring = useCallback(m => {
    const open = appState.current === 'active';
    // In the background with push on, the push is the notification; another from here would show it twice.
    if (open || !push.current) showNotification(m).catch(() => {});
    if (settingsRef.current.ring && open){ setRinging(m); startRinging(); }
  }, []);

  useEffect(() => {
    let alive = true;
    // With notifications allowed, Studio also pushes each message, so the phone shows it while the app is closed.
    setUpNotifications().then(async ok => {
      if (!alive) return;
      setAllowed(ok);
      const t = ok ? await pushToken() : null;
      if (!alive || !t) return;
      push.current = t; setPushOn(true);
      conn.current?.pushToken(t);
    }).catch(() => {});
    const untap = onNotificationTap();
    // The same message can come over the socket and as a push: whichever is first counts.
    let receive = () => {};
    const unpush = handlePushes(m => receive(m));
    (async () => {
      const [saved, last, set] = await Promise.all([store.loadMessages(), store.loadLastId(), store.loadSettings()]);
      if (!alive) return;
      setMessages(saved); lastId.current = last; setSettings(set); settingsRef.current = set;
      const missed = [];
      let missedTimer = null;
      receive = m => {
        if (lastId.current != null && m.id <= lastId.current) return;
        lastId.current = m.id; store.saveLastId(m.id);
        setMessages(list => { const next = [m, ...list.filter(x => x.id !== m.id)]; store.saveMessages(next); return next; });
        if (!m.missed) return ring(m);
        // Missed while offline: with push on, the phone already showed them, so they're only listed. Otherwise they
        // arrive together and get one notification.
        if (push.current) return;
        missed.push(m);
        clearTimeout(missedTimer);
        missedTimer = setTimeout(() => {
          const n = missed.length, newest = missed[n - 1];
          missed.length = 0;
          ring(n === 1 ? newest : { ...newest, title: `${n} notifications while you were away`, body: newest.title });
        }, 300);
      };
      conn.current = connect(pairing, {
        getLastId: () => lastId.current,
        getPushToken: () => push.current,
        onStatus: st => alive && setStatus(st),
        onReady: r => {
          setInfo(r);
          if (lastId.current == null || r.last < lastId.current){ lastId.current = r.last; store.saveLastId(r.last); }
        },
        onMessage: m => receive(m),
        onUnpaired: error => onUnpair(error),
      });
    })();
    const sub = AppState.addEventListener('change', next => {
      appState.current = next;
      if (next === 'active') conn.current?.wake();
    });
    return () => { alive = false; untap(); unpush(); sub.remove(); conn.current?.close(); stopRinging(); };
  }, [pairing]);

  useEffect(() => {
    if (settings.keepAwake) activateKeepAwakeAsync('studio').catch(() => {});
    else deactivateKeepAwake('studio').catch(() => {});
  }, [settings.keepAwake]);

  const change = (key, value) => { const next = { ...settings, [key]: value }; setSettings(next); settingsRef.current = next; store.saveSettings(next); };
  const stop = () => { stopRinging(); setRinging(null); };

  const dot = { connected: C.ok, connecting: C.warn, offline: C.bad }[status.state];
  const label = status.state === 'connected' ? 'Connected' : status.state === 'connecting' ? 'Connecting…' : `Offline · trying again in ${Math.round(status.retryIn / 1000)} s`;

  return (
    <View style={s.fill}>
      <FlatList data={messages} keyExtractor={m => String(m.id)} contentContainerStyle={s.pad}
        ListHeaderComponent={<>
          <View style={s.row}>
            <Logo small />
            <View style={{ flex: 1 }}>
              <Text style={s.h2}>Studio notifications</Text>
              <Text style={s.small}>{info ? `${info.user} · ${info.phone}` : pairing.studio.replace(/^https?:\/\//, '')}</Text>
            </View>
          </View>
          <View style={[s.card, s.row]}>
            <View style={[s.dot, { backgroundColor: dot }]} />
            <Text style={[s.b, { flex: 1 }]}>{label}</Text>
            <Btn small label="Send a test" onPress={() => { if (!conn.current?.test()) conn.current?.wake(); }} disabled={status.state !== 'connected'} />
          </View>
          {!allowed ? (
            <Pressable onPress={() => Linking.openSettings()}>
              <Text style={[s.box, s.badBox]}>Notifications are turned off for this app, so it can’t ring. Tap to open settings and allow them.</Text>
            </Pressable>
          ) : null}
          <View style={s.card}>
            <Toggle label="Keep ringing until I tap Stop" hint="While the app is open. Up to a minute." value={settings.ring} onChange={v => change('ring', v)} />
            <Toggle label="Keep the screen on" hint="Leave the phone on your desk with the app open, and it never misses a message." value={settings.keepAwake} onChange={v => change('keepAwake', v)} />
          </View>
          <Text style={s.small}>{pushOn
            ? 'Push is on: your phone gets these with the app closed too. While the app is open, it keeps ringing until you tap Stop.'
            : 'Push is off, so messages only arrive while the app is open. Allow notifications for this app to get them with it closed.'} Choose what rings in Studio: Account → Phone notifications.</Text>
          <Text style={[s.h3, { marginTop: 22 }]}>Recent</Text>
          {!messages.length ? <Text style={s.small}>Nothing yet. Press Send a test to try it.</Text> : null}
        </>}
        renderItem={({ item: m }) => (
          <Pressable style={s.msg} onPress={() => m.url && Linking.openURL(m.url).catch(() => {})}>
            <Text style={s.b}>{m.title}</Text>
            {m.body ? <Text style={s.p} numberOfLines={4}>{m.body}</Text> : null}
            <Text style={s.small}>{when(m.at)}</Text>
          </Pressable>
        )}
        ListFooterComponent={<View style={{ marginTop: 28 }}><Btn label="Unpair this phone" onPress={() => onUnpair('')} /></View>}
      />
      <Modal visible={!!ringing} animationType="fade" transparent onRequestClose={stop}>
        <View style={s.ringBack}>
          <View style={s.ringCard}>
            <Logo />
            <Text style={[s.h1, { textAlign: 'center' }]}>{ringing?.title}</Text>
            {ringing?.body ? <Text style={[s.p, { textAlign: 'center' }]} numberOfLines={6}>{ringing.body}</Text> : null}
            <Btn label="Stop" primary onPress={stop} />
            {ringing?.url ? <Btn label="Open in Studio" onPress={() => { Linking.openURL(ringing.url).catch(() => {}); stop(); }} /> : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------- bits ----------
function when(at){
  const d = new Date(at), today = new Date().toDateString() === d.toDateString();
  return (today ? '' : d.toLocaleDateString() + ' ') + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function Btn({ label, onPress, primary, small, disabled }){
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [s.btn, primary && s.btnPrimary, small && s.btnSmall, (pressed || disabled) && { opacity: disabled ? 0.45 : 0.75 }]}>
      <Text style={[s.btnText, primary && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}
function Toggle({ label, hint, value, onChange }){
  return (
    <View style={[s.row, { paddingVertical: 8 }]}>
      <View style={{ flex: 1 }}><Text style={s.b}>{label}</Text><Text style={s.small}>{hint}</Text></View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: C.navy }} />
    </View>
  );
}
function Logo({ small }){
  const n = small ? 40 : 64;
  return (
    <View style={{ width: n, height: n, borderRadius: n * 0.22, backgroundColor: C.navy, justifyContent: 'flex-end', padding: n * 0.2, marginBottom: small ? 0 : 16, alignSelf: small ? 'auto' : 'center' }}>
      <View style={{ height: n * 0.1, backgroundColor: C.gold, borderRadius: 2 }} />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  fill: { flex: 1 },
  pad: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  h1: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 8, textAlign: 'center' },
  h2: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 4 },
  h3: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 8 },
  p: { fontSize: 15, lineHeight: 21, color: C.text, marginBottom: 10 },
  b: { fontWeight: '700', color: C.text, fontSize: 15 },
  small: { fontSize: 13, lineHeight: 18, color: C.muted },
  card: { backgroundColor: C.panel, borderColor: C.line, borderWidth: 1, borderRadius: 16, padding: 16, marginVertical: 12 },
  box: { borderRadius: 10, padding: 12, marginTop: 12, fontSize: 14, lineHeight: 20, overflow: 'hidden' },
  badBox: { backgroundColor: '#fbe7e5', color: C.bad },
  input: { borderColor: C.line, borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#fff', marginBottom: 10, color: C.text },
  btn: { borderColor: C.line, borderWidth: 1, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 13, paddingHorizontal: 16, alignItems: 'center', marginTop: 8 },
  btnPrimary: { backgroundColor: C.navy, borderColor: C.navy },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 12, marginTop: 0 },
  btnText: { fontSize: 15, fontWeight: '600', color: C.text },
  dot: { width: 12, height: 12, borderRadius: 6 },
  msg: { backgroundColor: C.panel, borderColor: C.line, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10 },
  scanBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, paddingBottom: 36, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanText: { color: '#fff', fontSize: 15, textAlign: 'center', marginBottom: 6 },
  ringBack: { flex: 1, backgroundColor: 'rgba(0,30,60,0.55)', justifyContent: 'center', padding: 24 },
  ringCard: { backgroundColor: C.panel, borderRadius: 20, padding: 24, borderTopWidth: 6, borderTopColor: C.gold },
});

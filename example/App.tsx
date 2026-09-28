import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import UseAnimations, { animationKeys, type UseAnimationsHandle } from 'expo-useanimations';
import animations from 'expo-useanimations/all';
import checkBox from 'expo-useanimations/lib/checkBox';
import heart from 'expo-useanimations/lib/heart';
import playPause from 'expo-useanimations/lib/playPause';

const ACCENTS = ['#111827', '#e11d48', '#2563eb', '#16a34a', '#f59e0b'];

export default function App() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState(0);
  const [checked, setChecked] = useState(true);
  const [likes, setLikes] = useState(0);
  const player = useRef<UseAnimationsHandle>(null);
  const { width } = useWindowDimensions();

  const bg = dark ? '#0b0f19' : '#f4f4f5';
  const card = dark ? '#161b2b' : '#ffffff';
  const text = dark ? '#e5e7eb' : '#111827';
  const color = dark && accent === 0 ? '#e5e7eb' : ACCENTS[accent];
  const columns = Math.max(3, Math.floor(Math.min(width, 900) / 110));

  const header = (
    <View style={styles.headerWrap}>
      <Text style={[styles.title, { color: text }]}>expo-useanimations</Text>
      <Text style={[styles.subtitle, { color: text }]}>
        {animationKeys.length} icons · {Platform.OS} · zero native code
      </Text>

      <View style={[styles.card, { backgroundColor: card }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: text }]}>Dark mode</Text>
          <Switch value={dark} onValueChange={setDark} testID="dark-switch" />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: text }]}>strokeColor</Text>
          <View style={styles.swatches}>
            {ACCENTS.map((c, i) => (
              <Pressable
                key={c}
                onPress={() => setAccent(i)}
                style={[styles.swatch, { backgroundColor: c }, accent === i && styles.swatchOn]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card }]}>
        <Text style={[styles.section, { color: text }]}>Controlled checkbox</Text>
        <View style={styles.row}>
          <UseAnimations
            animation={checkBox}
            size={40}
            strokeColor={color}
            reverse={checked}
            onPress={() => setChecked((v) => !v)}
            testID="checkbox"
          />
          <Text style={[styles.label, { color: text }]}>{checked ? 'Checked' : 'Unchecked'}</Text>
        </View>

        <Text style={[styles.section, { color: text }]}>Render prop (button)</Text>
        <UseAnimations
          animation={heart}
          size={28}
          strokeColor="#e11d48"
          fillColor="#e11d48"
          onPress={() => setLikes((n) => n + 1)}
          render={(eventProps, anim) => (
            <Pressable {...eventProps} style={styles.button}>
              {anim}
              <Text style={styles.buttonText}>Like · {likes}</Text>
            </Pressable>
          )}
        />

        <Text style={[styles.section, { color: text }]}>Imperative ref</Text>
        <View style={styles.row}>
          <UseAnimations ref={player} animation={playPause} size={40} strokeColor={color} disabled />
          {(['play', 'playBackwards', 'toggle', 'reset'] as const).map((m) => (
            <Pressable key={m} onPress={() => player.current?.[m]()} style={styles.chip}>
              <Text style={styles.chipText}>{m}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[styles.section, { color: text, marginHorizontal: 16 }]}>
        All icons — tap (or hover on web)
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: bg }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <FlatList
        key={columns}
        data={animationKeys}
        numColumns={columns}
        keyExtractor={(k) => k}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.cell, { backgroundColor: card, width: `${100 / columns - 2}%` }]}>
            <UseAnimations
              animation={animations[item]}
              size={40}
              strokeColor={color}
              testID={`icon-${item}`}
            />
            <Text numberOfLines={1} style={[styles.cellLabel, { color: text }]}>
              {item}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingBottom: 48, maxWidth: 960, width: '100%', alignSelf: 'center' },
  headerWrap: { paddingTop: Platform.OS === 'android' ? 32 : 8 },
  title: { fontSize: 28, fontWeight: '700', marginHorizontal: 16, marginTop: 8 },
  subtitle: { fontSize: 14, opacity: 0.6, marginHorizontal: 16, marginBottom: 12 },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  label: { fontSize: 16, flexShrink: 1 },
  section: { fontSize: 13, fontWeight: '600', opacity: 0.6, textTransform: 'uppercase' },
  swatches: { flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  swatch: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: 'transparent' },
  swatchOn: { borderColor: '#94a3b8', transform: [{ scale: 1.15 }] },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#ffe4e6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  buttonText: { color: '#be123c', fontWeight: '600' },
  chip: { backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  chipText: { color: '#3730a3', fontSize: 13, fontWeight: '600' },
  cell: {
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  cellLabel: { fontSize: 11, opacity: 0.7, maxWidth: '90%' },
});

import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type Props = {
  advice?: string;
};

export default function AdviceSheet({ advice }: Props) {
  const snapPoints = useMemo(() => ['12%', '40%', '80%'], []);
  const ref = useRef<BottomSheet>(null);

  return (
    <BottomSheet ref={ref} snapPoints={snapPoints} index={0} enablePanDownToClose={false}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>EchoGuide</Text>
        <Text style={styles.body}>{advice || 'Ask for nearby parks, cafes, or outfit tips.'}</Text>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8 },
  heading: { color: '#0b1020', fontWeight: '700', fontSize: 16 },
  body: { color: '#233b6e' },
});

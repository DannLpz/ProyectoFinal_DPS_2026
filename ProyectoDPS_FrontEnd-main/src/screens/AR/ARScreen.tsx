    import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../config/theme';

export function ARScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Ver en mi Espacio</Text>
        <Text style={styles.subtitle}>La cámara se activará aquí (Fase 4).</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg },
  title: { ...theme.typography.heading, color: theme.colors.text },
  subtitle: { ...theme.typography.body, color: theme.colors.textMuted, marginTop: theme.spacing.sm, textAlign: 'center' },
});
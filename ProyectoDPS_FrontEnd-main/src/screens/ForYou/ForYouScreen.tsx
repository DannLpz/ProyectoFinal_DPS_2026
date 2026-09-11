import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../config/theme';

export function ForYouScreen() {
  const [prompt, setPrompt] = useState('');
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Para Ti (IA)</Text>
        <Text style={styles.subtitle}>Describe el mueble que imaginas.</Text>
        <TextInput style={styles.input} placeholder="Ej: una silla con ruedas" value={prompt} onChangeText={setPrompt} placeholderTextColor={theme.colors.textMuted} />
        <Pressable style={styles.button} onPress={() => console.log('Generar:', prompt)}>
          <Text style={styles.buttonText}>Generar Modelo 3D</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: theme.spacing.lg },
  title: { ...theme.typography.heading, color: theme.colors.text },
  subtitle: { ...theme.typography.body, color: theme.colors.textMuted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.lg },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, padding: theme.spacing.md, color: theme.colors.text, backgroundColor: theme.colors.surface, marginBottom: theme.spacing.md },
  button: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center' },
  buttonText: { ...theme.typography.bodyStrong, color: theme.colors.white },
}); 
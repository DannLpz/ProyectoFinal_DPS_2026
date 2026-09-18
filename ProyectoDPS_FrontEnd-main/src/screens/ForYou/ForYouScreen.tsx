import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../config/theme';
import { AIService } from '../../services/AIService';
import { useCatalogStore } from '../../store/useCatalogStore';
import type { Furniture } from '../../models/Furniture';
import type { MainTabParamList } from '../../navigation/types';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'ForYou'>;

const SUGGESTIONS = [
  'una silla con ruedas',
  'una mesa moderna de madera',
  'un sofá grande y cómodo',
  'una cama con cabecera alta',
  'un ropero de 2 puertas',
  'un estante para libros',
];

export function ForYouScreen() {
  const navigation = useNavigation<NavigationProp>();
  const addGeneratedFurniture = useCatalogStore((s) => s.addGeneratedFurniture);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<Furniture | null>(null);
  const [error, setError] = useState('');

const handleGenerate = async () => {
  if (prompt.trim().length < 3) {
    setError('Describe tu mueble con al menos 3 caracteres');
    return;
  }

  setLoading(true);
  setError('');
  setGenerated(null);

  try {
    const result = await AIService.generateFurniture(prompt);
    setGenerated(result);
    addGeneratedFurniture(result);
  } catch (err: any) {
    const backendMessage =
      err?.response?.data?.message ||
      'No pudimos generar el mueble. Intenta de nuevo.';
    setError(backendMessage);
  } finally {
    setLoading(false);
  }
};

  const handleSuggestion = (text: string) => {
    setPrompt(text);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>INTELIGENCIA ARTIFICIAL</Text>
          <Text style={styles.title}>Para Ti ✨</Text>
          <Text style={styles.subtitle}>
            Describe el mueble que imaginas y nuestra IA lo creará para ti
          </Text>
        </View>

        <Text style={styles.label}>Describe tu mueble</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: una silla con ruedas"
          placeholderTextColor={theme.colors.textMuted}
          value={prompt}
          onChangeText={setPrompt}
          multiline
          editable={!loading}
        />

        <Text style={styles.suggestionsLabel}>Sugerencias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsScroll}
        >
          {SUGGESTIONS.map((sug, i) => (
            <Pressable
              key={i}
              style={styles.suggestionChip}
              onPress={() => handleSuggestion(sug)}
            >
              <Text style={styles.suggestionText}>{sug}</Text>
            </Pressable>
          ))}
        </ScrollView>

       <Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed,
    loading && styles.buttonDisabled,
  ]}
  onPress={handleGenerate}
  disabled={loading}
>
  {loading ? (
    <View style={styles.loadingRow}>
      <ActivityIndicator color={theme.colors.white} />
      <Text style={styles.buttonText}>Generando modelo 3D...</Text>
    </View>
  ) : (
    <Text style={styles.buttonText}>✨ Generar con IA</Text>
  )}
</Pressable>

{loading && (
  <View style={styles.progressHint}>
    <Text style={styles.progressHintText}>
      La IA está diseñando tu mueble. Esto puede tardar entre 30 y 90 segundos.
    </Text>
  </View>
)}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {generated && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultBadge}>🤖 GENERADO POR IA</Text>
            </View>
            <Image
              source={{ uri: generated.thumbnailUrl }}
              style={styles.resultImage}
            />
            <Text style={styles.resultTitle}>{generated.name}</Text>
            <Text style={styles.resultDescription}>{generated.description}</Text>

            <View style={styles.resultActions}>
              <Pressable
                style={styles.arButton}
                onPress={() => navigation.navigate('AR')}
              >
                <Text style={styles.arButtonText}>📷 Ver en mi espacio</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  hero: { marginBottom: theme.spacing.lg },
  eyebrow: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xxs,
  },
  title: { ...theme.typography.heading, color: theme.colors.text, fontSize: 26 },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xxs,
    lineHeight: 18,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  progressHint: {
  backgroundColor: theme.colors.primarySoft,
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  borderRadius: theme.radii.md,
  marginBottom: theme.spacing.md,
  marginTop: -theme.spacing.xs,
},
progressHintText: {
  ...theme.typography.caption,
  color: theme.colors.primaryDark,
  textAlign: 'center',
  lineHeight: 16,
},
  suggestionsLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  suggestionsScroll: { marginBottom: theme.spacing.md },
  suggestionChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  suggestionText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontSize: 12,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.6 },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.white,
  },
  errorText: {
    ...theme.typography.caption,
    color: 'red',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  resultCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    ...theme.shadows.subtle,
  },
  resultHeader: { marginBottom: theme.spacing.sm },
  resultBadge: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    fontSize: 17,
  },
  resultDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xxs,
    marginBottom: theme.spacing.md,
  },
  resultActions: { flexDirection: 'row', gap: theme.spacing.sm },
  arButton: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  arButtonText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.white,
    fontSize: 14,
  },
});
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { theme } from '../../config/theme';
import { FurnitureService } from '../../services/FurnitureService';
import { useCatalogStore } from '../../store/useCatalogStore';
import type { Furniture } from '../../models/Furniture';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

// Emoji e ícono por categoría
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  silla: { emoji: '🪑', color: '#E8A87C' },
  mesa: { emoji: '🍽️', color: '#B5C7A3' },
  sofa: { emoji: '🛋️', color: '#87A8C4' },
  cama: { emoji: '🛏️', color: '#C4A5D6' },
  ropero: { emoji: '🚪', color: '#D6A5A5' },
  estante: { emoji: '📚', color: '#D6C4A5' },
  generado: { emoji: '🤖', color: '#F4A4B8' },
};

export function ARScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 👇 Leemos del store global para sincronización instantánea
  const defaultFurniture = useCatalogStore((s) => s.defaultFurniture);
  const generatedFurniture = useCatalogStore((s) => s.generatedFurniture);
  const setDefaultFurniture = useCatalogStore((s) => s.setDefaultFurniture);

  useEffect(() => {
    loadDefaultFurniture();
  }, []);

  const loadDefaultFurniture = async () => {
    try {
      setLoading(true);
      const defaults = await FurnitureService.getDefaultFurniture();
      setDefaultFurniture(defaults);
    } catch (err) {
      setError('No pudimos cargar los muebles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openARInBrowser = async (item: Furniture) => {
    const url = `${BASE_URL}/ar/viewer?model=${encodeURIComponent(
      item.modelUrl
    )}&name=${encodeURIComponent(item.name)}`;

    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('No se pudo abrir la URL:', url, err);
    }
  };

  const totalCount = defaultFurniture.length + generatedFurniture.length;

  // ---- Loading ----
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Preparando tu espacio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Error ----
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Contenido ----
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroIconCircle}>
            <Feather name="camera" size={28} color={theme.colors.white} />
          </View>
          <Text style={styles.heroEyebrow}>REALIDAD AUMENTADA</Text>
          <Text style={styles.heroTitle}>Ver en mi Espacio</Text>
          <Text style={styles.heroSubtitle}>
            Proyecta muebles a escala real en tu hogar usando la cámara
          </Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{defaultFurniture.length}</Text>
            <Text style={styles.statLabel}>Predeterminados</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAccent]}>
            <Text style={[styles.statNumber, styles.statNumberAccent]}>
              {generatedFurniture.length}
            </Text>
            <Text style={[styles.statLabel, styles.statLabelAccent]}>
              Generados IA
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* TIPS */}
        <View style={styles.tipBox}>
          <Feather name="info" size={16} color={theme.colors.primary} />
          <Text style={styles.tipText}>
            Toca un mueble y luego "Ver en mi espacio real" para activar la
            cámara.
          </Text>
        </View>

        {/* SECCIÓN: GENERADOS POR IA */}
        {generatedFurniture.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>🤖</Text>
              <Text style={styles.sectionTitle}>Generados por IA</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NUEVO</Text>
              </View>
            </View>

            {generatedFurniture.map((item) => (
              <FurnitureCard
                key={item.id}
                item={item}
                onPress={() => openARInBrowser(item)}
                isAI
              />
            ))}
          </View>
        )}

        {/* SECCIÓN: PREDETERMINADOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🛒</Text>
            <Text style={styles.sectionTitle}>Catálogo estándar</Text>
          </View>

          {defaultFurniture.map((item) => (
            <FurnitureCard
              key={item.id}
              item={item}
              onPress={() => openARInBrowser(item)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================
// Componente de tarjeta
// ============================
function FurnitureCard({
  item,
  onPress,
  isAI,
}: {
  item: Furniture;
  onPress: () => void;
  isAI?: boolean;
}) {
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META['generado'];

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.cardIconBox, { backgroundColor: meta?.color + '30' }]}>
          <Text style={styles.cardEmoji}>{meta?.emoji}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.name}
            </Text>
            {isAI && (
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>IA</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.arButton,
          pressed && styles.arButtonPressed,
        ]}
        onPress={onPress}
      >
        <Feather name="camera" size={16} color={theme.colors.white} />
        <Text style={styles.arButtonText}>Ver en mi espacio real</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  errorText: { ...theme.typography.body, color: 'red', textAlign: 'center' },

  // HERO
  hero: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  heroEyebrow: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xxs,
  },
  heroTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontSize: 26,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: theme.spacing.md,
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statCardAccent: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: '#F4A4B8',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statNumberAccent: { color: theme.colors.primary },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  statLabelAccent: { color: theme.colors.primary },

  // TIP
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  tipText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    flex: 1,
    lineHeight: 16,
  },

  // SECCIONES
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    fontSize: 17,
  },
  newBadge: {
    backgroundColor: '#F4A4B8',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
    marginLeft: 'auto',
  },
  newBadgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // CARD
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: theme.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardEmoji: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  cardTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 16,
  },
  aiBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
  },
  aiBadgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  cardDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  arButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },
  arButtonPressed: { opacity: 0.85 },
  arButtonText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.white,
    fontSize: 14,
  },
});
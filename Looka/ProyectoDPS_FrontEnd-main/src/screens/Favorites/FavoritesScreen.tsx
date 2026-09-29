import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { theme } from '../../config/theme';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import type { Furniture } from '../../models/Furniture';

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  silla: { emoji: '🪑', color: '#E8A87C' },
  mesa: { emoji: '🍽️', color: '#B5C7A3' },
  sofa: { emoji: '🛋️', color: '#87A8C4' },
  cama: { emoji: '🛏️', color: '#C4A5D6' },
  ropero: { emoji: '🚪', color: '#D6A5A5' },
  estante: { emoji: '📚', color: '#D6C4A5' },
  escritorio: { emoji: '💼', color: '#C4A5D6' },
  generado: { emoji: '🤖', color: '#F4A4B8' },
};

export function FavoritesScreen() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
          <Text style={styles.emptySubtitle}>
            Toca el corazón ❤️ en cualquier mueble del catálogo para guardarlo aquí.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>MIS FAVORITOS</Text>
            <Text style={styles.title}>Muebles guardados</Text>
            <Text style={styles.subtitle}>
              {favorites.length} {favorites.length === 1 ? 'mueble' : 'muebles'} en tu lista
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const fallbackMeta = { emoji: '🪑', color: '#E8A87C' };
const meta = CATEGORY_META[item.category] ?? fallbackMeta;
          return (
            <View style={styles.card}>
              <View style={[styles.cardIconBox, { backgroundColor: meta.color + '30' }]}>
                <Text style={styles.cardEmoji}>{meta.emoji}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              <Pressable
                style={styles.removeButton}
                onPress={() => removeFavorite(item.id)}
                hitSlop={10}
              >
                <Feather name="trash-2" size={18} color={theme.colors.primary} />
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: { fontSize: 56, marginBottom: theme.spacing.md },
  emptyTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
  header: { marginBottom: theme.spacing.lg },
  eyebrow: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontSize: 26,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xxs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.subtle,
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
  cardTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    fontSize: 15,
  },
  cardDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
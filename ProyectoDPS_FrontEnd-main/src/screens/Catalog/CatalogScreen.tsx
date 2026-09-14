import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../navigation/types';
import { theme } from '../../config/theme';
import { FurnitureService } from '../../services/FurnitureService';
import type { Furniture } from '../../models/Furniture';

const CATEGORIES = [
  { id: 'all', label: 'Todos', emoji: '✨' },
  { id: 'silla', label: 'Sillas', emoji: '🪑' },
  { id: 'mesa', label: 'Mesas', emoji: '🍽️' },
  { id: 'sofa', label: 'Sofás', emoji: '🛋️' },
  { id: 'cama', label: 'Camas', emoji: '🛏️' },
  { id: 'ropero', label: 'Roperos', emoji: '🚪' },
  { id: 'estante', label: 'Estantes', emoji: '📚' },
];

// Metadatos visuales por categoría (emoji + color de fondo)
const CATEGORY_META: Record<string, { emoji: string; bg: string; accent: string }> = {
  silla:   { emoji: '🪑', bg: '#F5E6D3', accent: '#C97B3E' },
  mesa:    { emoji: '🍽️', bg: '#E5EFE0', accent: '#5B8A55' },
  sofa:    { emoji: '🛋️', bg: '#E0E8F0', accent: '#4A6E9A' },
  cama:    { emoji: '🛏️', bg: '#EDE0F0', accent: '#7A4A9A' },
  ropero:  { emoji: '🚪', bg: '#F0E0E0', accent: '#9A4A4A' },
  estante: { emoji: '📚', bg: '#F0E8D8', accent: '#9A8040' },
};

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Catalog'>;

export function CatalogScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    loadFurniture();
  }, []);

  const loadFurniture = async () => {
    try {
      setLoading(true);
      const data = await FurnitureService.getDefaultFurniture();
      setFurniture(data);
    } catch (err) {
      setError('No pudimos cargar el catálogo. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFurniture = useMemo(() => {
    if (selectedCategory === 'all') return furniture;
    return furniture.filter((item) => item.category === selectedCategory);
  }, [furniture, selectedCategory]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando catálogo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>CATÁLOGO</Text>
            <Text style={styles.title}>Explora el hogar</Text>
          </View>
          <View style={styles.headerIconBox}>
            <Feather name="shopping-bag" size={20} color={theme.colors.primary} />
          </View>
        </View>
        <Text style={styles.subtitle}>
          {furniture.length} muebles curados para ti
        </Text>
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersContainer}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === selectedCategory;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* GRID DE MUEBLES */}
      <FlatList
        data={filteredFurniture}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              No hay muebles en esta categoría
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = CATEGORY_META[item.category] || {
            emoji: '🪑',
            bg: '#F0E8D8',
            accent: theme.colors.primary,
          };

          return (
            <Pressable
  style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
  onPress={() => navigation.navigate('AR', { preselectedItemId: item.id })}
>
              {/* Visual superior (emoji grande con fondo temático) */}
              <View style={[styles.cardVisual, { backgroundColor: meta.bg }]}>
                <Text style={styles.cardEmoji}>{meta.emoji}</Text>
                <View
                  style={[
                    styles.cardBadge,
                    { backgroundColor: meta.accent },
                  ]}
                >
                  <Text style={styles.cardBadgeText}>
                    {item.category.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Info inferior */}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Ver</Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </Pressable>
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
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  errorText: { ...theme.typography.body, color: 'red', textAlign: 'center' },

  // HEADER
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCopy: { flex: 1 },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: 2,
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

  // FILTROS
  filtersContainer: {
    maxHeight: 52,
    marginBottom: theme.spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.xs,
    height: 36,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipEmoji: { fontSize: 14 },
  chipText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextActive: { color: theme.colors.white },

  // GRID
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.xs,
  },
  columnWrapper: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  // CARD
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.subtle,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  cardVisual: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardEmoji: {
    fontSize: 56,
    textAlign: 'center',
  },
  cardBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 3,
    borderRadius: theme.radii.pill,
  },
  cardBadgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  cardBody: {
    padding: theme.spacing.sm,
  },
  cardTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    fontSize: 14,
    marginBottom: 2,
  },
  cardDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    minHeight: 28,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cardFooterText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 11,
  },

  // EMPTY
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyEmoji: { fontSize: 40, marginBottom: theme.spacing.sm },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
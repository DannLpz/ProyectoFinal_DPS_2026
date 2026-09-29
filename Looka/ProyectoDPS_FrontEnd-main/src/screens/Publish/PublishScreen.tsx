import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../../config/theme';
import { FurnitureService } from '../../services/FurnitureService';
import { ListingService } from '../../services/ListingService';
import type { Furniture } from '../../models/Furniture';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Publish'>;

// Emojis por categoría
const CATEGORY_EMOJI: Record<string, string> = {
  silla: '🪑',
  mesa: '🍽️',
  sofa: '🛋️',
  cama: '🛏️',
  ropero: '🚪',
  estante: '📚',
  escritorio: '💼',
  television: '📺',
  organizador: '🗄️',
  zapatero: '👟',
  generado: '🤖',
};

function getEmojiForFurniture(item: Furniture): string {
  // Si es IA generado, mostramos el robot
  if (item.source === 'ai-generated') return '🤖';
  // Si no, mostramos el emoji de la categoría
  return CATEGORY_EMOJI[item.category] || '🪑';
}

export function PublishScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [allFurniture, setAllFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    loadFurniture();
  }, []);

  const loadFurniture = async () => {
    try {
      setLoading(true);
      const [defaults, generated] = await Promise.all([
        FurnitureService.getDefaultFurniture(),
        FurnitureService.getGeneratedFurniture().catch(() => []),
      ]);
      setAllFurniture([...generated, ...defaults]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedFurniture = useMemo(
    () => allFurniture.find((f) => f.id === selectedId) || null,
    [allFurniture, selectedId]
  );

 const handleSelect = (item: Furniture) => {
  setSelectedId(item.id);
  setTitle(item.name);
  setDescription(item.description);
};

  const handlePublish = async () => {
  if (!selectedFurniture) {
    Alert.alert('Falta el mueble', 'Selecciona un mueble para publicar');
    return;
  }
  if (title.trim().length < 3) {
    Alert.alert('Título inválido', 'El título debe tener al menos 3 caracteres');
    return;
  }
  if (description.trim().length < 5) {
    Alert.alert('Descripción corta', 'La descripción debe tener al menos 5 caracteres');
    return;
  }
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
  if (isNaN(numericPrice) || numericPrice <= 0) {
    Alert.alert('Precio inválido', 'Ingresa un precio mayor a 0');
    return;
  }

  setPublishing(true);
  try {
    await ListingService.create({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      furnitureId: selectedFurniture.id,
    });

    Alert.alert(
      '¡Publicación exitosa!',
      `"${title}" ya está publicado por $${numericPrice.toFixed(2)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // 👇 Limpiar todo el formulario
            setSelectedId(null);
            setTitle('');
            setDescription('');
            setPrice('');
            // Recargar la lista de muebles (por si cambió algo)
            loadFurniture();
          },
        },
      ]
    );
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'Error publicando el mueble';
    Alert.alert('Error', msg);
  } finally {
    setPublishing(false);
  }
};

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando tus muebles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Feather name="arrow-left" size={24} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Publicar mueble</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.sectionLabel}>1. Selecciona un mueble</Text>
        <Text style={styles.sectionHint}>
          Elige del catálogo o de tus generados por IA
        </Text>

        <FlatList
          data={allFurniture}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          style={styles.carousel}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <Pressable
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.cardVisual}>
                  <Text style={styles.cardEmoji}>
  {getEmojiForFurniture(item)}
</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>
                    {item.source === 'ai-generated' ? 'IA' : item.category.toUpperCase()}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Feather name="check" size={12} color="white" />
                  </View>
                )}
              </Pressable>
            );
          }}
        />

        {/* FORMULARIO */}
        <Text style={styles.sectionLabel}>2. Detalles del producto</Text>

        <Text style={styles.fieldLabel}>Nombre del producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Silla Nórdica Premium"
          placeholderTextColor={theme.colors.textMuted}
          value={title}
          onChangeText={setTitle}
          editable={!publishing}
        />

        <Text style={styles.fieldLabel}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe tu mueble, materiales, color, etc."
          placeholderTextColor={theme.colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!publishing}
        />

        <Text style={styles.fieldLabel}>Precio (USD)</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceCurrency}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            editable={!publishing}
          />
          <Text style={styles.priceCurrency}>USD</Text>
        </View>

        {/* RESUMEN */}
        {selectedFurniture && (
          <View style={styles.summary}>
            <Feather name="info" size={16} color={theme.colors.primary} />
            <Text style={styles.summaryText}>
              Publicarás "{title || 'sin título'}" por{' '}
              <Text style={styles.summaryHighlight}>
                ${price ? parseFloat(price || '0').toFixed(2) : '0.00'}
              </Text>
            </Text>
          </View>
        )}

        {/* BOTÓN */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitPressed,
            publishing && styles.submitDisabled,
          ]}
          onPress={handlePublish}
          disabled={publishing}
        >
          {publishing ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="white" />
              <Text style={styles.submitText}>Publicando...</Text>
            </View>
          ) : (
            <Text style={styles.submitText}>✨ Publicar mueble</Text>
          )}
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...theme.typography.body, color: theme.colors.textMuted, marginTop: theme.spacing.md },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: { ...theme.typography.heading, color: theme.colors.text, fontSize: 20 },

  // Section labels
  sectionLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    fontSize: 15,
    marginBottom: theme.spacing.xxs,
    marginTop: theme.spacing.md,
  },
  sectionHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },

  // Carrusel
  carousel: { marginBottom: theme.spacing.md },
  carouselContent: { gap: theme.spacing.sm },
  card: {
    width: 130,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    position: 'relative',
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  cardVisual: {
    width: '100%',
    height: 70,
    borderRadius: theme.radii.md,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardEmoji: { fontSize: 36 },
  cardTitle: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 4,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
  },
  cardBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Formulario
  fieldLabel: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
  },
  priceCurrency: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primary,
    fontSize: 16,
  },
  priceInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  // Summary
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.lg,
  },
  summaryText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 18,
  },
  summaryHighlight: {
    fontWeight: '800',
    color: theme.colors.primary,
  },

  // Botón
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    ...theme.shadows.subtle,
  },
  submitPressed: { opacity: 0.85 },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    ...theme.typography.bodyStrong,
    color: 'white',
    fontSize: 15,
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
});
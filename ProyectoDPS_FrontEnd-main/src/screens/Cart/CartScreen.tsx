import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { theme } from '../../config/theme';
import { ListingService } from '../../services/ListingService';
import { useCartStore } from '../../store/useCartStore';
import type { Listing } from '../../models/Listing';

export function CartScreen() {
  const navigation = useNavigation();
  const { items, addItem, removeItem, isInCart, getTotal, clear } = useCartStore();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ListingService.getAll();
      setListings(data);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar los muebles publicados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [loadListings])
  );

  const total = getTotal();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega al menos un mueble para continuar.');
      return;
    }
    Alert.alert(
      '¡Prototipo!',
      `Total a pagar: $${total.toFixed(2)}\n\nEsta es una demo, no se procesará ningún pago.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            clear();
            Alert.alert('Compra simulada', 'Gracias por probar LOOka 🎉');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando carrito...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
                <Feather name="arrow-left" size={24} color={theme.colors.text} />
              </Pressable>
              <Text style={styles.headerTitle}>Mi carrito</Text>
              <View style={{ width: 24 }} />
            </View>

            {items.length > 0 && (
              <View style={styles.cartSummary}>
                <Text style={styles.cartSummaryTitle}>
                  🛒 En tu carrito ({items.length})
                </Text>
                {items.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Text style={styles.cartItemName} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.cartItemPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                    <Pressable
                      onPress={() => removeItem(item.id)}
                      hitSlop={8}
                      style={styles.removeBtn}
                    >
                      <Feather name="x" size={16} color={theme.colors.primary} />
                    </Pressable>
                  </View>
                ))}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionLabel}>Muebles publicados</Text>
            <Text style={styles.sectionHint}>
              Toca "Agregar" para añadir un mueble a tu carrito
            </Text>

            {listings.length === 0 && (
              <View style={styles.emptyPublished}>
                <Text style={styles.emptyPublishedText}>
                  Aún no hay muebles publicados.
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => {
          const inCart = isInCart(item.id);
          return (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.cardSeller}>
                    por {item.seller?.displayName || 'Anónimo'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={[styles.addBtn, inCart && styles.addBtnInCart]}
                onPress={() => (inCart ? removeItem(item.id) : addItem(item))}
              >
                <Feather
                  name={inCart ? 'check' : 'plus'}
                  size={16}
                  color={inCart ? theme.colors.primary : 'white'}
                />
                <Text style={[styles.addBtnText, inCart && styles.addBtnTextInCart]}>
                  {inCart ? 'Agregado' : 'Agregar'}
                </Text>
              </Pressable>
            </View>
          );
        }}
        ListFooterComponent={
          items.length > 0 ? (
            <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>
                💳 Pagar ${total.toFixed(2)}
              </Text>
            </Pressable>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...theme.typography.body, color: theme.colors.textMuted, marginTop: theme.spacing.md },

  listContent: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  headerTitle: { ...theme.typography.heading, color: theme.colors.text, fontSize: 20 },

  cartSummary: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cartSummaryTitle: {
    ...theme.typography.bodyStrong,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.sm,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 21, 38, 0.1)',
  },
  cartItemName: { flex: 1, fontSize: 13, color: theme.colors.text },
  cartItemPrice: { fontWeight: '700', color: theme.colors.text, marginRight: theme.spacing.sm },
  removeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(122, 21, 38, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
  },
  totalLabel: { ...theme.typography.bodyStrong, color: theme.colors.primaryDark },
  totalValue: { ...theme.typography.bodyStrong, color: theme.colors.primary, fontSize: 18 },

  sectionLabel: { ...theme.typography.bodyStrong, color: theme.colors.text, fontSize: 15, marginTop: theme.spacing.md },
  sectionHint: { ...theme.typography.caption, color: theme.colors.textMuted, marginBottom: theme.spacing.md },
  emptyPublished: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
  },
  emptyPublishedText: { ...theme.typography.body, color: theme.colors.textMuted },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardBody: { flex: 1, marginRight: theme.spacing.sm },
  cardTitle: { ...theme.typography.bodyStrong, color: theme.colors.text, fontSize: 14 },
  cardDescription: { ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2, lineHeight: 15 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: theme.spacing.xs },
  cardPrice: { fontWeight: '800', color: theme.colors.primary, fontSize: 14 },
  cardSeller: { ...theme.typography.caption, color: theme.colors.textMuted, fontSize: 11 },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.pill,
  },
  addBtnInCart: {
    backgroundColor: theme.colors.primarySoft,
  },
  addBtnText: { color: 'white', fontSize: 11, fontWeight: '800' },
  addBtnTextInCart: { color: theme.colors.primary },

  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  checkoutText: { ...theme.typography.bodyStrong, color: 'white', fontSize: 16 },
});
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { AppLogo } from '../../components/common/AppLogo';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { MenuCard } from '../../components/ui/MenuCard';
import { theme } from '../../config/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useAuthStore } from '../../store/useAuthStore';
import type { MenuOption } from '../../models/MenuOption';
import { MENU_OPTIONS } from '../../utils/constants';
import type { MainTabParamList } from '../../navigation/types';

// Tipamos la navegación para que TypeScript sepa a qué pantallas podemos ir
type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export function HomeScreen() {
  const { horizontalPadding, menuCardWidth } = useResponsiveLayout();
  const navigation = useNavigation<NavigationProp>();
  
  // Obtenemos el usuario y la función de logout directamente del store global
  const { user, logout } = useAuthStore();

  const firstName = user?.displayName?.split(' ')[0];
  const greetingName = firstName || user?.displayName || 'Invitado';

  const handleOptionPress = useCallback((option: MenuOption) => {
    // Usamos el título de la tarjeta para saber a dónde navegar
    if (option.title === 'Explorar catálogo') {
      navigation.navigate('Catalog');
    } else if (option.title === 'Para ti') {
      navigation.navigate('ForYou');
    } else if (option.title === 'Ver en mi espacio') {
      navigation.navigate('AR');
    }
  }, [navigation]);

  return (
    <ScreenContainer
      backgroundColor={theme.colors.primary}
      contentContainerStyle={styles.screenContent}
    >
      <StatusBar style="light" />

      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <AppLogo compact variant="light" />
        <Pressable
          accessibilityLabel="Cerrar sesión"
          accessibilityRole="button"
          onPress={logout} // Usamos la función logout del store
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutPressed,
          ]}
        >
          <Text style={styles.signOutText}>Salir</Text>
          <Feather color={theme.colors.cream} name="log-out" size={17} />
        </Pressable>
      </View>

      <View style={styles.mainSurface}>
        <View
          style={[
            styles.mainContent,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.greetingRow}>
            <View style={styles.greetingCopy}>
              <Text style={styles.eyebrow}>MENÚ PRINCIPAL</Text>
              <Text style={styles.greeting}>Hola, {greetingName}</Text>
              <Text style={styles.greetingSubtitle}>
                Imagina tu hogar y descubre lo que LOOka tendrá para ti.
              </Text>
            </View>
            <View accessibilityLabel="Perfil de usuario" style={styles.avatar}>
              <Feather color={theme.colors.primary} name="user" size={24} />
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroDecoration} />
            <Text style={styles.heroTitle}>Tu espacio, antes de comprar</Text>
            <View style={styles.heroFooter}>
              <View style={styles.heroIconStack}>
                <View style={[styles.stackIcon, styles.stackIconFront]}>
                  <Feather color={theme.colors.primary} name="camera" size={16} />
                </View>
                <View style={[styles.stackIcon, styles.stackIconBack]}>
                  <Feather color={theme.colors.brown} name="move" size={16} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionTitle}>Explora las opciones</Text>
              <Text style={styles.sectionSubtitle}>
                Selecciona la opción con la que quieres iniciar
              </Text>
            </View>
          </View>

          <View style={styles.menuGrid}>
            {MENU_OPTIONS.map((option) => (
              <MenuCard
                key={option.id}
                onPress={handleOptionPress}
                option={option}
                style={{ width: menuCardWidth }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: theme.layout.maxContentWidth,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    width: '100%',
  },
  signOutButton: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    minHeight: 42,
    paddingHorizontal: theme.spacing.md,
  },
  signOutPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  signOutText: {
    ...theme.typography.caption,
    color: theme.colors.cream,
    fontWeight: '700',
  },
  mainSurface: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    flexGrow: 1,
    overflow: 'hidden',
    width: '100%',
  },
  mainContent: {
    alignSelf: 'center',
    maxWidth: theme.layout.maxContentWidth,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.xl,
    width: '100%',
  },
  greetingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  greetingCopy: {
    flex: 1,
  },
  eyebrow: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xxs,
  },
  greeting: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  greetingSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xxs,
    maxWidth: 560,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.white,
    borderRadius: theme.radii.pill,
    borderWidth: 3,
    height: 54,
    justifyContent: 'center',
    width: 54,
    ...theme.shadows.subtle,
  },
  heroCard: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    padding: theme.spacing.lg,
    position: 'relative',
  },
  heroDecoration: {
    borderColor: 'rgba(247, 234, 214, 0.12)',
    borderRadius: theme.radii.pill,
    borderWidth: 28,
    height: 180,
    position: 'absolute',
    pointerEvents: 'none',
    right: -70,
    top: -70,
    width: 180,
  },
  heroTitle: {
    ...theme.typography.heading,
    color: theme.colors.white,
    maxWidth: 480,
  },
  heroFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  heroIconStack: {
    height: 34,
    width: 58,
  },
  stackIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.cream,
    borderColor: theme.colors.primaryDark,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    height: 34,
    justifyContent: 'center',
    position: 'absolute',
    width: 34,
  },
  stackIconFront: {
    left: 0,
    zIndex: 2,
  },
  stackIconBack: {
    right: 0,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  sectionSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
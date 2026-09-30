/**
 * @file ScreenContainer.tsx
 * @description Proporciona una estructura común para el contenido de las pantallas.
 * Integra áreas seguras, desplazamiento y estilos de página configurables.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../config/theme';

/** Propiedades de diseño y contenido del contenedor de pantalla. */
interface ScreenContainerProps {
  children: ReactNode;
  backgroundColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

/**
 * Renderiza el contenido de una pantalla dentro de un área segura.
 * @param props Propiedades del contenedor.
 * @param props.children Contenido que se mostrará dentro de la pantalla.
 * @param props.backgroundColor Color de fondo opcional del contenedor.
 * @param props.contentContainerStyle Estilos adicionales del contenido.
 * @param props.scrollable Indica si el contenido puede desplazarse verticalmente.
 * @returns Árbol de elementos React Native que envuelve el contenido.
 */
export function ScreenContainer({
  children,
  backgroundColor = theme.colors.background,
  contentContainerStyle,
  scrollable = true,
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
});

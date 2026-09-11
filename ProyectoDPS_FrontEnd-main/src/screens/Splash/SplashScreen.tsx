import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppLogo } from '../../components/common/AppLogo';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../config/theme';
import { appConfig } from '../../config/appConfig';
import type { RootStackParamList } from '../../navigation/types';

// Tipamos la navegación para esta pantalla
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Temporizador que dura lo configurado en appConfig (ej: 1800ms)
    const timer = setTimeout(() => {
      // 'replace' hace que el Splash se elimine del historial y no puedas volver a él
      navigation.replace('Login');
    }, appConfig.splashDurationMs);

    // Limpiamos el temporizador si el componente se desmonta antes de tiempo
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScreenContainer backgroundColor={theme.colors.primary}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <AppLogo variant="light" />
        </View>
        <Text style={styles.tagline}>{appConfig.tagline}</Text>
        <ActivityIndicator 
          color={theme.colors.cream} 
          size="large" 
          style={styles.loader} 
        />
        <Text style={styles.loadingText}>Preparando tu experiencia</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
  },
  tagline: {
    ...theme.typography.caption,
    color: theme.colors.cream,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  loader: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  loadingText: {
    ...theme.typography.caption,
    color: theme.colors.cream,
  },
});
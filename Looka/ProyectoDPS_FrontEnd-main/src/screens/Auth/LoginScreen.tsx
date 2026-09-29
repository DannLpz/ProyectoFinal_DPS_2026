import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppLogo } from '../../components/common/AppLogo';
import { theme } from '../../config/theme';
import { RealAuthService } from '../../services/RealAuthService';
import { useAuthStore } from '../../store/useAuthStore';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuthStore();

  // Autocompletado para el demo
  const [identifier, setIdentifier] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



// Y dentro de handleLogin:
const handleLogin = async () => {
  setIsLoading(true);
  setError('');
const authService = new RealAuthService();
  const result = await authService.authenticate({ identifier, password });

  if (result.success) {
    login(result.user, result.token);
    navigation.replace('MainTabs');
  } else {
    setError(result.message);
  }

  setIsLoading(false);
};

  // ... el resto de tu JSX y estilos se mantienen igual
  return (
    <ScreenContainer backgroundColor={theme.colors.background}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <AppLogo variant="dark" />
        </View>

        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Ingresa tus credenciales de prueba</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Usuario (ej: demo)"
          placeholderTextColor={theme.colors.textMuted}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña (ej: demo123)"
          placeholderTextColor={theme.colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: theme.spacing.lg, maxWidth: theme.layout.maxContentWidth, alignSelf: 'center', width: '100%' },
  logoContainer: { alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { ...theme.typography.heading, color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.xs },
  subtitle: { ...theme.typography.caption, color: theme.colors.textMuted, textAlign: 'center', marginBottom: theme.spacing.lg },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, padding: theme.spacing.md, color: theme.colors.text, backgroundColor: theme.colors.surface, marginBottom: theme.spacing.md },
  button: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center', marginTop: theme.spacing.sm },
  buttonPressed: { opacity: 0.8 },
  buttonText: { ...theme.typography.bodyStrong, color: theme.colors.white },
  errorText: { ...theme.typography.caption, color: 'red', textAlign: 'center', marginBottom: theme.spacing.md },
});
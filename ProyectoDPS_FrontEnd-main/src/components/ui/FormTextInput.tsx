import { Feather } from '@expo/vector-icons';
import { useState, type ComponentProps } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { theme } from '../../config/theme';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

interface FormTextInputProps
  extends Pick<
    TextInputProps,
    | 'autoCapitalize'
    | 'autoComplete'
    | 'keyboardType'
    | 'onSubmitEditing'
    | 'returnKeyType'
    | 'textContentType'
  > {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: FeatherIconName;
  error?: string;
  editable?: boolean;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export function FormTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  editable = true,
  isPassword = false,
  isPasswordVisible = false,
  onTogglePassword,
  ...textInputProps
}: FormTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputShell,
          isFocused && styles.inputShellFocused,
          error ? styles.inputShellError : null,
          !editable && styles.inputShellDisabled,
        ]}
      >
        <Feather
          color={isFocused ? theme.colors.primary : theme.colors.textMuted}
          name={icon}
          size={19}
        />
        <TextInput
          accessibilityLabel={label}
          autoCorrect={false}
          editable={editable}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={isPassword && !isPasswordVisible}
          selectionColor={theme.colors.primary}
          style={styles.input}
          value={value}
          {...textInputProps}
        />
        {isPassword && onTogglePassword ? (
          <Pressable
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            accessibilityRole="button"
            hitSlop={8}
            onPress={onTogglePassword}
            style={styles.passwordAction}
          >
            <Feather
              color={theme.colors.textMuted}
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '700',
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: theme.spacing.md,
  },
  inputShellFocused: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
  inputShellError: {
    borderColor: theme.colors.error,
  },
  inputShellDisabled: {
    opacity: 0.65,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    minHeight: 50,
    minWidth: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 0,
  },
  passwordAction: {
    alignItems: 'center',
    height: theme.layout.minTouchTarget,
    justifyContent: 'center',
    marginRight: -theme.spacing.sm,
    width: theme.layout.minTouchTarget,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
  },
});

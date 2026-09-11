import { Feather } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '../../config/theme';
import type { MenuOption } from '../../models/MenuOption';

interface MenuCardProps {
  option: MenuOption;
  onPress: (option: MenuOption) => void;
  style?: StyleProp<ViewStyle>;
}

export function MenuCard({ option, onPress, style }: MenuCardProps) {
  return (
    <Pressable
      accessibilityHint="Disponible en la siguiente fase"
      accessibilityLabel={option.title}
      accessibilityRole="button"
      onPress={() => onPress(option)}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${option.accentColor}18` },
        ]}
      >
        <Feather color={option.accentColor} name={option.icon} size={25} />
      </View>
      {option.technology ? (
        <View style={styles.technologyBadge}>
          <Text style={styles.technologyText}>{option.technology}</Text>
        </View>
      ) : null}
      <Text numberOfLines={2} style={styles.title}>
        {option.title}
      </Text>
      <Text numberOfLines={3} style={styles.description}>
        {option.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.previewText}>Vista previa</Text>
        <Feather color={theme.colors.textMuted} name="arrow-up-right" size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...theme.shadows.subtle,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    minHeight: 212,
    padding: theme.spacing.md,
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: theme.radii.md,
    height: 48,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    width: 48,
  },
  technologyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
  },
  technologyText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  title: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    flexGrow: 1,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  previewText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});

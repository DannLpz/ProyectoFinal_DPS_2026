import { Feather } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../config/theme';
import type { MenuOption } from '../../models/MenuOption';
import { PHASE_TWO_MESSAGE } from '../../utils/constants';
import { AppButton } from './AppButton';

interface PhasePreviewModalProps {
  option: MenuOption | null;
  onClose: () => void;
}

export function PhasePreviewModal({
  option,
  onClose,
}: PhasePreviewModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={Boolean(option)}
    >
      <View
        accessibilityViewIsModal
        style={styles.overlay}
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Feather color={theme.colors.primary} name="clock" size={26} />
          </View>
          <Text style={styles.overline}>VISTA PREVIA</Text>
          <Text style={styles.title}>{option?.title}</Text>
          <Text style={styles.message}>{PHASE_TWO_MESSAGE}</Text>
          <AppButton label="Entendido" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    ...theme.shadows.card,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.xl,
    maxWidth: 390,
    padding: theme.spacing.lg,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 58,
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    width: 58,
  },
  overline: {
    ...theme.typography.overline,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
});

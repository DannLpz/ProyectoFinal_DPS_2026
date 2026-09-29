import { StyleSheet, Text, View } from 'react-native';

import { appConfig } from '../../config/appConfig';
import { theme } from '../../config/theme';

interface AppLogoProps {
  compact?: boolean;
  variant?: 'dark' | 'light';
}

export function AppLogo({ compact = false, variant = 'dark' }: AppLogoProps) {
  const isLight = variant === 'light';

  return (
    <View
      accessibilityLabel={`${appConfig.name}, ${appConfig.tagline}`}
      accessibilityRole="image"
      style={[styles.container, compact && styles.compactContainer]}
    >
      <View
        style={[
          styles.mark,
          compact && styles.compactMark,
          isLight && styles.lightMark,
        ]}
      >
        <View style={[styles.sofaBack, compact && styles.compactSofaBack]} />
        <View style={[styles.sofaSeat, compact && styles.compactSofaSeat]} />
        <View style={[styles.leftArm, compact && styles.compactArm]} />
        <View style={[styles.rightArm, compact && styles.compactArm]} />
        <View style={[styles.leftCushion, compact && styles.compactCushion]} />
        <View style={[styles.rightCushion, compact && styles.compactCushion]} />
      </View>
      <Text
        style={[
          styles.wordmark,
          compact && styles.compactWordmark,
          isLight && styles.lightWordmark,
        ]}
      >
        {appConfig.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  compactContainer: {
    gap: theme.spacing.xs,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    height: 58,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: 66,
  },
  compactMark: {
    borderRadius: theme.radii.sm,
    height: 38,
    width: 43,
  },
  lightMark: {
    backgroundColor: theme.colors.cream,
  },
  sofaBack: {
    backgroundColor: theme.colors.cream,
    borderColor: theme.colors.text,
    borderRadius: 9,
    borderWidth: 2,
    height: 28,
    position: 'absolute',
    top: 13,
    width: 45,
  },
  compactSofaBack: {
    borderRadius: 6,
    borderWidth: 1.5,
    height: 19,
    top: 8,
    width: 30,
  },
  sofaSeat: {
    backgroundColor: theme.colors.creamDark,
    borderColor: theme.colors.text,
    borderRadius: 6,
    borderWidth: 2,
    bottom: 9,
    height: 13,
    position: 'absolute',
    width: 48,
  },
  compactSofaSeat: {
    borderRadius: 4,
    borderWidth: 1.5,
    bottom: 6,
    height: 9,
    width: 33,
  },
  leftArm: {
    backgroundColor: theme.colors.creamDark,
    borderColor: theme.colors.text,
    borderRadius: 5,
    borderWidth: 2,
    bottom: 9,
    height: 20,
    left: 7,
    position: 'absolute',
    width: 10,
  },
  rightArm: {
    backgroundColor: theme.colors.creamDark,
    borderColor: theme.colors.text,
    borderRadius: 5,
    borderWidth: 2,
    bottom: 9,
    height: 20,
    position: 'absolute',
    right: 7,
    width: 10,
  },
  compactArm: {
    borderRadius: 3,
    borderWidth: 1.5,
    bottom: 6,
    height: 14,
    width: 7,
  },
  leftCushion: {
    backgroundColor: theme.colors.cream,
    borderColor: theme.colors.text,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 18,
    left: 15,
    position: 'absolute',
    top: 16,
    transform: [{ rotate: '-5deg' }],
    width: 16,
  },
  rightCushion: {
    backgroundColor: theme.colors.cream,
    borderColor: theme.colors.text,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 18,
    position: 'absolute',
    right: 15,
    top: 16,
    transform: [{ rotate: '5deg' }],
    width: 16,
  },
  compactCushion: {
    borderRadius: 3,
    borderWidth: 1,
    height: 12,
    top: 10,
    width: 10,
  },
  wordmark: {
    color: theme.colors.text,
    fontFamily: 'serif',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -2,
  },
  compactWordmark: {
    fontSize: 25,
    letterSpacing: -1.2,
  },
  lightWordmark: {
    color: theme.colors.white,
  },
});

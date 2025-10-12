import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const StepIndicator = ({ steps, currentStep = 0 }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                index <= currentStep && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  index <= currentStep && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  index < currentStep && styles.connectorActive,
                ]}
              />
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              index <= currentStep && styles.stepLabelActive,
            ]}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepNumberActive: {
    color: COLORS.surface,
  },
  connector: {
    position: 'absolute',
    top: 16,
    left: 32,
    right: -32,
    height: 2,
    backgroundColor: COLORS.border,
  },
  connectorActive: {
    backgroundColor: COLORS.primary,
  },
  stepLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xs,
  },
  stepLabelActive: {
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default StepIndicator;

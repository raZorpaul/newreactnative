import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

const SecureConnection = () => {
  const pillColors = {
    almostWhite: '#FDF2F8',
    lightPink: '#F8BBD9',
    purple: '#8B5CF6'
  };

  const pill1Anim = useRef(new Animated.Value(-60)).current; // starts off-screen left
  const pill2Anim = useRef(new Animated.Value(-60)).current; // starts off-screen left
  const pill3Anim = useRef(new Animated.Value(-60)).current; // starts off-screen left
  const pill1Opacity = useRef(new Animated.Value(0)).current; // starts transparent
  const pill2Opacity = useRef(new Animated.Value(0)).current; // starts transparent
  const pill3Opacity = useRef(new Animated.Value(0)).current; // starts transparent

  useEffect(() => {
    const cycle = () => {
      // Reset positions and opacity
      pill1Anim.setValue(-60); // start from left edge of container
      pill2Anim.setValue(-60);
      pill3Anim.setValue(-60);
      pill1Opacity.setValue(0);
      pill2Opacity.setValue(0);
      pill3Opacity.setValue(0);

      // First pill slides across with fade in effect
      Animated.parallel([
        Animated.timing(pill1Anim, {
          toValue: 60, // slide to right edge
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pill1Opacity, {
          toValue: 1, // fade from transparent to opaque
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ]).start();

      // Second pill starts sliding while first is still moving
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(pill2Anim, {
            toValue: 60, // slide to right edge
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pill2Opacity, {
            toValue: 1, // fade from transparent to opaque
            duration: 900,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          })
        ]).start();
      }, 200);

      // Third pill starts sliding for continuous flow
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(pill3Anim, {
            toValue: 60, // slide to right edge
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pill3Opacity, {
            toValue: 1, // fade from transparent to opaque
            duration: 900,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          })
        ]).start(() => {
          // Repeat cycle
          setTimeout(cycle, 100); // brief pause before next cycle
        });
      }, 400);
    };

    cycle();
  }, [pill1Anim, pill2Anim, pill3Anim, pill1Opacity, pill2Opacity, pill3Opacity]);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        {/* First pill - Purple */}
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: pillColors.purple,
              opacity: pill1Opacity,
              transform: [{ translateX: pill1Anim }],
              position: "absolute",
              zIndex: 1,
            },
          ]}
        />

        {/* Second pill - Light Pink */}
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: pillColors.lightPink,
              opacity: pill2Opacity,
              transform: [{ translateX: pill2Anim }],
              position: "absolute",
              zIndex: 2,
            },
          ]}
        />

        {/* Third pill - Almost White */}
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: pillColors.almostWhite,
              opacity: pill3Opacity,
              transform: [{ translateX: pill3Anim }],
              position: "absolute",
              zIndex: 3,
            },
          ]}
        />
      </View>
      <Text style={styles.text}>Connecting Securely</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // black background like first image
  },
  loaderContainer: {
    width: 60, // reduced width to show only right half
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
    alignItems: "flex-start", // align to left edge
    justifyContent: "center",
  },
  pill: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // white text on black background
  },
});

export default SecureConnection;
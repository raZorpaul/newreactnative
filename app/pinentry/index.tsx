import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Keypad from "../Keypad";

const PinEntry = () => {
  const { name, email, amount } = useLocalSearchParams();
  const [pin, setPin] = useState('');
  const pinLength = 6;

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      setPin((prevPin) => prevPin.slice(0, -1));
    } else if (key === '₹') {
      // Do nothing, as '₹' is just a display symbol on the keypad
      return;
    } else if (pin.length < pinLength && !isNaN(Number(key))) {
      setPin((prevPin) => prevPin + key);
    }
  };

  const handleSubmit = () => {
    if (pin.length === pinLength) {
      alert(`Submitting PIN: ${pin} for amount ₹${amount} to ${name}`);
      // Here you would typically integrate with a payment gateway
      router.back(); // Navigate back after submission for now
    } else {
      alert('Please enter a 6-digit PIN.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CANCEL</Text>
      </View>

      <View style={styles.paymentDetailsContainer}>
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>Punjab National Bank</Text>
          <Text style={styles.accountNumber}>XXXX0502</Text>
        </View>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/UPI-Logo-Vector.svg/1280px-UPI-Logo-Vector.svg.png' }} style={styles.upiLogo} />
      </View>

      <View style={styles.recipientInfoContainer}>
        <Text style={styles.toText}>To:</Text>
        <Text style={styles.recipientName}>{name}</Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#bbbbbb" />
      </View>

      <View style={styles.sendingInfoContainer}>
        <Text style={styles.sendingText}>Sending:</Text>
        <Text style={styles.sendingAmount}>₹{amount}</Text>
      </View>

      <Text style={styles.pinEntryTitle}>ENTER 6-DIGIT UPI PIN</Text>
      <View style={styles.pinInputContainer}>
        {[...Array(pinLength)].map((_, index) => (
          <View key={index} style={[styles.pinDot, pin.length > index && styles.pinDotFilled]} />
        ))}
      </View>

      <View style={styles.alertContainer}>
        <MaterialCommunityIcons name="information" size={20} color="#FFA500" />
        <Text style={styles.alertText}>
          You are SENDING <Text style={{ fontWeight: 'bold' }}>₹{amount}</Text> from your account to
          <Text style={{ fontWeight: 'bold' }}> {name}</Text>
        </Text>
      </View>

      <View style={styles.keypadContainer}>
        <Keypad onKeyPress={handleKeyPress} />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.bottomButtonX} onPress={() => setPin('')}>
          <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButtonSubmit} onPress={handleSubmit}>
          <Text style={styles.bottomButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1, // Ensures title takes available space
  },
  paymentDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  bankInfo: {
    // Styles for bank name and account number
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  accountNumber: {
    fontSize: 14,
    color: '#555555',
  },
  upiLogo: {
    width: 60,
    height: 30,
    resizeMode: 'contain',
  },
  recipientInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  toText: {
    fontSize: 14,
    color: '#555555',
    marginRight: 5,
  },
  recipientName: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    flex: 1,
  },
  sendingInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sendingText: {
    fontSize: 14,
    color: '#555555',
    marginRight: 5,
  },
  sendingAmount: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  pinEntryTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#bbbbbb',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: '#000000',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFACD', // Light orange/yellow background
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  alertText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  keypadContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  bottomButtonX: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    marginRight: 10,
  },
  bottomButtonSubmit: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200EE',
    borderRadius: 8,
  },
  bottomButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PinEntry;

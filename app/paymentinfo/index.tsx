import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Keypad from "../Keypad";

const PaymentInfo = () => {
  const { name, email } = useLocalSearchParams();
  const [amount, setAmount] = useState("");
  const cursorOpacity = useState(new Animated.Value(0))[0];
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For the Proceed to Pay button
  const [isPaying, setIsPaying] = useState(false); // For the Pay ₹X button in modal

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [cursorOpacity]);

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      setAmount((prevAmount) => prevAmount.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount((prevAmount) => prevAmount + key);
      }
    } else {
      setAmount((prevAmount) => prevAmount + key);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>MM</Text>
        </View>
        <View>
          <Text style={styles.name}>Mr {name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <View style={styles.amountInputContainer}>
        <Text style={styles.currencySymbol}>₹</Text>
        {amount.length === 0 ? (
          <View style={styles.amountInputInner}>
            <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
            <Text style={styles.placeholderText}>Enter Amount</Text>
          </View>
        ) : (
          <View style={styles.amountInputInner}>
            <Text style={styles.amountText}>{amount}</Text>
            <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
          </View>
        )}
      </View>
      <TextInput
        style={styles.messageInput}
        placeholder="Add a message(optional)"
        placeholderTextColor="#bbbbbb"
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.proceedButton} onPress={() => setPaymentModalVisible(true)}>
          <Text style={styles.proceedButtonText}>PROCEED TO PAY</Text>
        </TouchableOpacity>
        <Keypad onKeyPress={handleKeyPress} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={() => {
          setPaymentModalVisible(false);
          setIsPaying(false); // Reset isPaying when modal is closed
        }}
      >
        <View style={styles.paymentModalContainer}>
          <View style={styles.paymentModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Total payable</Text>
              <View style={styles.modalHeaderAmountWrapper}>
                <Text style={styles.totalAmountTextBig}>₹{amount.length > 0 ? amount : '0'}</Text>
                {/* <MaterialCommunityIcons name="close" size={24} color="#bbbbbb" style={styles.removeAmountIcon} /> */}
              </View>
              <TouchableOpacity onPress={() => {
                setPaymentModalVisible(false);
                setIsPaying(false); // Reset isPaying when modal is closed
              }} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.recommendedSection}>
              <Text style={styles.recommendedText}>Recommended</Text>
              <View style={styles.bankAccountContainer}>
                <View style={styles.bankInfo}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Punjab_National_Bank_Logo.svg/1200px-Punjab_National_Bank_Logo.svg.png' }} style={styles.bankLogo} />
                  <View>
                    <Text style={styles.bankName}>Punjab National Bank</Text>
                    <Text style={styles.accountNumber}>•• 0502 UPI</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.totalAmountText}>₹{amount.length > 0 ? amount : '0'}</Text>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#00ff00" style={{ marginLeft: 10 }} />
                </View>
              </View>
            </View>

            <View style={styles.addPaymentMethodContainer}>
              <View style={styles.bankInfo}>
                <MaterialCommunityIcons name="bank-plus" size={24} color="#ffffff" style={styles.addBankAccountIcon} />
                <Text style={styles.addBankAccountText}>Add bank accounts</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#bbbbbb" />
            </View>

            <View style={styles.payButtonContainer}>
              {isPaying ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => {
                    setIsPaying(true);
                    setTimeout(() => {
                      router.push({
                        pathname: "/pinentry",
                        params: { name: name as string, email: email as string, amount: amount },
                      });
                      setPaymentModalVisible(false); // Ensure modal is dismissed after navigation
                      setIsPaying(false); // Reset paying state after navigation
                    }, 3000); // 3-second delay
                  }}
                  disabled={isPaying}
                >
                  <Text style={styles.payButtonText}>PAY ₹{amount.length > 0 ? amount : '0'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1c1c1c",
    // borderRadius: 10,
    // margin: 12,k
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end", // Pushes content to the bottom
    borderColor: "red",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6200EE", // Example color, can be customized
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  email: {
    fontSize: 15,
    color: "#bbbbbb",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 20,
    color: "#ffffff",
    marginRight: 8,
  },
  amountDisplayWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  amountText: {
    fontSize: 20,
    color: "#ffffff",
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: '#ffffff',
    marginLeft: 2,
  },
  messageInput: {
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 24,
  },
  proceedButton: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 72,
  },
  proceedButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  paymentModalContent: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  totalPayableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  totalPayableText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmountTextBig: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  /* total amount text small */
  totalAmountText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeAmountIcon: {
    marginLeft: 10,
  },
  recommendedSection: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  recommendedText: {
    color: '#bbbbbb',
    fontSize: 16,
    marginBottom: 10,
  },
  bankAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    padding: 15,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  bankName: {
    color: '#ffffff',
    fontSize: 16,
  },
  accountNumber: {
    color: '#bbbbbb',
    fontSize: 14,
  },
  upiLogo: {
    width: 40,
    height: 20,
    marginLeft: 10,
  },
  checkIcon: {
    color: '#00ff00',
    fontSize: 20,
  },
  addPaymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  addBankAccountText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
  },
  addBankAccountIcon: {
    color: '#ffffff',
    fontSize: 20,
  },
  payButtonContainer: {
    paddingTop: 15,
  },
  payButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountInputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  placeholderText: {
    fontSize: 20,
    color: "#bbbbbb", // Placeholder color
  },
  modalHeaderAmountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // This wrapper will take remaining space and push close button to the right
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
});

export default PaymentInfo;

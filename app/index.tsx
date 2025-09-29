import { Camera, CameraView } from 'expo-camera';
import { router } from 'expo-router';

import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false); // New state to prevent multiple scans

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleImageClick = () => {
    setScanned(false); // Reset scanned state when opening scanner
    setScannerVisible(true);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannerVisible(false);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (data.startsWith('upi://pay')) {
      // Parse UPI parameters (pa, pn, am, etc.)
      const params = new URLSearchParams(data.split('?')[1]);
      const payeeAddress = params.get('pa');
      const payeeName = params.get('pn');
      const amount = params.get('am');
  
      console.log('Payee Address:', payeeAddress);
      console.log('Payee Name:', payeeName);
      console.log('Amount:', amount);

      router.replace({
        pathname: "/paymentinfo",
        params: { name: payeeName ?? '', email: payeeAddress ?? '' },
      });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={styles.container}
    >
      <TouchableOpacity onPress={handleImageClick}>
        <Image source={require("../images/icon.png")} style={styles.icon} />
      </TouchableOpacity>

      <Modal
        visible={isScannerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setScannerVisible(false);
          setScanned(false); // Reset scanned state when modal is closed
        }}
      >
        <View style={styles.modalContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128'],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <Text style={styles.centerText}>
              Scan the QR code
            </Text>
            <TouchableOpacity style={styles.buttonTouchable} onPress={() => setScannerVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: "#fff",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
});

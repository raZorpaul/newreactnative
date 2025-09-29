import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface KeypadProps {
  onKeyPress: (value: string) => void;
}

const Keypad = ({ onKeyPress }: KeypadProps) => {
  const keys = [
    [{ main: '1', sub: '' }, { main: '2', sub: 'ABC' }, { main: '3', sub: 'DEF' }],
    [{ main: '4', sub: 'GHI' }, { main: '5', sub: 'JKL' }, { main: '6', sub: 'MNO' }],
    [{ main: '7', sub: 'PQRS' }, { main: '8', sub: 'TUV' }, { main: '9', sub: 'WXYZ' }],
    [ { main: '.', sub: '' }, { main: '0', sub: '' }, { main: '⌫', sub: '' }], // Empty button for the first item
  ];

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => (
            <TouchableOpacity
              key={key.main + keyIndex} // Added keyIndex to ensure unique key for empty string
              style={[styles.keyButton, key.main === '' && styles.emptyKeyButton]}
              onPress={() => onKeyPress(key.main)}
              disabled={key.main === ''} // Disable the empty key
            >
              {key.main === '⌫' ? (
                <View style={styles.backspaceButtonContent}>
                  <Text style={styles.backspaceText}>✕</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.keyText}>{key.main}</Text>
                  {key.sub ? <Text style={styles.subText}>{key.sub}</Text> : null}
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#2e2e2e', // Darker background for the keypad area
    paddingVertical: 10,
    paddingHorizontal: 5, // Add horizontal padding to the container
    borderTopWidth: 1,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed back to space-around for better distribution
    marginBottom: 10,
  },
  keyButton: {
    width: 95, // Slightly adjusted width for better spacing
    // width: 'max-content',
    // height: 55, // Slightly adjusted height
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#4a4a4a', // Grey background for buttons
  },
  emptyKeyButton: {
    backgroundColor: 'transparent',
  },
  keyText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subText: {
    color: '#ffffff',
    fontSize: 9,
  },
  backspaceButtonContent: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5,
  },
  backspaceText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default Keypad;

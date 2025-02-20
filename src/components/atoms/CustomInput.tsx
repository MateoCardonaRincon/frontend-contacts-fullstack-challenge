import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const CustomInput = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: 'center',
    marginHorizontal: 2,
    marginBlock: 4,
    borderRadius: 8,
    display: 'flex',
    borderColor: '#333652',
    borderWidth: 0.8,
  },
  text: {
    fontSize: 18,
  },
});

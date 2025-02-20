import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  text: string;
  size?: number;
}
export const Title = ({ text, size = 30 }: Props) => {
  styles = { ...styles, text: { ...styles.text, fontSize: size } };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

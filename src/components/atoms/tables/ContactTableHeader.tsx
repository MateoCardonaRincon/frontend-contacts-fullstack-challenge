import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  columns: string[];
}
export const ContactTableHeader = ({ columns }: Props) => {
  return (
    <View style={styles.container}>
      {columns.map(col => (
        <View key={col} style={styles.cellContainer}>
          <Text style={styles.text}>{col}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cellContainer: {
    backgroundColor: '#333652',
    paddingHorizontal: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#e9eaec',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    color: '#e9eaec',
  },
});

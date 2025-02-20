import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Contact } from '../../../redux/data';

interface Props {
  cells: Contact;
}
export const ContactTableRow = ({ cells }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{cells.id}</Text>
      <Text style={styles.text}>{cells.name}</Text>
      <Text style={styles.text}>{cells.phoneNumber}</Text>
      <Text style={styles.text}>{cells.email}</Text>
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
    backgroundColor: '#90adc6',
    paddingHorizontal: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#e9eaec',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
  },
});

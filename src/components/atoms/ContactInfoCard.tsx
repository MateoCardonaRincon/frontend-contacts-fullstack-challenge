import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Contact } from '../../redux/data';

interface Props {
  contact: Contact;
}
export const ContactInfoCard = ({ contact }: Props) => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>{`ID: ${contact.id}`}</Text> */}
      <Text style={styles.text}>{`Nombre: ${contact.name}`}</Text>
      <Text style={styles.text}>{`Teléfono: ${contact.phoneNumber}`}</Text>
      <Text style={styles.text}>{`Correo electrónico: ${contact.email}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#90adc6',
    padding: 10,
    margin: 2,
    borderRadius: 10,
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
    fontSize: 18,
    padding: 2,
  },
});

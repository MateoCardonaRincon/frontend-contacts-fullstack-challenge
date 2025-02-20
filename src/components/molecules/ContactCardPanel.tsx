import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ContactInfoCard } from '../atoms/ContactInfoCard';
import { contactsData } from '../../redux/data';
import { RegularLabel } from '../atoms/labels/RegularLabel';

export const ContactCardPanel = () => {
  return (
    <View style={styles.container}>
      <RegularLabel text={'Mis contactos'} size={24} />
      {contactsData.length > 0 ? (
        <ScrollView>
          {contactsData.map(contact => (
            <ContactInfoCard key={contact.id} contact={contact} />
          ))}
        </ScrollView>
      ) : (
        <RegularLabel text={'No hay contactos para mostrar'} size={18}/>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 330,
  },
});

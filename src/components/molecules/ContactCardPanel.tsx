import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ContactInfoCard } from '../atoms/ContactInfoCard';
import { RegularLabel } from '../atoms/labels/RegularLabel';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useState } from 'react';

export const ContactCardPanel = ({ navigation }: any) => {
  const { contacts, currentPhone } = useSelector(
    (state: RootState) => state.contacts,
  );
  const [phonesFilter, onChangePhonesFilter] = useState(contacts);
  useEffect(() => {
    if (currentPhone.length === 0) {
      onChangePhonesFilter(contacts);
    } else {
      const phones = contacts.filter(contact =>
        contact.cellphone.includes(currentPhone),
      );
      onChangePhonesFilter(phones);
    }
  }, [contacts, currentPhone]);

  return (
    <View style={styles.container}>
      <RegularLabel text={`Mis contactos (${contacts.length})`} size={24} />
      {contacts.length > 0 ? (
        <ScrollView>
          {phonesFilter.map(contact => (
            <ContactInfoCard
              key={contact.id}
              contact={contact}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      ) : (
        <RegularLabel text={'No hay contactos para mostrar'} size={18} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 330,
  },
});

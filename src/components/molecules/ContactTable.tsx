import React from 'react';
import { View } from 'react-native';
import { ContactTableHeader } from '../atoms/tables/ContactTableHeader';
import { ContactTableRow } from '../atoms/tables/ContactTableRow';
import { contactsData } from '../../redux/data';

export const ContactTable = () => {
  const columns = ['ID', 'Nombre', 'Teléfono', 'Correo'];
  return (
    <View>
      <ContactTableHeader columns={columns} />
      {contactsData.map(contact => (
        <ContactTableRow key={contact.id} cells={contact} />
      ))}
    </View>
  );
};

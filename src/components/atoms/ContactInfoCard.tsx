import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Contact } from '../../redux/types/contactsTypes';
import { RegularButtom } from './buttons/RegularButtom';
import { APP_COLORS } from '../../constants/styles';
import { useDispatch } from 'react-redux';
import {
  deleteContact,
  setCurrentPhone,
} from '../../redux/slices/contactsSlice';
import { ContactsService } from '../../services/contacts.service';

interface Props {
  contact: Contact;
  navigation: any;
}
export const ContactInfoCard = (props: Props) => {
  const dispatch = useDispatch();
  const contactsService = ContactsService();

  const onDelete = async () => {
    const deleteContactResponse = await contactsService.deleteContact(
      props.contact.id,
    );
    if (deleteContactResponse?.id) {
      dispatch(
        deleteContact({
          contactId: props.contact.id,
        }),
      );
      Alert.alert('¡Contacto eliminado!');
    } else {
      Alert.alert('Ocurrió un error eliminando el contacto');
    }
  };
  const onUpdate = async () => {
    dispatch(
      setCurrentPhone({
        currentPhone: props.contact.cellphone,
        currentContactId: props.contact.id,
      }),
    );
    props.navigation.navigate('UpdateContactScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Nombre: ${props.contact.name}`}</Text>
      <Text style={styles.text}>{`Teléfono: ${props.contact.cellphone}`}</Text>
      {props.contact.email?.length !== 0 && (
        <Text
          style={
            styles.text
          }>{`Correo electrónico: ${props.contact.email}`}</Text>
      )}
      <View style={styles.cardButtonsContainer}>
        <RegularButtom
          text="Eliminar"
          color={APP_COLORS.secondaryButton}
          action={onDelete}
        />
        <RegularButtom
          text="Actualizar"
          color={APP_COLORS.mainButton}
          action={onUpdate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.cardBackground,
    padding: 10,
    margin: 2,
    borderRadius: 10,
  },
  cellContainer: {
    backgroundColor: APP_COLORS.cardBackground,
    paddingHorizontal: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: APP_COLORS.background,
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
    padding: 2,
  },
  cardButtonsContainer: {
    flexDirection: 'row',
  },
});

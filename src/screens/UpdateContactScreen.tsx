/* eslint-disable react/react-in-jsx-scope */
import { Alert, StyleSheet, View } from 'react-native';
import { Title } from '../components/atoms/labels/Title';
import { useState } from 'react';
import { InputGroup } from '../components/molecules/InputGroup';
import { RegularButtom } from '../components/atoms/buttons/RegularButtom';
import { APP_COLORS } from '../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UpdateContactRequest } from '../services/dtos/contacts.dto';
import { ContactsService } from '../services/contacts.service';
import { Contact } from '../redux/types/contactsTypes';
import { setCurrentPhone, updateContact } from '../redux/slices/contactsSlice';

export const UpdateContactScreen = ({ navigation }: any) => {
  const { contacts, currentContactId } = useSelector(
    (state: RootState) => state.contacts,
  );
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [phone, onChangePhone] = useState('');

  const dispatch = useDispatch();

  const updateContactBody: UpdateContactRequest = {
    email: email,
    name: name,
    cellphone: phone,
  };
  const contactsService = ContactsService();
  const onUpdate = async () => {
    if (!/^\d+$/.test(phone) && phone.length > 0) {
      Alert.alert('El número de teléfono debe ser numérico');
      return;
    }
    const phoneExist = contacts.find(contact => contact.cellphone === phone);
    if (phoneExist) {
      Alert.alert('El número de teléfono ya está registrado');
      return;
    }
    if (name.length < 2) {
      Alert.alert('El nombre debe tener al menos 2 caracteres');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) && email.length > 0) {
      Alert.alert('El email no tiene un formato válido');
      return;
    }
    const updateContactResponse = await contactsService.updateContact(
      updateContactBody,
      currentContactId,
    );
    if (updateContactResponse?.id) {
      const updatedContact: Contact = {
        id: updateContactResponse.id,
        name: updateContactResponse.name,
        cellphone: updateContactResponse.cellphone,
        created_at: updateContactResponse.created_at,
        is_favorite: false,
        user_id: updateContactResponse.user_id,
      };
      dispatch(updateContact({ contactToUpdate: updatedContact }));
      navigation.navigate('MenuScreen');
    } else {
      Alert.alert('Ocurrió un error guardando el contacto');
    }
  };

  const onReturn = async () => {
    dispatch(setCurrentPhone({ currentPhone: '' }));
    navigation.navigate('MenuScreen');
  };

  return (
    <View style={styles.container}>
      <Title text={'¡Actualiza tu contacto!'} />
      <InputGroup text={'Celular: '} inputAction={onChangePhone} />
      <InputGroup text={'Nombre: '} inputAction={onChangeName} />
      <InputGroup
        text={'Correo electrónico (opcional): '}
        inputAction={onChangeEmail}
      />
      <View style={styles.buttonsContainer}>
        <RegularButtom
          text="Volver"
          color={APP_COLORS.secondaryButton}
          action={onReturn}
          testID="regular-button-Volver"
        />
        <RegularButtom
          text="Actualizar"
          color={APP_COLORS.actionButton}
          action={onUpdate}
          testID="regular-button-Actualizar"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});

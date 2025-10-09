/* eslint-disable react/react-in-jsx-scope */
import { Alert, StyleSheet, View } from 'react-native';
import { Title } from '../components/atoms/labels/Title';
import { useState } from 'react';
import { InputGroup } from '../components/molecules/InputGroup';
import { RegularButtom } from '../components/atoms/buttons/RegularButtom';
import { APP_COLORS } from '../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CreateContactRequest } from '../services/dtos/contacts.dto';
import { ContactsService } from '../services/contacts.service';
import { Contact } from '../redux/types/contactsTypes';
import { addContact, setCurrentPhone } from '../redux/slices/contactsSlice';

export const CreateContactScreen = ({ navigation }: any) => {
  const { currentPhone } = useSelector((state: RootState) => state.contacts);
  const userId = useSelector((state: RootState) => state.authentication.userId);
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');

  const dispatch = useDispatch();

  const createContactBody: CreateContactRequest = {
    email: email,
    name: name,
    cellphone: currentPhone,
    user_id: userId,
    is_favorite: false,
  };
  const contactsService = ContactsService();
  const onSave = async () => {
    if (name.length < 2) {
      Alert.alert('El nombre debe tener al menos 2 caracteres');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) && email.length > 0) {
      Alert.alert('El email no tiene un formato válido');
      return;
    }
    const createContactResponse = await contactsService.saveContact(
      createContactBody,
    );
    if (createContactResponse?.id) {
      const newContact: Contact = {
        id: createContactResponse.id,
        name: createContactResponse.name,
        cellphone: createContactResponse.cellphone,
        created_at: createContactResponse.created_at,
        is_favorite: false,
        user_id: createContactResponse.user_id,
      };
      const updateContactList = {
        newContact,
        currentPhone: '',
      };
      dispatch(addContact(updateContactList));
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
      <Title text={`¡Guarda tu contacto: ${currentPhone}!`} />
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
          text="Guardar"
          color={APP_COLORS.actionButton}
          action={onSave}
          testID="regular-button-Guardar"
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

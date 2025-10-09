/* eslint-disable react/react-in-jsx-scope */
import { StyleSheet, View, Alert, Dimensions } from 'react-native';
import { ContactsForm } from '../components/organisms/ContactsForm';
import { ContactCardPanel } from '../components/molecules/ContactCardPanel';
import { Title } from '../components/atoms/labels/Title';
import { RegularButtom } from '../components/atoms/buttons/RegularButtom';
import { APP_COLORS } from '../constants/styles';
import { useEffect, useState } from 'react';
import { ContactsService } from '../services/contacts.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  cleanContacts,
  loadContacts,
  setCurrentPhone,
} from '../redux/slices/contactsSlice';

export const MenuScreen = ({ navigation }: any) => {
  const [currentPhone, onChangeCurrentPhone] = useState('');

  const onLogout = async () => {
    navigation.navigate('LoginScreen');
    dispatch(cleanContacts());
  };

  const dispatch = useDispatch();
  const authentication = useSelector(
    (state: RootState) => state.authentication,
  );
  const contactsService = ContactsService();
  useEffect(() => {
    if (authentication.isAuth) {
      contactsService
        .getContacts(authentication.userId)
        .then(contacts => {
          dispatch(loadContacts(contacts));
        })
        .catch(() => {
          Alert.alert('Error al cargar los contactos');
        });
    }
  });

  useEffect(() => {
    dispatch(setCurrentPhone({ currentPhone: currentPhone }));
  }, [currentPhone, dispatch]);

  return (
    <View style={styles.container}>
      <Title text={`¡Hola ${authentication.name}!`} />
      <ContactsForm
        inputAction={onChangeCurrentPhone}
        navigation={navigation}
      />
      <ContactCardPanel navigation={navigation} />
      <View style={styles.closeSessionButtonContainer}>
        <RegularButtom
          text="Cerrar sesión"
          color={APP_COLORS.secondaryButton}
          action={onLogout}
          testID="logout-button"
        />
      </View>
    </View>
  );
};

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    padding: 10,
  },
  closeSessionButtonContainer: {
    width: window.width,
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

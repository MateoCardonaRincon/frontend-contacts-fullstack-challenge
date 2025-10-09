import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { RegularButtom } from '../atoms/buttons/RegularButtom';
import { APP_COLORS } from '../../constants/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const MainMenuButtonsGroup = ({ navigation }: any) => {
  const { contacts, currentPhone } = useSelector(
    (state: RootState) => state.contacts,
  );

  const onCreate = async () => {
    if (!/^\d+$/.test(currentPhone)) {
      Alert.alert('El número de teléfono debe ser numérico');
      return;
    }
    const phoneExist = contacts.find(
      contact => contact.cellphone === currentPhone,
    );
    if (phoneExist) {
      Alert.alert('El número de teléfono ya está registrado');
      return;
    }
    navigation.navigate('CreateContactScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <RegularButtom
          text="Crear"
          color={APP_COLORS.actionButton}
          action={onCreate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

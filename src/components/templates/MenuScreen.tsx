/* eslint-disable react/react-in-jsx-scope */
import { StyleSheet, View } from 'react-native';
import { ContactsForm } from '../organisms/ContactsForm';
import { ContactCardPanel } from '../molecules/ContactCardPanel';
import { Title } from '../atoms/labels/Title';
import { getEnv } from '../../utils/getEnv';

export const MenuScreen = () => {
  return (
    <View style={styles.container}>
      <Title text={'Menú de contactos: ' + `${getEnv().TEST_VAR}`} />
      <ContactsForm />
      <ContactCardPanel />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EAEC',
    justifyContent: 'space-around',
  },
});

import React from 'react';
import { View } from 'react-native';
import { InputGroup } from '../molecules/InputGroup';
import { MainMenuButtonsGroup } from '../molecules/MainMenuButtonsGroup';

interface Props {
  inputAction: (text: string) => void;
  navigation: any;
}
export const ContactsForm = (props: Props) => {
  return (
    <View>
      <InputGroup
        text={'Ingrese el número del contacto: '}
        inputAction={props.inputAction}
      />
      <MainMenuButtonsGroup navigation={props.navigation} />
    </View>
  );
};

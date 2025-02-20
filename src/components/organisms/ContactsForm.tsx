import React from 'react';
import { View } from 'react-native';
import { InputGroup } from '../molecules/InputGroup';
import { MainMenuButtonsGroup } from '../molecules/MainMenuButtonsGroup';

export const ContactsForm = () => {
  return (
    <View>
      <InputGroup />
      <MainMenuButtonsGroup />
    </View>
  );
};

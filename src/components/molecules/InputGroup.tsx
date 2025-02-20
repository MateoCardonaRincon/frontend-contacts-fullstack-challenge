import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RegularLabel } from '../atoms/labels/RegularLabel';
import { CustomInput } from '../atoms/CustomInput';

export const InputGroup = () => {
  return (
    <View style={styles.container}>
      <RegularLabel text="Ingrese un teléfono del contacto:" />
      <CustomInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    padding: 10,
    // flexDirection: 'column',
  },
});

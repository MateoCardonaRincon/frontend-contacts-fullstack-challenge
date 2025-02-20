import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RegularButtom } from '../atoms/buttons/RegularButtom';

export const MainMenuButtonsGroup = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <RegularButtom text="Crear" color="#FAD02C" />
      </View>
      <View style={styles.row}>
        <RegularButtom text="Editar" color="#FAD02C" />
      </View>
      <View style={styles.row}>
        <RegularButtom text="Eliminar" color="#90adc6" />
        <RegularButtom text="Buscar" color="#333652" />
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

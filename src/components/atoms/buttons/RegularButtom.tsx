import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

interface Props {
  text: string;
  color: string
}

export const RegularButtom = (props: Props) => {
  return (
    <View style={styles.container}>
      <Button
        title={props.text}
        color={props.color}
        onPress={() => Alert.alert('Estamos trabajando en esta funcionalidad')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 2,
    marginBlock: 2,
    borderRadius: 5,
    display: 'flex',
  },
  title: {
    textAlign: 'center',
    color: '#333652',
    fontSize: 24,
  },
});

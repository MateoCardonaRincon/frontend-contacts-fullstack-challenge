import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { APP_COLORS } from '../../constants/styles';

interface Props {
  action: (text: string) => void;
  isSensitive: boolean;
}
export const CustomInput = (props: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        testID="custom-input"
        style={styles.text}
        onChangeText={props.action}
        secureTextEntry={props.isSensitive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: 'center',
    marginHorizontal: 2,
    marginBlock: 4,
    borderRadius: 8,
    display: 'flex',
    borderColor: APP_COLORS.mainButton,
    borderWidth: 0.8,
  },
  text: {
    fontSize: 18,
  },
});

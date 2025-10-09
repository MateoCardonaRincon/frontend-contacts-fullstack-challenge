import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { BUTTON_STYLES } from '../../../constants/styles';

interface Props {
  text: string;
  color: string;
  action: () => void;
  testID?: string;
}

export const RegularButtom = (props: Props) => {
  return (
    <View style={styles.container}>
      <Button
        title={props.text}
        color={props.color}
        onPress={props.action}
        testID={props.testID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: BUTTON_STYLES,
});

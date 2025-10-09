import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RegularLabel } from '../atoms/labels/RegularLabel';
import { CustomInput } from '../atoms/CustomInput';

interface Props {
  text: string;
  isSensitive?: boolean;
  inputAction: (text: string) => void;
}
export const InputGroup = ({
  text,
  inputAction,
  isSensitive = false,
}: Props) => {
  return (
    <View style={styles.container}>
      <RegularLabel text={text} />
      <CustomInput action={inputAction} isSensitive={isSensitive} />
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

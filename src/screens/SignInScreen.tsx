/* eslint-disable react/react-in-jsx-scope */
import { Alert, StyleSheet, View } from 'react-native';
import { Title } from '../components/atoms/labels/Title';
import { useState } from 'react';
import { InputGroup } from '../components/molecules/InputGroup';
import { RegularButtom } from '../components/atoms/buttons/RegularButtom';
import { AuthenticationService } from '../services/auth.service';
import { SignInRequest } from '../services/dtos/authentication.dto';
import { APP_COLORS } from '../constants/styles';
import { useDispatch } from 'react-redux';
import { AuthenticationState } from '../redux/types/authTypes';
import { startSession } from '../redux/slices/authenticationSlice';

export const SignInScreen = ({ navigation }: any) => {
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [pw, onChangePw] = useState('');
  const [pwConfirmation, onChangePwConfirmation] = useState('');

  const dispatch = useDispatch();

  const authService = AuthenticationService();

  const signInBody: SignInRequest = {
    email: email,
    name: name,
    pw: pw,
  };
  const onSignIn = async () => {
    if (pw !== pwConfirmation) {
      Alert.alert('Las contraseñas no coinciden');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert('El email no tiene un formato válido');
      return;
    }
    const signInResponse = await authService.signIn(signInBody);
    console.log('signInResponse', signInResponse);
    if (signInResponse?.id) {
      const sessionState: AuthenticationState = {
        userId: signInResponse.id,
        name: signInResponse.name,
        email: signInResponse.email,
        createdAt: signInResponse.created_at,
        isAuth: true,
      };
      dispatch(startSession(sessionState));
      navigation.navigate('MenuScreen');
    } else {
      Alert.alert('Ya existe un usuario registrado con este correo');
    }
  };

  const onReturn = async () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Title text={'¡Regístrate!'} />
      <InputGroup text={'Nombre: '} inputAction={onChangeName} />
      <InputGroup text={'Correo electrónico: '} inputAction={onChangeEmail} />
      <InputGroup
        text={'Contraseña: '}
        inputAction={onChangePw}
        isSensitive={true}
      />
      <InputGroup
        text={'Repite la contraseña: '}
        inputAction={onChangePwConfirmation}
        isSensitive={true}
      />
      <View style={styles.buttonsContainer}>
        <RegularButtom
          text="Volver"
          color={APP_COLORS.secondaryButton}
          action={onReturn}
          testID="back-button"
        />
        <RegularButtom
          text="Regístrate"
          color={APP_COLORS.actionButton}
          action={onSignIn}
          testID="signin-button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});

/* eslint-disable react/react-in-jsx-scope */
import { Alert, StyleSheet, View } from 'react-native';
import { Title } from '../components/atoms/labels/Title';
import { appConfig } from '../config/app-config';
import { useState } from 'react';
import { InputGroup } from '../components/molecules/InputGroup';
import { RegularButtom } from '../components/atoms/buttons/RegularButtom';
import { AuthenticationService } from '../services/auth.service';
import { LoginRequest } from '../services/dtos/authentication.dto';
import { APP_COLORS } from '../constants/styles';
import { useDispatch } from 'react-redux';
import { startSession } from '../redux/slices/authenticationSlice';
import { AuthenticationState } from '../redux/types/authTypes';

export const LoginScreen = ({ navigation }: any) => {
  const [email, onChangeEmail] = useState('');
  const [pw, onChangePwd] = useState('');

  const dispatch = useDispatch();

  const authService = AuthenticationService();

  const loginBody: LoginRequest = {
    email: email,
    pw: pw,
  };
  const onLogin = async () => {
    const loginResponse = await authService.login(loginBody);
    if (loginResponse.length === 0) {
      Alert.alert('El correo electrónico o la contraseña no son válidos');
    } else {
      const sessionState: AuthenticationState = {
        userId: loginResponse[0].id,
        name: loginResponse[0].name,
        email: loginResponse[0].email,
        createdAt: loginResponse[0].created_at,
        isAuth: true,
      };
      dispatch(startSession(sessionState));
      navigation.navigate('MenuScreen');
    }
  };

  const onSignIn = async () => {
    navigation.navigate('SignInScreen');
  };

  return (
    <View style={styles.container}>
      <Title text={`App de ${appConfig.app.name}`} />
      <InputGroup text={'Correo electrónico: '} inputAction={onChangeEmail} />
      <InputGroup
        text={'Contraseña: '}
        inputAction={onChangePwd}
        isSensitive={true}
      />
      <View style={styles.buttonsContainer}>
        <RegularButtom
          text="Iniciar sesión"
          color={APP_COLORS.mainButton}
          action={onLogin}
          testID="login-button"
        />
        <RegularButtom
          text="Regístrate"
          color={APP_COLORS.actionButton}
          action={onSignIn}
          testID="register-button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    justifyContent: 'flex-start',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});

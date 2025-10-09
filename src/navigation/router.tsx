import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MenuScreen } from '../screens/MenuScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { CreateContactScreen } from '../screens/CreateContactScreen';
import { UpdateContactScreen } from '../screens/UpdateContactScreen';

const Stack = createNativeStackNavigator();

export const RouteStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="CreateContactScreen" component={CreateContactScreen} />
        <Stack.Screen name="UpdateContactScreen" component={UpdateContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

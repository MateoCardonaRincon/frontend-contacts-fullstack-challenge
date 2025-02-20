/* eslint-disable react/react-in-jsx-scope */
import { SafeAreaView } from 'react-native';
import { MenuScreen } from './src/components/templates/MenuScreen';

export const App = () => {
  return (
    <SafeAreaView style={appStyle}>
      <MenuScreen />
    </SafeAreaView>
  );
};

const appStyle = { flex: 1 };

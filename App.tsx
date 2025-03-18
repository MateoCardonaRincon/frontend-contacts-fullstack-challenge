/* eslint-disable react/react-in-jsx-scope */
import { SafeAreaView } from 'react-native';
import { MenuScreen } from './src/components/templates/MenuScreen';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={appStyle}>
        <MenuScreen />
      </SafeAreaView>
    </Provider>
  );
};

const appStyle = { flex: 1 };

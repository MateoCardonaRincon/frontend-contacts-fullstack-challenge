/* eslint-disable react/react-in-jsx-scope */
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { RouteStack } from './src/navigation/router';

export const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={appStyle}>
        <RouteStack />
      </SafeAreaView>
    </Provider>
  );
};

const appStyle = { flex: 1 };

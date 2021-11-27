import 'react-native-gesture-handler';
import * as React from 'react';
import {Provider} from 'react-redux';
import AppWithNavigationState from './src/navigation/AppWithNavigationState';
import store from './src/redux';
import {enableScreens} from 'react-native-screens';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

enableScreens();

let persistor = persistStore(store);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppWithNavigationState />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

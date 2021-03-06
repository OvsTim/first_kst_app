import 'react-native-gesture-handler';
import * as React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import {RootState} from '../redux';
import {vScale} from '../utils/scaling';
const Stack = createStackNavigator();

const options: StackNavigationOptions = {
  headerStyle: {
    height: vScale(50),
    backgroundColor: '#67b437',
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    color: 'white',
    fontSize: vScale(14),
  },
};

export default function MainNavigator() {
  const activeShop = useSelector((state: RootState) => state.data.activeShop);
  return (
    <Stack.Navigator screenOptions={options}>
      {!activeShop || activeShop === '' ? AuthNavigator() : AppNavigator()}
    </Stack.Navigator>
  );
}

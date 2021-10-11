import 'react-native-gesture-handler';
import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchShop from '../components/SignInComonents/SearchShopScreen';

export type AuthStackParamList = {
  SearchShop: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <>
      <Stack.Screen
        name="SearchShop"
        component={SearchShop}
        options={{headerShown: false}}
      />
    </>
  );
}

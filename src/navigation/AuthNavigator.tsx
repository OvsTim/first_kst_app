import 'react-native-gesture-handler';
import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import SearchShop from '../components/SignInComonents/SelectShopScreen';

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
        options={{
          headerStyle: {
            height: 50,
            backgroundColor: '#F2F2F2',
          },
          headerTitle: 'Рестораны',
          headerPressColorAndroid: 'transparent',
          headerTitleAlign: 'center',
          headerBackTitleVisible: true,
          headerBackTitleStyle: {
            color: '#28B3C6',
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'SFProDisplay-Regular',
          },
          headerTitleStyle: {
            color: 'black',
            fontSize: 17,
            fontFamily: 'SFProDisplay-Bold',
          },
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </>
  );
}

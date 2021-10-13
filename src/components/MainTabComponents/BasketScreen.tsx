import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Basket'>;
};

export default function BasketScreen({}: Props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>BasketScreen</Text>
    </View>
  );
}

import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Contacts'>;
};

export default function ContactsScreen({}: Props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'rgba(0,0,0,0.1)'}
        barStyle="dark-content"
      />
      <Text>ContactsScreen</Text>
    </View>
  );
}

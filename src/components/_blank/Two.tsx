import React, {useState} from 'react';
import {StatusBar, Text, View} from 'react-native';
import BaseButton from '../_CustomComponents/BaseButton';
import {useDispatch} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {useSelector} from '../../redux';
import {resetAction} from '../../redux/UserDataSlice';
import ThrottledSearchInput from '../_CustomComponents/ThrottledSearchInput';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Two'>;
};

export default function TwoScreen({}: Props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.data.token);
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'rgba(0,0,0,0.1)'}
        barStyle="dark-content"
      />
      <Text>Two Screen</Text>
      <ThrottledSearchInput
        onThrottledChange={(term: string) => {
          setSearchTerm(term);
        }}
      />
      <Text>{'searchTerm: ' + searchTerm}</Text>
      <Text>{'token: ' + token}</Text>
      <BaseButton text="clear Token" onPress={() => dispatch(resetAction())} />
    </View>
  );
}

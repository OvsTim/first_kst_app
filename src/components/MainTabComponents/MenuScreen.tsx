import React from 'react';
import {Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import AuthBaseInput from '../_CustomComponents/AuthBaseInput';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Menu'>;
};
const StyledText = withFont(Text);
export default function MenuScreen({navigation}: Props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FocusAwareStatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <StyledText style={{fontWeight: '600'}}>MenuScreen</StyledText>

      <BaseButton
        text={'123'}
        textStyle={{fontWeight: '700'}}
        onPress={() => navigation.navigate('Product')}
      />
    </View>
  );
}

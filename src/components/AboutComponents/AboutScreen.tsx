import React from 'react';
import {Image, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import DeviceInfo from 'react-native-device-info';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'About'>;
};
const StyledText = withFont(Text);
export default function AboutScreen({}: Props) {
  const {width} = useWindowDimensions();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      <Image
        style={{width: width - 120, height: 130}}
        source={require('../../assets/logo_about.png')}
      />
      <StyledText style={{fontSize: 10, color: 'black', fontWeight: '400'}}>
        {'Версия ' +
          DeviceInfo.getVersion() +
          ', сборка ' +
          DeviceInfo.getBuildNumber()}
      </StyledText>
    </View>
  );
}

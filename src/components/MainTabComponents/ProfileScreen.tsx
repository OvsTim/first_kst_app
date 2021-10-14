import React from 'react';
import {Image, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Profile'>;
};

export default function ProfileScreen({}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      <Image
        style={{width: width - 50, height: 300}}
        source={require('../../assets/ph_profile.png')}
      />
      <StyledText
        style={{
          fontWeight: '700',
          fontSize: 27,
          color: 'black',
          marginTop: 20,
        }}>
        Давайте знакомиться!
      </StyledText>
      <StyledText
        style={{
          fontWeight: '400',
          width: width - 50,
          fontSize: 15,
          lineHeight: 18,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Подарим подарок на день рождения, сохраним адрес доставки и расскажем об
        акциях
      </StyledText>
      <View style={{height: 42}} />
      <BaseButton
        width={width - 66 - 67}
        text={'Указать телефон'}
        onPress={() => {}}
      />
    </View>
  );
}

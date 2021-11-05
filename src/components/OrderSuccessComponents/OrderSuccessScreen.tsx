import React, {useState} from 'react';
import {Image, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import {useBackHandler} from '@react-native-community/hooks';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'OrderSuccess'>;
};

export default function OrderSuccessScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  useBackHandler(() => {
    // handle it
    return true;
  });
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <Image
        style={{width: width, height: 300, marginTop: 75}}
        source={require('../../assets/rafiki.png')}
      />
      <StyledText
        style={{
          marginTop: 25,
          fontWeight: '700',
          color: 'black',
          fontSize: 20,
        }}>
        Заказ успешно оформлен
      </StyledText>
      <View
        style={{
          marginHorizontal: 19,
          borderTopWidth: 1,
          borderTopColor: '#F2F2F6',
          position: 'absolute',
          paddingVertical: 25,
          bottom: 0,
        }}>
        <BaseButton
          text={'Информация о заказе'}
          containerStyle={{
            backgroundColor: 'white',
            borderColor: '#28B3C6',
            borderWidth: 2,
          }}
          textStyle={{color: '#28B3C6', fontSize: 18}}
          onPress={() => {
            navigation.goBack();
            navigation.reset({
              index: 0,
              routes: [{name: 'Profile'}],
            });
          }}
        />
        <View style={{height: 11}} />
        <BaseButton
          text={'Главное меню'}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          }}
        />
      </View>
    </View>
  );
}

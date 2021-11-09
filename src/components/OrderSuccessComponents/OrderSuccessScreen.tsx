import React, {useEffect, useState} from 'react';
import {Image, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import {useBackHandler} from '@react-native-community/hooks';
import {useAppDispatch} from '../../redux';
import {clearBasket} from '../../redux/BasketDataReducer';
import {hScale, vScale} from '../../utils/scaling';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'OrderSuccess'>;
};

export default function OrderSuccessScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const dispatch = useAppDispatch();

  useBackHandler(() => {
    // handle it
    return true;
  });

  useEffect(() => {
    dispatch(clearBasket());
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <Image
        style={{width: hScale(394), height: vScale(298), marginTop: vScale(75)}}
        source={require('../../assets/ph_success.png')}
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

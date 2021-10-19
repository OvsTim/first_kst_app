import React from 'react';
import {Image, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import BaseButton from '../_CustomComponents/BaseButton';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Basket'>;
};

export default function BasketScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FocusAwareStatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      <Image
        style={{width: width - 30, height: 300}}
        source={require('../../assets/ph_basket.png')}
      />
      <StyledText
        style={{
          fontWeight: '700',
          fontSize: 30,
          color: 'black',
          marginTop: 20,
        }}>
        Ой, корзина пуста
      </StyledText>
      <StyledText
        style={{
          fontWeight: '400',
          width: width - 50,
          fontSize: 17,
          lineHeight: 18,
          color: 'black',
          textAlign: 'center',
          marginTop: 8,
        }}>
        Ваша корзина пуста, откройте “Меню” и выберите понравившийся товар.
      </StyledText>
      <View style={{height: 27}} />
      <BaseButton
        width={width - 66 - 67}
        text={'Перейти в меню'}
        onPress={() => navigation.navigate('OrderDelivery')}
      />
    </View>
  );
}

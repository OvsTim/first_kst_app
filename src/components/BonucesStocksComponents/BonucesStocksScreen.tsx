import {Image, StatusBar, Text, useWindowDimensions, View} from 'react-native';
import BaseButton from '../_CustomComponents/BaseButton';
import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'BonucesStocks'>;
};
const StyledText = withFont(Text);

export default function BonucesStocksScreen(props: Props) {
  const {width} = useWindowDimensions();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      <Image
        style={{width, height: 300}}
        source={require('../../assets/ph_stocks.png')}
      />
      <StyledText
        style={{
          fontWeight: '700',
          fontSize: 30,
          color: 'black',
          marginTop: 20,
        }}>
        Бонусы и акции
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
        Пока нет никаких акций и бонусов для Вас, но как только они появятся, мы
        сразу же сообщим Вам.
      </StyledText>
      <View style={{height: 27}} />
      <BaseButton
        width={width - 66 - 67}
        text={'Перейти в меню'}
        onPress={() => {}}
      />
    </View>
  );
}

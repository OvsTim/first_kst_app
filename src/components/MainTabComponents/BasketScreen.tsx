import React from 'react';
import {FlatList, Image, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import BaseButton from '../_CustomComponents/BaseButton';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import {BasketItem} from '../../redux/BasketDataReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {TENGE_LETTER} from './ProductItem';
import {ProductCountButton} from './ProductCountButton';
import {ImageMap} from '../../redux/UserDataSlice';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Basket'>;
};

export default function BasketScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const imagesMap: ImageMap = useSelector(
    (state: RootState) => state.data.images,
  );

  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );

  function getNumberOfCounts() {
    return basket.reduce((a, b) => +a + +b.count, 0);
  }

  function getTotalPrice() {
    let price = 0;
    basket.forEach(it => {
      price = price + it.count * it.item.price;
    });
    return price;
  }

  function num_word(value: number, words: Array<string>) {
    value = Math.abs(value) % 100;
    let num = value % 10;
    if (value > 10 && value < 20) {
      return words[2];
    }

    if (num > 1 && num < 5) {
      return words[1];
    }

    if (num === 1) {
      return words[0];
    }

    return words[2];
  }

  function renderBasketItem(basketItem: BasketItem) {
    return (
      <View style={{width, marginTop: 15}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 36}} />
          <Image
            source={{uri: imagesMap[basketItem.item.picture_url]}}
            style={{
              height: 94,
              width: width / 2 - 18,
              marginRight: 18,
              borderRadius: 11,
            }}
          />
          <View style={{justifyContent: 'flex-start'}}>
            <StyledText
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={{
                color: 'black',
                fontWeight: '400',
                fontSize: 15,
                width: width / 3,
              }}>
              {basketItem.item.name}
            </StyledText>
            {basketItem.item.description?.toString() !== '' && (
              <StyledText
                style={{
                  width: width / 3,
                  marginTop: 5,
                  color: '#00000080',
                  fontSize: 10,
                  fontWeight: '400',
                }}
                numberOfLines={3}
                ellipsizeMode={'tail'}>
                {basketItem.item.description?.toString()}
              </StyledText>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 18,
            marginHorizontal: 25,
            paddingVertical: 14,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: '#DCDCEB',
            borderBottomColor: '#DCDCEB',
          }}>
          <StyledText
            style={{
              color: 'black',
              fontSize: 15,
              fontWeight: '700',
              marginLeft: 10,
            }}>
            {basketItem.item.price + ' ' + TENGE_LETTER}
          </StyledText>
          <View style={{marginRight: 10}}>
            <ProductCountButton product={basketItem.item} />
          </View>
        </View>
      </View>
    );
  }

  if (basket.length === 0) {
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
          onPress={() => {
            navigation.navigate('Menu');
          }}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <FocusAwareStatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />

        <FlatList
          ListHeaderComponent={() => (
            <StyledText
              style={{
                color: 'black',
                width: width - 50,
                marginTop: 25,
                marginBottom: 11,
                marginHorizontal: 25,
                fontWeight: '700',
                fontSize: 25,
              }}>
              {getNumberOfCounts() +
                ' ' +
                num_word(getNumberOfCounts(), ['товар', 'товара', 'товаров']) +
                ' на сумму ' +
                getTotalPrice() +
                ' ' +
                TENGE_LETTER}
            </StyledText>
          )}
          contentContainerStyle={{paddingBottom: 150}}
          keyExtractor={(_, index) => index.toString()}
          data={basket}
          renderItem={({item}) => renderBasketItem(item)}
        />
        <View style={{position: 'absolute', bottom: 38, alignSelf: 'center'}}>
          <BaseButton
            text={'Оформить заказ на ' + getTotalPrice() + ' ' + TENGE_LETTER}
            onPress={() => {
              navigation.navigate('OrderDelivery');
            }}
          />
        </View>
      </View>
    );
  }
}

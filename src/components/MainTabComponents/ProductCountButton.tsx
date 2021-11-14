import {Product} from '../../redux/ProductsDataSlice';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {
  BasketItem,
  minusProduct,
  plusProduct,
} from '../../redux/BasketDataReducer';
import {Restaraunt} from '../../API';
import {isOutOfStock} from '../../utils/productUtils';
import {Pressable, View} from 'react-native';
import React from 'react';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {StyledText as Text} from '../_CustomComponents/StyledText';
import {TENGE_LETTER} from './ProductItem';

type Props = {
  product: Product;
  isProductScreen?: boolean;
};
export function ProductCountButton(props: Props) {
  const StyledText = withFont(Text);
  const dispatch = useAppDispatch();
  const shops: Array<Restaraunt> = useSelector(
    (state: RootState) => state.data.shops,
  );
  const active: string = useSelector(
    (state: RootState) => state.data.activeShop,
  );
  const activeShop: Restaraunt =
    shops.filter(value => value.id === active).length > 0
      ? shops.filter(value => value.id === active)[0]
      : {
          id: '',
          phone: '',
          name: '',
          address: '',
          coords: {lat: 0, lan: 0},
          outOfStock: [],
          workHours: {},
          recommendations: [],
          delivery: {},
        };

  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  const product: Product = props.product;
  const count: number = basket.filter(it => it.item.id === product.id)[0]
    ? basket.filter(it => it.item.id === product.id)[0].count
    : 0;
  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
  if (count === 0 && isOutOfStock(activeShop, product)) {
    return (
      <View
        style={{
          height: 26,
          backgroundColor: '#F3F3F7',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9,
        }}>
        <StyledText
          style={{
            marginHorizontal: 12,
            fontWeight: '500',
            fontSize: 12,
            color: '#5A5858',
          }}>
          Будет позже
        </StyledText>
      </View>
    );
  } else if (
    count === 0 &&
    !isOutOfStock(activeShop, product) &&
    !props.isProductScreen
  ) {
    return (
      <Pressable
        onPress={() => {
          //todo:перекостылить с боевыми данными
          if (product.category !== 'Категории/Сеты') {
            dispatch(plusProduct(product));
          } else {
            dispatch(plusProduct(product));
            if (
              basket.filter(it => it.item.name === 'Персональный набор')
                .length === 0
            ) {
              dispatch(plusProduct(productsMap['Персональный набор']));
            }
          }
        }}
        android_ripple={{color: 'gray', radius: 200}}
        style={{
          height: 26,
          backgroundColor: '#BEE8EE',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StyledText
          style={{
            marginHorizontal: 26,
            color: '#046674',
            fontWeight: '700',
            fontSize: 12,
          }}>
          {product.price + ' ' + TENGE_LETTER}
        </StyledText>
      </Pressable>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 80,
          height: 26,
          backgroundColor: '#F3F3F7',
          alignItems: 'center',
          borderRadius: 30,
          justifyContent: 'center',
        }}>
        <View style={{borderRadius: 30, overflow: 'hidden'}}>
          <Pressable
            onPress={() => dispatch(minusProduct(product))}
            android_ripple={{color: 'lightgray', radius: 200}}
            style={{
              height: 26,
              width: 26,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 1,
            }}>
            <StyledText
              style={{fontSize: 12, color: '#5A5858CC', fontWeight: '500'}}>
              -
            </StyledText>
          </Pressable>
        </View>
        <StyledText
          style={{
            fontSize: 12,
            color: '#5A5858CC',
            fontWeight: '500',
            width: 30,
            textAlign: 'center',
          }}>
          {count}
        </StyledText>
        <View style={{borderRadius: 30, overflow: 'hidden'}}>
          <Pressable
            onPress={() => dispatch(plusProduct(product))}
            android_ripple={{color: 'lightgray', radius: 200}}
            style={{
              height: 26,
              width: 26,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <StyledText
              style={{
                fontSize: 12,
                color: '#5A5858CC',
                fontWeight: '500',
                marginBottom: 1,
              }}>
              +
            </StyledText>
          </Pressable>
        </View>
      </View>
    );
  }
}

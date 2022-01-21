import {Product} from '../../redux/ProductsDataSlice';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {Pressable, Text, useWindowDimensions, View} from 'react-native';
import React, {useState} from 'react';
import DropShadow from 'react-native-drop-shadow';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import {TENGE_LETTER} from './ProductItem';
import {plusProduct} from '../../redux/BasketDataReducer';

type Props = {
  recommend: string;
};
export function RecommendCard(props: Props) {
  const StyledText = withFont(Text);
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
  console.log('props', props);
  const product: Product =
    productsMap[props.recommend.replace('Продукты/', '')];
  const [isVisible, setVisible] = useState<boolean>(true);

  if (!isVisible) {
    return <View />;
  }

  return (
    <DropShadow
      style={{
        shadowColor: '#000',
        alignSelf: 'center',

        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}>
      <View
        style={{
          width: width - 50,
          backgroundColor: 'white',
          borderRadius: 15,
          marginTop: 23,
          paddingBottom: 50,
        }}>
        <StyledText
          style={{
            fontSize: 15,
            color: 'black',
            fontWeight: '700',
            marginTop: 18,
            marginBottom: 14,
            marginHorizontal: 25,
          }}>
          Рекомендуем к заказу
        </StyledText>
        <View style={{flexDirection: 'row', marginLeft: 25}}>
          <FirebaseImage
            innerUrl={product.picture_url}
            imageStyle={{
              height: 94,
              width: width / 2 - 18,
              marginRight: 18,
              borderRadius: 11,
              marginBottom: 18,
            }}
          />
          <View>
            <StyledText
              style={{
                fontSize: 10,
                width: width / 3,
                fontWeight: '500',
                color: 'black',
              }}>
              {product.name + ' '}
              <StyledText style={{color: '#808080', fontSize: 8}}>
                {product.weight !== 0
                  ? product.weight + ' гр.'
                  : product.size !== 0
                  ? product.size + 'л'
                  : ' '}
              </StyledText>
            </StyledText>
            <StyledText
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'black',
                marginTop: 8,
              }}>
              {product.price + ' ' + TENGE_LETTER}
            </StyledText>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 15,
            bottom: 16,
            flexDirection: 'row',
          }}>
          <View
            style={{
              borderRadius: 5,
              overflow: 'hidden',
              borderColor: '#28B3C6',
              borderWidth: 1,
            }}>
            <Pressable
              onPress={() => {
                dispatch(plusProduct(product));
                setVisible(false);
              }}
              style={{
                backgroundColor: '#28B3C6',
                width: 78,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              android_ripple={{
                color: '#F3F2F8',
                radius: 200,
              }}>
              <StyledText
                style={{fontSize: 10, fontWeight: '700', color: 'white'}}>
                Добавить
              </StyledText>
            </Pressable>
          </View>
          <View
            style={{
              marginLeft: 6,
              borderRadius: 5,
              overflow: 'hidden',
              borderColor: '#28B3C6',
              borderWidth: 1,
            }}>
            <Pressable
              onPress={() => setVisible(false)}
              style={{
                width: 78,
                height: 24,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              android_ripple={{color: 'gray', radius: 200}}>
              <StyledText
                style={{fontSize: 10, fontWeight: '700', color: '#28B3C6'}}>
                Скрыть
              </StyledText>
            </Pressable>
          </View>
        </View>
      </View>
    </DropShadow>
  );
}

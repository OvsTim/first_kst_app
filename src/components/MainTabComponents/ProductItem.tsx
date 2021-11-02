import {Product} from '../../redux/ProductsDataSlice';
import {Pressable, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import {RootState, useAppDispatch} from '../../redux';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {Restaraunt} from '../../API';
import {Grayscale} from 'react-native-color-matrix-image-filters';

type Props = {
  product: Product;
};

export const PRODUCT_ITEM_HEIGHT = 150;
export const TENGE_LETTER = '₸';
const StyledText = withFont(Text);
const Button = withPressable(View);
export function ProductItem(props: Props) {
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const product: Product = props.product;
  const active: string = useSelector(
    (state: RootState) => state.data.activeShop,
  );
  const shops: Array<Restaraunt> = useSelector(
    (state: RootState) => state.data.shops,
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

  function isOutOfStock() {
    if (activeShop.outOfStock.indexOf('Продукты/' + product.id) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <Pressable
      onPress={() => {}}
      android_ripple={{color: 'gray', radius: 200}}
      style={{width, height: 150}}>
      <View
        style={{
          width: width - 18,
          height: 150,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 0.5,
          marginLeft: 18,
          borderBottomColor: '#D3D5DD',
        }}>
        {isOutOfStock() ? (
          <Grayscale>
            <FirebaseImage
              innerUrl={product.picture_url}
              imageStyle={{
                height: 94,
                width: width / 2 - 18,
                marginRight: 18,
                borderRadius: 11,
              }}
            />
          </Grayscale>
        ) : (
          <FirebaseImage
            innerUrl={product.picture_url}
            imageStyle={{
              height: 94,
              width: width / 2 - 18,
              marginRight: 18,
              borderRadius: 11,
            }}
          />
        )}
        {(product.isHit || product.isNew) && (
          <LinearGradient
            colors={['#FF2323', '#C00000']}
            style={{
              position: 'absolute',
              top: 23,
              left: width / 2 - 70,
              borderRadius: 5,
              height: 11,
            }}>
            <StyledText
              style={{
                color: 'white',
                fontWeight: '700',
                fontSize: 7,
                marginHorizontal: 5,
              }}>
              {product.isHit ? 'Хит продаж' : 'Новинка'}
            </StyledText>
          </LinearGradient>
        )}
        <View style={{justifyContent: 'flex-start', height: 94}}>
          <StyledText
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{
              color: isOutOfStock() ? '#00000080' : 'black',
              fontWeight: '400',
              fontSize: 15,
              width: width / 2 - 18,
            }}>
            {product.name}
          </StyledText>
          {product.description?.toString() !== '' && (
            <StyledText
              style={{
                width: width / 2 - 18,
                marginTop: 5,
                color: isOutOfStock() ? '#0000004D' : '#00000080',
                fontSize: 10,
                fontWeight: '400',
              }}
              numberOfLines={3}
              ellipsizeMode={'tail'}>
              {product.description?.toString()}
            </StyledText>
          )}
          {product.weight !== 0 && (
            <StyledText
              style={{
                width: width / 2 - 18,
                marginTop: 12,
                color: isOutOfStock() ? '#0000004D' : '#00000080',
                fontSize: 12,
                fontWeight: '500',
              }}
              numberOfLines={3}
              ellipsizeMode={'tail'}>
              {product.weight + ' гр.'}
            </StyledText>
          )}
          {product.size !== 0 && (
            <StyledText
              style={{
                width: width / 2 - 18,
                marginTop: 12,
                color: isOutOfStock() ? '#0000004D' : '#00000080',

                fontSize: 12,
                fontWeight: '500',
              }}
              numberOfLines={3}
              ellipsizeMode={'tail'}>
              {product.size + ' л.'}
            </StyledText>
          )}
        </View>
        <View
          style={{
            overflow: 'hidden',
            borderRadius: 26 / 2,
            position: 'absolute',
            right: 18,
            bottom: 11,
          }}>
          {!isOutOfStock() ? (
            <Pressable
              onPress={() => {}}
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
          ) : (
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
          )}
        </View>
      </View>
    </Pressable>
  );
}

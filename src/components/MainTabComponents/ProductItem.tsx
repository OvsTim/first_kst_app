import {Product} from '../../redux/ProductsDataSlice';
import {Pressable, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {RootState} from '../../redux';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {Restaraunt} from '../../API';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {useNavigation} from '@react-navigation/native';
import {isOutOfStock} from '../../utils/productUtils';
import {ProductCountButton} from './ProductCountButton';

type Props = {
  product: Product;
};

export const PRODUCT_ITEM_HEIGHT = 150;
export const TENGE_LETTER = '₸';
export const DELIVERY_COST = 700;
const StyledText = withFont(Text);
export function ProductItem(props: Props) {
  const {width} = useWindowDimensions();
  const product: Product = props.product;
  const navigation = useNavigation();
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

  return (
    <Pressable
      onPress={() => navigation.navigate('Product', {product})}
      android_ripple={{color: '#F3F2F8', radius: 200}}
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
        {isOutOfStock(activeShop, product) ? (
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
              top: 20,
              right: width / 2 + 10,
              borderRadius: 5,
              height: 18,
            }}>
            <StyledText
              style={{
                color: 'white',
                fontWeight: '700',
                fontSize: 12,
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
              color: isOutOfStock(activeShop, product) ? '#00000080' : 'black',
              fontWeight: '400',
              fontSize: 15,
              width: width / 2 - 18 - 20,
            }}>
            {product.name}
          </StyledText>
          {product.description?.toString() !== '' && (
            <StyledText
              style={{
                width: width / 2 - 18 - 20,
                marginTop: 5,
                color: isOutOfStock(activeShop, product)
                  ? '#0000004D'
                  : '#00000080',
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
                color: isOutOfStock(activeShop, product)
                  ? '#0000004D'
                  : '#00000080',
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
                color: isOutOfStock(activeShop, product)
                  ? '#0000004D'
                  : '#00000080',

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
          <ProductCountButton product={product} />
        </View>
      </View>
    </Pressable>
  );
}

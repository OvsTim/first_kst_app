import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import BaseButton from '../_CustomComponents/BaseButton';
import Collapsible from 'react-native-collapsible';
import {TENGE_LETTER} from '../MainTabComponents/ProductItem';
import {RouteProp} from '@react-navigation/native';
import {Product} from '../../redux/ProductsDataSlice';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {Restaraunt} from '../../API';
import {isOutOfStock} from '../../utils/productUtils';
import {ProductCountButton} from '../MainTabComponents/ProductCountButton';
import {BasketItem, plusProduct} from '../../redux/BasketDataReducer';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Product'>;
  route: RouteProp<AppStackParamList, 'Product'>;
};
const StyledText = withFont(Text);
export default function ProductScreen({navigation, route}: Props) {
  const {width} = useWindowDimensions();
  const scrollViewRef = React.createRef<ScrollView>();
  const dispatch = useAppDispatch();
  const product: Product = route.params.product;
  const [numberOfLines, setNumberOfLines] = useState<number | undefined>(3);
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
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  const count: number = basket.filter(it => it.item.id === product.id)[0]
    ? basket.filter(it => it.item.id === product.id)[0].count
    : 0;
  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
  const insets = useSafeAreaInsets();

  function renderTopImage() {
    return (
      <>
        <FirebaseImage
          innerUrl={product.picture_url}
          imageStyle={{
            width,
            resizeMode: 'cover',
            height: 250,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <View
          style={{
            top: 17,
            left: 18,
            position: 'absolute',
            borderRadius: 45 / 2,
            backgroundColor: '#28B3C6',
            width: 45,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            pressRetentionOffset={20}
            onPress={() => navigation.goBack()}
            android_ripple={{color: 'lightgrey', radius: 200}}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../../assets/product_close.png')}
            />
          </Pressable>
        </View>
      </>
    );
  }

  function renderCard() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          marginTop: -40,
          width,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 37,
            paddingBottom: 34,
            borderBottomWidth: 1,
            marginBottom: product.description?.toString() !== '' ? 0 : 10,
            borderBottomColor: '#DCDCEB',
            marginHorizontal: 40,
          }}>
          <StyledText
            style={{
              color: 'black',
              fontSize: 30,
              lineHeight: 35,
              fontWeight: '700',
              width: (width / 3) * 2 - 40,
            }}>
            {product.name}
          </StyledText>
          <View style={{width: width / 3 - 20}}>
            <StyledText
              style={{
                fontWeight: '700',
                color: '#28B3C6',
                fontSize: 30,
                textAlign: 'right',
              }}>
              {product.price + ' ' + TENGE_LETTER}
            </StyledText>
            {product.weight !== 0 && (
              <StyledText
                style={{
                  fontWeight: '500',
                  fontSize: 12,
                  color: '#00000080',
                  textAlign: 'right',
                }}>
                {product.weight + ' гр.'}
              </StyledText>
            )}
            {product.size !== 0 && (
              <StyledText
                style={{
                  fontWeight: '500',
                  fontSize: 12,
                  color: '#00000080',
                  textAlign: 'right',
                }}>
                {product.size + ' л.'}
              </StyledText>
            )}
          </View>
        </View>
      </View>
    );
  }

  function renderDescription() {
    return (
      <>
        <View
          style={{
            marginTop: 14,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#DCDCEB',
            marginHorizontal: 40,
            width: width - 80,
          }}>
          <Pressable
            onPress={() => {
              if (numberOfLines) {
                setNumberOfLines(undefined);
              } else {
                setNumberOfLines(3);
              }
            }}>
            <Collapsible collapsed={numberOfLines === 3} collapsedHeight={70}>
              <StyledText
                numberOfLines={numberOfLines}
                style={{fontWeight: '400', fontSize: 20, color: '#000000B2'}}>
                {product.description?.toString()}
              </StyledText>
            </Collapsible>
          </Pressable>
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            marginTop: -10,
            overflow: 'hidden',
            borderRadius: 10,
            borderColor: '#F3F3F7',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Pressable
            pressRetentionOffset={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => {
              if (numberOfLines) {
                setNumberOfLines(undefined);
              } else {
                setNumberOfLines(3);
              }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
            }}
            android_ripple={{color: 'lightgrey', radius: 200}}>
            <Image
              style={{
                height: 5,
                width: 10,
                transform: [{rotate: numberOfLines ? '0deg' : '180deg'}],
              }}
              source={require('../../assets/droprdown.png')}
            />
          </Pressable>
        </View>
      </>
    );
  }

  function renderCount() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          paddingBottom: 21,
          width: width - 80,
          borderBottomWidth: 1,
          borderBottomColor: '#DCDCEB',
        }}>
        <StyledText
          style={{fontWeight: '400', fontSize: 20, color: '#000000B2'}}>
          Количество
        </StyledText>

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
          <ProductCountButton product={product} isProductScreen={true} />
        </View>
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View
        style={{
          width,
          height: 110,
          backgroundColor: '#28B3C6',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          position: 'absolute',
          bottom: 0,
        }}>
        <BaseButton
          containerStyle={{
            backgroundColor: isOutOfStock(activeShop, product)
              ? '#00000026'
              : 'white',
          }}
          textStyle={{
            color: isOutOfStock(activeShop, product) ? 'white' : '#28B3C6',
          }}
          text={
            isOutOfStock(activeShop, product)
              ? 'Недоступно для заказа'
              : 'В корзину за ' +
                (count < 2 ? product.price : product.price * count) +
                ' ' +
                TENGE_LETTER
          }
          onPress={() => {
            if (count === 0 && !isOutOfStock(activeShop, product)) {
              dispatch(plusProduct(product));
              if (
                basket.filter(it => it.item.name === 'Персональный набор')
                  .length === 0
              ) {
                dispatch(plusProduct(productsMap['Персональный набор']));
              }
            }

            navigation.goBack();
          }}
        />
      </View>
    );
  }

  return (
    <GestureRecognizer
      onSwipeDown={_ => navigation.goBack()}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 0,
          marginTop: insets.top,

          alignItems: 'center',
          paddingBottom: 150,
          justifyContent: 'flex-start',
        }}>
        <StatusBar
          translucent={false}
          barStyle={'dark-content'}
          backgroundColor={'white'}
        />
        {renderTopImage()}
        {renderCard()}

        {product.description?.toString() !== '' && renderDescription()}

        {!isOutOfStock(activeShop, product) && renderCount()}
      </ScrollView>
      {renderBottomButton()}
    </GestureRecognizer>
  );
}

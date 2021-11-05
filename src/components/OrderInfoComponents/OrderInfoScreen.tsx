import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import BaseButton from '../_CustomComponents/BaseButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {resetAction} from '../../redux/UserDataSlice';
import {RouteProp} from '@react-navigation/native';
import {withFont} from '../_CustomComponents/HOC/withFont';
import firestore from '@react-native-firebase/firestore';
import {
  Order,
  OrderDeliveryType,
  OrderPaymentType,
  OrderStatus,
  Product,
} from '../../redux/ProductsDataSlice';
import auth from '@react-native-firebase/auth';
import {BasketItem} from '../../redux/BasketDataReducer';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import {TENGE_LETTER} from '../MainTabComponents/ProductItem';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'OrderInfo'>;
  route: RouteProp<AppStackParamList, 'OrderInfo'>;
};

export default function OrderInfoScreen({route}: Props) {
  const StyledText = withFont(Text);
  const [currentOrder, setCurrentOrder] = useState<Order>(route.params.order);
  const {width} = useWindowDimensions();

  useEffect(() => {
    const subscriber = firestore()
      .collection('Заказы')
      .doc(route.params.order.id)
      .onSnapshot(doc => {
        let order: Order = {
          id: doc.id,
          public_id: doc.get<number>('НомерЗаказа'),
          currentStatus: doc.get<OrderStatus>('ТекущийСтатус'),
          user_id: auth().currentUser?.uid,
          price: doc.get<number>('Цена'),
          mark: 0,
          commentary: '',
          sdacha: doc.get<number>('Сдача'),
          restaurant: doc.get<string>('Ресторан'),
          active: true,
          payment_type: doc.get<OrderPaymentType>('ТипОплаты'),
          delivery_type: doc.get<OrderDeliveryType>('ТипПолучения'),
          address: undefined,
          statuses: doc.get<Array<any>>('Статусы'),
          products: doc.get<Array<any>>('Продукты'),
        };
        console.log('order', order);
        setCurrentOrder(order);
        // console.log('User data: ', doc.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [route.params.order.id]);

  function getDeliveryCost() {
    let prodPrice = 0;
    currentOrder.products.forEach(it => {
      prodPrice = prodPrice + it.count * it.item.price;
    });
    return Math.abs(prodPrice - currentOrder.price);
  }

  function renderImage(url: string) {
    return (
      <>
        <View
          style={{
            overflow: 'hidden',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FirebaseImage
            innerUrl={url}
            imageStyle={{
              resizeMode: 'cover',
              width: 135,
              height: 82,
            }}
          />
        </View>
        <View style={{width: 10}} />
      </>
    );
  }

  function renderImagesList() {
    return (
      <FlatList
        contentContainerStyle={{
          width,
        }}
        style={{
          paddingLeft: 22,
          flex: 1,
          marginVertical: 10,
        }}
        data={currentOrder.products.map(it => it.item.picture_url)}
        horizontal
        scrollEnabled={true}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={({item}) => renderImage(item)}
      />
    );
  }

  function renderProductList() {
    return (
      <FlatList
        contentContainerStyle={{
          backgroundColor: '#0606060D',
          marginHorizontal: 21,
          width: width - 42,
          borderRadius: 15,
          marginBottom: 100,
        }}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        bounces={false}
        data={currentOrder.products}
        renderItem={({item}) => (
          <View
            style={{
              width: width - 60,
              marginVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'space-between',
            }}>
            <StyledText
              style={{fontWeight: '400', color: 'black', fontSize: 15}}>
              {item.item.name}
            </StyledText>
            <StyledText
              style={{
                fontWeight: '400',
                color: 'black',
                fontSize: 15,
              }}>
              {item.count.toString() +
                'x' +
                item.item.price.toString() +
                ' ' +
                TENGE_LETTER}
            </StyledText>
          </View>
        )}
        ListFooterComponent={() => (
          <View
            style={{
              width: width - 60,
              marginVertical: 12,
              borderTopWidth: 1,
              borderTopColor: '#0000001A',
              alignItems: 'flex-end',
              alignSelf: 'center',
              justifyContent: 'flex-end',
            }}>
            {getDeliveryCost() > 0 && (
              <View
                style={{
                  width: width - 60,
                  marginVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                }}>
                <StyledText
                  style={{fontWeight: '400', color: 'black', fontSize: 15}}>
                  {'Курьерская доставка'}
                </StyledText>
                <StyledText
                  style={{
                    fontWeight: '400',
                    color: 'black',
                    fontSize: 15,
                  }}>
                  {getDeliveryCost() + ' ' + TENGE_LETTER}
                </StyledText>
              </View>
            )}
            <StyledText
              style={{
                marginTop: 12,
                fontWeight: '700',
                color: 'black',
                fontSize: 15,
              }}>
              {'Итого: ' + currentOrder.price + ' ' + TENGE_LETTER}
            </StyledText>
          </View>
        )}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      <StyledText
        style={{
          fontWeight: '700',
          fontSize: 25,
          color: 'black',
          marginTop: 21,
          marginLeft: 13,
        }}>
        {'Заказ №' + currentOrder.public_id}
      </StyledText>
      <StyledText
        style={{
          fontWeight: '700',
          fontSize: 25,
          color: 'black',
          marginTop: 21,
          marginLeft: 13,
        }}>
        {'Способ оплаты'}
      </StyledText>
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 22,
          alignItems: 'center',
          marginTop: 9,
        }}>
        <Image
          style={{width: 22, height: 22, marginRight: 8, tintColor: '#28B3C6'}}
          source={
            currentOrder.payment_type !== 'CASH'
              ? require('../../assets/Visa.png')
              : require('../../assets/Cash.png')
          }
        />
        <StyledText style={{fontWeight: '400', color: '#28B3C6', fontSize: 15}}>
          {currentOrder.payment_type === 'KASPI'
            ? 'Kaspi Gold (перевод)'
            : currentOrder.payment_type === 'CARD'
            ? 'Картой курьеру'
            : 'Наличными курьеру'}
        </StyledText>
      </View>
      {renderImagesList()}
      {renderProductList()}
    </ScrollView>
  );
}

import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
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
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import {TENGE_LETTER} from '../MainTabComponents/ProductItem';
import {getDescByStatus} from '../../utils/ordersUtils';
import BaseButton from '../_CustomComponents/BaseButton';
import dayjs from 'dayjs';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {Restaraunt} from '../../API';
// @ts-ignore
import AnimatedColorView from 'react-native-animated-colors';
import {newOrderCancelRequest} from '../../redux/thunks';
import {BasketItem, setBasket} from '../../redux/BasketDataReducer';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'OrderInfo'>;
  route: RouteProp<AppStackParamList, 'OrderInfo'>;
};

export default function OrderInfoScreen({route, navigation}: Props) {
  const StyledText = withFont(Text);
  const dispatch = useAppDispatch();
  const [currentOrder, setCurrentOrder] = useState<Order>(route.params.order);
  const {width} = useWindowDimensions();
  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
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

  useEffect(() => {
    const subscriber = firestore()
      .collection('Заказы')
      .doc(route.params.order.id)
      .onSnapshot(doc => {
        let order: Order = {
          restaurant_id: '',
          user_phone: '',
          user_name: '',
          id: doc.id,
          public_id: doc.get<number>('НомерЗаказа').toString(),
          currentStatus: doc.get<OrderStatus>('ТекущийСтатус'),
          user_id: auth().currentUser?.uid,
          price: doc.get<number>('Цена'),
          mark: 0,
          commentary: '',
          sdacha: doc.get<number>('Сдача'),
          restaurant: doc.get<string>('Ресторан'),
          active: doc.get<boolean>('Активен')
            ? doc.get<boolean>('Активен')
            : false,
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

  function renderStatus(
    item: {status: OrderStatus; time: string},
    index: number,
  ) {
    let timeStr = '';
    if (item.time && item.time !== '') {
      timeStr = dayjs(item.time).format(' (HH:mm)');
    }

    return (
      <>
        {index !== 0 && (
          <View style={{marginLeft: 24, paddingVertical: 8}}>
            {currentOrder.currentStatus === item.status &&
            currentOrder.currentStatus !== 'CANCELLED' &&
            currentOrder.currentStatus !== 'SUCCESS' ? (
              <>
                <AnimatedColorView
                  colors={
                    currentOrder.currentStatus === item.status
                      ? ['#A8C8CC', '#87C3CB', '#28B3C6']
                      : item.time === ''
                      ? ['#D8D8D8']
                      : ['black']
                  }
                  loop={currentOrder.currentStatus === item.status}
                  duration={1000}
                  style={{
                    overflow: 'hidden',

                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    marginBottom: 5,
                    // backgroundColor: item.time === '' ? '#D8D8D8' : 'black',
                  }}
                />
                <AnimatedColorView
                  loop={currentOrder.currentStatus === item.status}
                  duration={1000}
                  colors={
                    currentOrder.currentStatus === item.status
                      ? ['#28B3C6', '#A8C8CC', '#87C3CB']
                      : item.time === ''
                      ? ['#D8D8D8']
                      : ['black']
                  }
                  style={{
                    overflow: 'hidden',

                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    marginBottom: 5,
                  }}
                />
                <AnimatedColorView
                  loop={currentOrder.currentStatus === item.status}
                  duration={1000}
                  colors={
                    currentOrder.currentStatus === item.status
                      ? ['#87C3CB', '#28B3C6', '#A8C8CC']
                      : item.time === ''
                      ? ['#D8D8D8']
                      : ['black']
                  }
                  style={{
                    overflow: 'hidden',
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                  }}
                />
              </>
            ) : (
              <>
                <View
                  style={{
                    overflow: 'hidden',

                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    marginBottom: 5,
                    backgroundColor:
                      item.time === '' ||
                      currentOrder.currentStatus === 'CANCELLED'
                        ? '#D8D8D8'
                        : 'black',
                  }}
                />
                <View
                  style={{
                    overflow: 'hidden',

                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    marginBottom: 5,
                    backgroundColor:
                      item.time === '' ||
                      currentOrder.currentStatus === 'CANCELLED'
                        ? '#D8D8D8'
                        : 'black',
                  }}
                />
                <View
                  style={{
                    overflow: 'hidden',
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor:
                      item.time === '' ||
                      currentOrder.currentStatus === 'CANCELLED'
                        ? '#D8D8D8'
                        : 'black',
                  }}
                />
              </>
            )}
          </View>
        )}
        <StyledText
          // onPress={() => {
          //   if (item.time !== '') {
          //     return;
          //   }
          //
          //   let statuses = currentOrder.statuses;
          //   let newStatuses = [];
          //   for (let i = 0; i < statuses.length; i++) {
          //     let status = currentOrder.statuses[i];
          //     if (status.status === item.status) {
          //       status.time = dayjs(new Date()).format().toString();
          //     }
          //
          //     newStatuses.push(status);
          //   }
          //
          //   firestore()
          //     .collection('Заказы')
          //     .doc(route.params.order.id)
          //     .update({
          //       Статусы: statuses,
          //       ТекущийСтатус: item.status,
          //       Активен: item.status !== 'SUCCESS',
          //     })
          //     .then(_ => {})
          //     .catch(er => {
          //       Alert.alert(
          //         'Ошибка',
          //         'Произошла ошибка с кодом ' +
          //           er.code +
          //           ', повторите попытку позже',
          //       );
          //     });
          // }}
          style={{
            fontWeight: '500',
            marginLeft: 14,
            color:
              item.status === 'CANCELLED'
                ? '#FF0000'
                : currentOrder.currentStatus === 'CANCELLED'
                ? '#00000066'
                : currentOrder.currentStatus === item.status
                ? '#28B3C6'
                : item.time !== ''
                ? 'black'
                : '#00000066',
          }}>
          {getDescByStatus(item.status) + timeStr}
        </StyledText>
      </>
    );
  }

  function renderStatusList() {
    return (
      <FlatList
        contentContainerStyle={{
          width,
        }}
        style={{
          flex: 1,
        }}
        ListHeaderComponent={() => (
          <StyledText
            style={{
              fontWeight: '700',
              fontSize: 25,
              color: 'black',
              marginTop: 21,
              marginLeft: 13,
              marginBottom: 26,
            }}>
            {'Заказ №' + currentOrder.public_id}
          </StyledText>
        )}
        ListFooterComponent={() => (
          <>
            {currentOrder.delivery_type === 'DELIVERY' && (
              <>
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
                    style={{
                      width: 22,
                      height: 22,
                      marginRight: 8,
                      tintColor: '#28B3C6',
                    }}
                    source={
                      currentOrder.payment_type !== 'CASH'
                        ? require('../../assets/Visa.png')
                        : require('../../assets/Cash.png')
                    }
                  />
                  <StyledText
                    style={{fontWeight: '400', color: '#28B3C6', fontSize: 15}}>
                    {currentOrder.payment_type === 'KASPI'
                      ? 'Kaspi Gold (перевод)'
                      : currentOrder.payment_type === 'CARD'
                      ? 'Картой курьеру'
                      : 'Наличными курьеру'}
                  </StyledText>
                </View>
              </>
            )}
            {renderImagesList()}
          </>
        )}
        data={currentOrder.statuses}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={({item, index}) => renderStatus(item, index)}
      />
    );
  }

  function renderImagesList() {
    return (
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        style={{
          paddingLeft: 22,
          marginVertical: 10,
        }}
        data={currentOrder.products.map(it => it.item.picture_url)}
        horizontal
        ListFooterComponent={() => <View style={{width: 30}} />}
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
        }}
        style={{flex: 1}}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        bounces={false}
        data={currentOrder.products}
        renderItem={({item}) => (
          <View
            style={{
              width: width - 80,
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
              width: width - 100,
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
                  width: width - 80,
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
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />

      {renderStatusList()}
      {renderProductList()}
      {currentOrder.currentStatus === 'IS_NEW' && (
        <>
          <View style={{height: 32}} />
          <BaseButton
            text={'Отменить заказ'}
            onPress={() => {
              Alert.alert('Сообщение', 'Вы уверены?', [
                {
                  text: 'Да',
                  onPress: () => {
                    {
                      let statuses = currentOrder.statuses;
                      statuses.push({
                        status: 'CANCELLED',
                        time: dayjs(new Date()).format().toString(),
                      });
                      firestore()
                        .collection('Заказы')
                        .doc(route.params.order.id)
                        .update({
                          Статусы: statuses,
                          Активен: false,
                          ТекущийСтатус: 'CANCELLED',
                        })
                        .then(_ => {
                          dispatch(
                            newOrderCancelRequest(currentOrder.public_id),
                          );
                        })
                        .catch(er => {
                          Alert.alert(
                            'Ошибка',
                            'Произошла ошибка с кодом ' +
                              er.code +
                              ', повторите попытку позже',
                          );
                        });
                    }
                  },
                  style: 'destructive',
                },
                {text: 'Нет'},
              ]);
            }}
            containerStyle={{backgroundColor: '#FFD0D0'}}
            textStyle={{color: '#850000', fontSize: 18}}
          />
        </>
      )}
      {activeShop.phone && currentOrder.active ? (
        <StyledText
          onPress={() => {
            Linking.openURL('tel:' + activeShop.phone);
          }}
          style={{
            marginVertical: 16,
            width: width - 80,
            textAlign: 'center',
            fontWeight: '400',
            fontSize: 12,
            color: '#999999',
          }}>
          {
            'Вы можете отменить заказ, до того, как оператор подтвердит его. Если заказ уже принят, то для отмены позвоните на номер '
          }
          <StyledText style={{color: '#28B3C6'}}>{activeShop.phone}</StyledText>
        </StyledText>
      ) : (
        <>
          <View style={{height: 32}} />
          <BaseButton
            textStyle={{color: '#046674', fontSize: 18}}
            containerStyle={{
              backgroundColor: '#BEE8EE',
              width: width - 80,
            }}
            text={'Повторить заказ'}
            onPress={() => {
              let prevProdItems: Array<BasketItem> = currentOrder.products;
              let newBasket: Array<BasketItem> = [];
              prevProdItems.forEach(it => {
                if (productsMap[it.item.id]) {
                  newBasket.push({
                    item: productsMap[it.item.id],
                    count: it.count,
                  });
                } else {
                }
              });
              dispatch(setBasket(newBasket));
              navigation.navigate('Basket');
            }}
          />
          <View style={{height: 16}} />
        </>
      )}
    </ScrollView>
  );
}

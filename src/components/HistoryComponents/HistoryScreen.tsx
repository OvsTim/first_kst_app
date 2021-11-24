import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import DropShadow from 'react-native-drop-shadow';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import {TENGE_LETTER} from '../MainTabComponents/ProductItem';
// @ts-ignore
import firestore, {
  // @ts-ignore
  Timestamp,
  // @ts-ignore
  DocumentSnapshot,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  Order,
  OrderDeliveryType,
  OrderPaymentType,
  OrderStatus,
  Product,
} from '../../redux/ProductsDataSlice';
import {RootState, useAppDispatch} from '../../redux';
import {setOrders} from '../../redux/UserDataSlice';
import {useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {BasketItem, setBasket} from '../../redux/BasketDataReducer';
import {hScale, vScale} from '../../utils/scaling';
import {useNetInfo} from '@react-native-community/netinfo';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'History'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);
export default function HistoryScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const orders: Array<Order> = useSelector(
    (state: RootState) => state.data.orders,
  );
  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
  const [page, setPage] = useState<number>(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined,
  );

  const netInfo = useNetInfo();
  useEffect(() => {
    dayjs.locale('ru');
    requestPage(1);
  }, []);

  function requestPage(page: number) {
    if (page === 1) {
      firestore()
        .collection('Заказы')
        .where('ИДПользователя', '==', auth().currentUser?.uid)
        .where('ТекущийСтатус', '==', 'SUCCESS')
        .orderBy('Date', 'desc')

        .limit(10)
        .get()
        .then(res => {
          let list: Array<Order> = [];

          res.docs.forEach(doc => {
            let order: Order = {
              restaurant_id: '',
              user_name: '',
              user_phone: '',
              id: doc.id,
              dateTimestamp: doc.get<Timestamp>('Date').seconds * 1000,
              public_id: doc.get<string>('НомерЗаказа'),
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
              address: {
                id: doc.get<string>('Адрес.id'),
                house: doc.get<string>('Адрес.house'),
                street: doc.get<string>('Адрес.street'),
                code: doc.get<string>('Адрес.code'),
                name: doc.get<string>('Адрес.name'),
                flat: doc.get<string>('Адрес.flat'),
                commentary: doc.get<string>('Адрес.commentary'),
                floor: doc.get<string>('Адрес.floor'),
                entrance: doc.get<string>('Адрес.entrance'),
              },
              statuses: doc.get<Array<any>>('Статусы'),
              products: doc.get<Array<any>>('Продукты'),
            };
            list.push(order);
          });
          setLastDoc(res.docs[res.docs.length - 1]);
          dispatch(setOrders(list));
        })
        .catch(er => console.log('er', er));
    } else {
      firestore()
        .collection('Заказы')
        .where('ИДПользователя', '==', auth().currentUser?.uid)
        .where('ТекущийСтатус', '==', 'SUCCESS')
        .orderBy('Date', 'desc')
        .startAfter(lastDoc)
        .limit(10)
        .get()
        .then(res => {
          let list: Array<Order> = [];

          res.docs.forEach(doc => {
            let order: Order = {
              restaurant_id: '',
              user_name: '',
              user_phone: '',
              id: doc.id,
              dateTimestamp: doc.get<Timestamp>('Date').seconds * 1000,
              public_id: doc.get<string>('НомерЗаказа'),
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
              address: {
                id: doc.get<string>('Адрес.id'),
                house: doc.get<string>('Адрес.house'),
                street: doc.get<string>('Адрес.street'),
                code: doc.get<string>('Адрес.code'),
                name: doc.get<string>('Адрес.name'),
                flat: doc.get<string>('Адрес.flat'),
                commentary: doc.get<string>('Адрес.commentary'),
                floor: doc.get<string>('Адрес.floor'),
                entrance: doc.get<string>('Адрес.entrance'),
              },
              statuses: doc.get<Array<any>>('Статусы'),
              products: doc.get<Array<any>>('Продукты'),
            };
            list.push(order);
          });
          setLastDoc(res.docs[res.docs.length - 1]);
          dispatch(setOrders([...orders, ...list]));
        })
        .catch(er => console.log('er', er));
    }
  }

  function renderEmpty() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={{width: vScale(381), height: hScale(283)}}
          source={require('../../assets/ph_history.png')}
        />
        <StyledText
          style={{
            fontWeight: '700',
            fontSize: 30,
            color: 'black',
            marginTop: 20,
          }}>
          Нет истории заказов
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
          Здесь будем хранить все ваши заказы. Чтобы сделать первый, перейдите в
          меню.
        </StyledText>
        <View style={{height: 27}} />
        <BaseButton
          width={width - 66 - 67}
          text={'Перейти в меню'}
          onPress={() => navigation.navigate('Menu')}
        />
      </View>
    );
  }

  function renderItem(order: Order) {
    return (
      <DropShadow
        style={{
          marginVertical: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }}>
        <View
          style={{
            width: width - 46,
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <Pressable onPress={() => navigation.navigate('OrderInfo', {order})}>
            <StyledText
              style={{
                color: '#00000080',
                fontWeight: '500',
                marginTop: 13,
                marginLeft: 27,
                fontSize: 12,
                lineHeight: 14,
              }}>
              {'№ ' + order.public_id.toString()}
            </StyledText>
            <StyledText
              style={{
                color: 'black',
                fontWeight: '700',
                fontSize: 22,
                lineHeight: 24,
                marginHorizontal: 27,
                marginTop: 17,
                paddingBottom: 17,
                borderBottomWidth: 1,
                borderBottomColor: '#F2F2F6',
              }}>
              {dayjs(order.dateTimestamp).format('DD MMMM YYYY г. в HH:mm')}
            </StyledText>
            <StyledText
              style={{
                marginTop: 15,
                marginLeft: 27,
                color: '#00000080',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 14,
              }}>
              {order.delivery_type === 'DELIVERY'
                ? 'На доставку'
                : 'На самовывоз'}
            </StyledText>
            <StyledText
              style={{
                marginTop: 4,
                marginLeft: 27,
                marginRight: 26,
                fontWeight: '400',
                fontSize: 15,
                lineHeight: 18,
                color: 'black',
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F2F2F6',
              }}>
              {order.delivery_type === 'PICKUP'
                ? order.restaurant
                : order.address?.street +
                  ' ' +
                  order.address?.house +
                  ', ' +
                  order.address?.flat}
            </StyledText>
          </Pressable>
          <FlatList
            style={{paddingLeft: 27, marginVertical: 10}}
            data={order.products.map(it => it.item.picture_url)}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => <View style={{width: 50}} />}
            renderItem={({item}) => (
              <>
                <View
                  style={{
                    overflow: 'hidden',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FirebaseImage
                    innerUrl={item}
                    imageStyle={{
                      resizeMode: 'cover',
                      width: 135,
                      height: 82,
                    }}
                  />
                </View>
                <View style={{width: 10}} />
              </>
            )}
          />
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#F2F2F6',
              borderTopWidth: 1,
              borderTopColor: '#F2F2F6',
              paddingTop: 11,
              paddingBottom: 13,
              marginHorizontal: 27,
              justifyContent: 'space-between',
            }}>
            <StyledText
              style={{
                color: 'black',
                fontSize: 14,
                lineHeight: 14,
                fontWeight: '700',
              }}>
              Сумма
            </StyledText>
            <StyledText
              style={{
                color: 'black',
                fontSize: 14,
                lineHeight: 14,
                fontWeight: '700',
              }}>
              {order.price + ' ' + TENGE_LETTER}
            </StyledText>
          </View>
          <View style={{height: 10}} />
          <View style={{borderRadius: 15, overflow: 'hidden'}}>
            <Button
              onPress={() => {
                let prevProdItems: Array<BasketItem> = order.products;
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
              containerStyle={{}}>
              <View style={{flexDirection: 'row', marginVertical: 20}}>
                <Image
                  style={{width: 16, height: 16}}
                  source={require('../../assets/restart.png')}
                />
                <StyledText
                  style={{
                    marginLeft: 6,
                    color: '#1FA7B5',
                    fontWeight: '400',
                    fontSize: 18,
                    lineHeight: 21,
                  }}>
                  Повторить заказ
                </StyledText>
              </View>
            </Button>
          </View>
        </View>
      </DropShadow>
    );
  }

  function renderNoInternet() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <Image
          style={{width: vScale(381), height: hScale(283)}}
          source={require('../../assets/ph_offline.png')}
        />
        <StyledText style={{fontWeight: '700', fontSize: 28, color: 'black'}}>
          Ой, нет интернета
        </StyledText>
        <StyledText
          style={{width: width - 32, textAlign: 'center', marginVertical: 19}}>
          К сожалению Ваш мобильный телефон не подлючен к интернету, попробуйте
          зайти позже
        </StyledText>
        <BaseButton text={'Обновить'} onPress={() => {}} />
      </View>
    );
  }

  function renderList() {
    return (
      <View
        style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <FlatList
          contentContainerStyle={{width, alignItems: 'center'}}
          data={orders}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => renderEmpty()}
          onEndReached={() => {
            console.log('onEndReached', page);
            requestPage(page + 1);
            setPage(prevState => prevState + 1);
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => renderItem(item)}
        />
      </View>
    );
  }

  return !netInfo.isConnected ? renderNoInternet() : renderList();
}

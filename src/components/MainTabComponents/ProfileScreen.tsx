import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import ActiveOrderCard from './ActiveOrderCard';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {Restaraunt} from '../../API';
import {
  Order,
  OrderDeliveryType,
  OrderPaymentType,
  OrderStatus,
} from '../../redux/ProductsDataSlice';
import {getIndexByStatus} from '../../utils/ordersUtils';
import {hScale, vScale} from '../../utils/scaling';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Profile'>;
};

const Button = withPressable(View);

export default function ProfileScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const insets = useSafeAreaInsets();
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
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [addressLength, setAddressLength] = useState<number>(0);
  const [userName, setUserName] = useState<string>(
    auth().currentUser?.displayName || '',
  );
  const [orderList, setOrderList] = useState<Array<Order>>([]);
  useFocusEffect(
    React.useCallback(() => {
      setAuthorized(auth().currentUser?.displayName !== null);
      navigation.setOptions({
        headerShown: auth().currentUser?.displayName === null,
      });
      setUserName(auth().currentUser?.displayName || '');
      firestore()
        .collection('Пользователи')
        .doc(auth().currentUser?.uid)
        .collection('Адреса')
        .where('Улица', '!=', '')
        .get()
        .then(res => {
          setAddressLength(res.size);
        })
        .catch(er => console.log('er', er));
    }, [navigation]),
  );

  useEffect(() => {
    if (!authorized) {
      return;
    }

    const subscriber = firestore()
      .collection('Заказы')
      .where('ИДПользователя', '==', auth().currentUser?.uid)
      .where('Активен', '==', true)
      .onSnapshot(snap => {
        if (!snap) {
          // setOrderList([]);
        } else {
          let orders: Array<Order> = [];
          console.log('snap.docs', snap.docs);
          snap.docs.forEach(doc => {
            let order: Order = {
              restaurant_id: '',
              user_name: '',
              user_phone: '',
              id: doc.id,
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
              address: undefined,
              statuses: doc.get<Array<any>>('Статусы'),
              products: [],
            };
            orders.push(order);
          });
          console.log('orders', orders);

          setOrderList(orders);
        }
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [authorized]);

  function renderUnauthorized() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <FocusAwareStatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <Image
          style={{width: vScale(364), height: hScale(271)}}
          source={require('../../assets/ph_profile.png')}
        />
        <StyledText
          style={{
            fontWeight: '700',
            fontSize: 30,
            color: 'black',
            marginTop: 20,
          }}>
          Давайте знакомиться!
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
          Подарим подарок на день рождения, сохраним адрес доставки и расскажем
          об акциях
        </StyledText>
        <View style={{height: 27}} />
        <BaseButton
          width={width - 66 - 67}
          text={'Указать телефон'}
          onPress={() => {
            // navigation.setOptions({headerShown: false});
            // setAuthorized(true);
            navigation.navigate('EnterPhone');
          }}
        />
      </View>
    );
  }

  function renderHeader() {
    return (
      <>
        <FocusAwareStatusBar
          translucent={false}
          backgroundColor={'white'}
          barStyle="dark-content"
        />
        <View style={{height: 25 + insets.top}} />
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{width: 8}} />
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 15,
              height: 25,
              alignSelf: 'center',
            }}>
            <Button
              androidRippleColor={'#F3F2F8'}
              onPress={() =>
                navigation.navigate('ChangeRestaraunt', {activeTab: 0})
              }
              containerStyle={{height: 25}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: 10}} />

                <StyledText
                  style={{fontWeight: '500', fontSize: 15, color: 'black'}}>
                  {activeShop.name}
                </StyledText>
                <Image
                  style={{
                    width: 14,
                    height: 7,
                    marginLeft: 9,
                    tintColor: 'black',
                  }}
                  source={require('../../assets/droprdown.png')}
                />
                <View style={{width: 10}} />
              </View>
            </Button>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 50,
            width,
            alignItems: 'center',
          }}>
          <StyledText
            style={{
              fontWeight: '700',
              fontSize: 30,
              color: 'black',
              marginLeft: 18,
            }}>
            {userName}
          </StyledText>
          <View
            style={{
              borderRadius: 15,
              overflow: 'hidden',
              position: 'absolute',
              right: 17,
            }}>
            <Button
              onPress={() => navigation.navigate('Settings')}
              containerStyle={{
                backgroundColor: '#F3F3F7',
                width: 30,
                height: 30,
              }}>
              <Image
                style={{width: 18, height: 18}}
                source={require('../../assets/settings.png')}
              />
            </Button>
          </View>
        </View>
        <Pressable
          style={{
            width,
            height: 68,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => navigation.navigate('BonucesStocks')}
          android_ripple={{color: '#F3F2F8', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 18,
              paddingRight: 11,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              Бонусы
            </StyledText>
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            width,
            height: 68,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => navigation.navigate('DeliveryList')}
          android_ripple={{color: '#F3F2F8', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 18,
              paddingRight: 11,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              Адреса доставки
            </StyledText>
            {addressLength > 0 && (
              <StyledText
                style={{
                  position: 'absolute',
                  right: 24,
                  fontWeight: '500',
                  fontSize: 15,
                  color: '#0000004D',
                }}>
                {addressLength.toString()}
              </StyledText>
            )}
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            width,
            height: 68,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => navigation.navigate('History')}
          android_ripple={{color: '#F3F2F8', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 18,
              paddingRight: 11,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              История заказов
            </StyledText>
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
        <View style={{height: 15}} />
      </>
    );
  }

  function renderAuthorized() {
    return (
      <FlatList
        style={{width, alignSelf: 'center'}}
        ListHeaderComponent={() => renderHeader()}
        data={orderList}
        renderItem={({item}) => (
          <ActiveOrderCard
            order={item}
            totalProgressLength={4}
            index={getIndexByStatus(item.currentStatus)}
          />
        )}
      />
    );
  }

  return authorized ? renderAuthorized() : renderUnauthorized();
}

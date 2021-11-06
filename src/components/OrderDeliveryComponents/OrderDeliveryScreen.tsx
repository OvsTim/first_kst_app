import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
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
import BaseButton from '../_CustomComponents/BaseButton';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';
import AuthBaseInput from '../_CustomComponents/AuthBaseInput';
import {TENGE_LETTER} from '../MainTabComponents/ProductItem';
import {
  Order,
  OrderDeliveryType,
  OrderPaymentType,
  OrderStatus,
} from '../../redux/ProductsDataSlice';
import {BasketItem} from '../../redux/BasketDataReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {Address, Restaraunt} from '../../API';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'OrderDelivery'>;
};
const StyledText = withFont(Text);
export default function OrderDeliveryScreen({navigation}: Props) {
  const {width} = useWindowDimensions();

  const [paymentWay, setPaymentWay] = useState<OrderPaymentType>('CASH');
  const orderDeliveryType: OrderDeliveryType = useSelector(
    (state: RootState) => state.data.orderDeliveryType,
  );
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [sdacha, setSdacha] = useState<string>('');
  const currentAddress: Address | undefined = useSelector(
    (state: RootState) => state.data.currentAddress,
  );
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
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
  function getBasketPrice() {
    let price = 0;
    basket.forEach(it => {
      price = price + it.count * it.item.price;
    });
    return price;
  }

  function getTotalPrice() {
    if (orderDeliveryType === 'PICKUP') {
      return getBasketPrice();
    } else if (getBasketPrice() >= 5000) {
      return getBasketPrice();
    } else {
      return getBasketPrice() + 800;
    }
  }

  function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function handlePayment() {
    navigation.navigate('OrderSuccess');
    if (orderDeliveryType === 'DELIVERY' && !currentAddress) {
      Alert.alert('Сообщение', 'Укажите адрес доставки');
      return;
    }

    let statusesArray: Array<{status: OrderStatus; time: string}> = [];

    if (orderDeliveryType === 'PICKUP') {
      statusesArray = [
        {status: 'IS_NEW', time: dayjs(new Date()).format().toString()},
        {status: 'PROCESSING', time: ''},
        {status: 'COOKING', time: ''},
        {status: 'READY', time: ''},
        {status: 'SUCCESS', time: ''},
      ];
    } else {
      statusesArray = [
        {status: 'IS_NEW', time: dayjs(new Date()).format().toString()},
        {status: 'PROCESSING', time: ''},
        {status: 'COOKING', time: ''},
        {status: 'DELIVER', time: ''},
        {status: 'SUCCESS', time: ''},
      ];
    }

    let order: Order = {
      currentStatus: 'IS_NEW',
      active: true,
      sdacha: sdacha !== '' ? parseInt(sdacha) : 0,
      delivery_type: orderDeliveryType,
      id: '1231231231312',
      address:
        orderDeliveryType === 'DELIVERY'
          ? currentAddress
          : {id: '', street: '', flat: '', house: ''},
      payment_type: paymentWay,
      products: basket,
      commentary: '',
      mark: 0,
      price: getTotalPrice(),
      restaurant: activeShop.name,
      user_id: auth().currentUser?.uid ? auth().currentUser?.uid : '',
      public_id: randomInteger(1, 10000000),
      statuses: statusesArray,
    };

    firestore()
      .collection('Заказы')
      .add({
        ТекущийСтатус: order.currentStatus,
        Активен: true,
        Сдача: order.sdacha,
        ТипПолучения: order.delivery_type,
        Адрес:
          orderDeliveryType === 'DELIVERY'
            ? currentAddress
            : {id: '', street: '', flat: '', house: ''},
        ТипОплаты: order.payment_type,
        Продукты: order.products,
        Комментарий: '',
        Оценка: 0,
        Цена: order.price,
        Ресторан: order.restaurant,
        ИДПользователя: auth().currentUser?.uid ? auth().currentUser?.uid : '',
        НомерЗаказа: order.public_id,
        Статусы: order.statuses,
      })
      .then(_ => {
        navigation.navigate('OrderSuccess');
      })
      .catch(er => {
        Alert.alert(
          'Ошибка',
          'Произошла ошибка с кодом ' + er.code + ', повторите попытку позже',
        );
      });
  }

  function renderHeaderAndAddress() {
    return (
      <>
        <StyledText
          style={{
            fontWeight: '700',
            alignSelf: 'flex-start',
            marginLeft: 34,
            marginVertical: 25,
            color: 'black',
            fontSize: 25,
          }}>
          {orderDeliveryType === 'DELIVERY' ? 'Доставка' : 'Самовывоз'}
        </StyledText>
        <View
          style={{
            width: width - 68,
            backgroundColor: '#0606060D',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <StyledText
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{
              fontSize: 15,
              fontWeight: '400',
              width: width - 100,
              marginVertical: 16,
              color: 'black',
            }}>
            {activeShop.address}
          </StyledText>
          {orderDeliveryType === 'DELIVERY' && (
            <>
              <View
                style={{
                  backgroundColor: '#0000001A',
                  height: 1,
                  width: width - 100,
                }}
              />
              <View style={{overflow: 'hidden', borderRadius: 15}}>
                <Pressable
                  onPress={() => navigation.navigate('DeliveryListBasket')}
                  android_ripple={{color: 'gray', radius: 200}}
                  style={{paddingVertical: 15, width: width - 68}}>
                  <StyledText
                    style={{
                      marginLeft: 15,
                      color: '#28B3C6',
                      fontWeight: '400',
                    }}>
                    {!currentAddress
                      ? 'Укажите адрем доставки'
                      : currentAddress.street +
                        ' ' +
                        currentAddress.house +
                        ', ' +
                        currentAddress.flat}
                  </StyledText>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </>
    );
  }

  function renderPaymentWays() {
    return (
      <>
        <StyledText
          style={{
            fontWeight: '700',
            alignSelf: 'flex-start',
            marginLeft: 34,
            marginVertical: 22,
            color: 'black',
            fontSize: 25,
          }}>
          Способ оплаты
        </StyledText>
        <View
          style={{
            width: width - 68,
            backgroundColor: '#0606060D',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 15,
              borderBottomColor: '#0000001A',
              borderBottomWidth: 1,
            }}>
            <Pressable
              onPress={() => setPaymentWay('CASH')}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                paddingVertical: 12,
                width: width - 68,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginLeft: 23,
                  marginRight: 10,
                  tintColor: paymentWay === 'CASH' ? '#28B3C6' : 'black',
                }}
                source={require('../../assets/Cash.png')}
              />
              <StyledText
                style={{
                  color: paymentWay === 'CASH' ? '#28B3C6' : 'black',
                  fontWeight: '400',
                }}>
                Наличными курьеру
              </StyledText>
            </Pressable>
          </View>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 15,
              borderBottomColor: '#0000001A',
              borderBottomWidth: 1,
            }}>
            <Pressable
              onPress={() => setPaymentWay('CARD')}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                paddingVertical: 12,
                width: width - 68,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginLeft: 23,
                  marginRight: 10,
                  tintColor: paymentWay === 'CARD' ? '#28B3C6' : 'black',
                }}
                source={require('../../assets/Visa.png')}
              />
              <StyledText
                style={{
                  color: paymentWay === 'CARD' ? '#28B3C6' : 'black',
                  fontWeight: '400',
                }}>
                Картой курьеру
              </StyledText>
            </Pressable>
          </View>
          <View style={{overflow: 'hidden', borderRadius: 15}}>
            <Pressable
              onPress={() => setPaymentWay('KASPI')}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                paddingVertical: 12,
                width: width - 68,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginLeft: 23,
                  marginRight: 10,
                  tintColor: paymentWay === 'KASPI' ? '#28B3C6' : 'black',
                }}
                source={require('../../assets/Visa.png')}
              />
              <StyledText
                style={{
                  color: paymentWay === 'KASPI' ? '#28B3C6' : 'black',
                  fontWeight: '400',
                }}>
                Kaspi Gold (перевод)
              </StyledText>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  function renderCostAndDelivery() {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: width - 68,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <StyledText
            style={{
              fontWeight: '500',
              color: 'black',
              fontSize: 15,
              lineHeight: 23,
            }}>
            Стоимость заказа
          </StyledText>
          <StyledText
            style={{fontWeight: '700', color: '#28B3C6', fontSize: 18}}>
            {getBasketPrice() + ' ' + TENGE_LETTER}
          </StyledText>
        </View>
        {orderDeliveryType === 'DELIVERY' && (
          <View
            style={{
              flexDirection: 'row',
              width: width - 68,
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <StyledText
              style={{
                fontWeight: '500',
                color: 'black',
                fontSize: 15,
                lineHeight: 23,
              }}>
              Стоимость доставки
            </StyledText>
            <StyledText
              style={{fontWeight: '700', color: '#28B3C6', fontSize: 18}}>
              {getBasketPrice() >= 5000 ? 'Бесплатно' : '800 ₸'}
            </StyledText>
          </View>
        )}
      </>
    );
  }

  function renderFreeDeliveryAndMenu() {
    return (
      <>
        <StyledText
          style={{
            marginTop: 24,
            fontWeight: '700',
            fontSize: 15,
            color: '#828282',
          }}>
          {'Бесплатная доставка от 5000 ' + TENGE_LETTER}
        </StyledText>
        <Progress.Bar
          style={{backgroundColor: '#F2F2F6', marginTop: 9}}
          progress={getBasketPrice() / 5000}
          borderColor={'transparent'}
          borderRadius={3}
          animated={true}
          width={width - 68}
          height={6}
          color={'#28B3C6'}
        />
        <StyledText
          style={{marginTop: 10, fontWeight: '700', color: '#28B3C6'}}>
          {getBasketPrice() + ' '}
          <StyledText style={{fontWeight: '700', color: '#828282'}}>
            / 5000
          </StyledText>
        </StyledText>
        <View style={{height: 16}} />
        <BaseButton
          containerStyle={{width: 148, height: 25}}
          textStyle={{fontSize: 12, color: 'white'}}
          text={'перейти в меню'}
          onPress={() => navigation.navigate('Menu')}
        />
        <View style={{height: 35}} />
      </>
    );
  }

  function renderBottomButton() {
    return (
      <View
        style={{
          borderTopColor: '#F2F2F6',
          borderTopWidth: 1,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          alignItems: 'center',
          width,
          justifyContent: 'center',
        }}>
        <View style={{height: 20}} />
        <BaseButton
          width={width - 68}
          containerStyle={{alignSelf: 'center'}}
          text={
            'Итого к оплате ' + getTotalPrice().toString() + ' ' + TENGE_LETTER
          }
          onPress={() => {
            if (orderDeliveryType === 'DELIVERY' && !currentAddress) {
              Alert.alert('Сообщение', 'Укажите адрес доставки');
              return;
            }

            if (paymentWay === 'CASH') {
              setModalVisible(true);
            } else {
              handlePayment();
            }
          }}
        />
        <View style={{height: 20}} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 0,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingBottom: 100,
        }}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        {renderHeaderAndAddress()}
        {renderPaymentWays()}
        {renderCostAndDelivery()}
        {orderDeliveryType === 'DELIVERY' && renderFreeDeliveryAndMenu()}
      </ScrollView>
      {renderBottomButton()}
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={['down']}
        isVisible={isModalVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        deviceHeight={Dimensions.get('screen').height}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            height: '90%',
            width,
            alignSelf: 'center',
            backgroundColor: '#F5F5F8',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}>
          <View
            style={{
              height: '100%',
              width,
            }}>
            <Pressable
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                width: 90,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setModalVisible(false)}>
              <StyledText
                style={{fontWeight: '400', color: '#28B3C6', fontSize: 20}}>
                Отмена
              </StyledText>
            </Pressable>
            <StyledText
              style={{
                marginTop: 28,
                marginHorizontal: 17,
                fontWeight: '700',
                fontSize: 22,
                lineHeight: 26,
                color: 'black',
              }}>
              {'Заказ на ' +
                getTotalPrice() +
                ' ' +
                TENGE_LETTER +
                '. ' +
                '\nС какой суммы подготовить сдачу?'}
            </StyledText>
            <AuthBaseInput
              value={sdacha}
              onTextChanges={term => {
                if (term.replace(/[^0-9]/g, '')) {
                  let num: number = parseInt(term.replace(/[^0-9]/g, ''));
                  if (num <= 20000) {
                    setSdacha(num.toString());
                  } else {
                    setSdacha('20000');
                  }
                } else {
                  setSdacha('');
                }
              }}
              styleInput={{}}
              styleContainer={{
                width: width - 34,
                backgroundColor: 'white',
                marginTop: 27,
              }}
              editable={true}
              placeholder={''}
              inputProps={{
                keyboardType: 'number-pad',
                textContentType: 'none',
                maxLength: 5,
              }}
            />
            <View
              style={{
                width,
                position: 'absolute',
                bottom: 18,
                alignItems: 'center',
              }}>
              <BaseButton
                text={sdacha ? 'Продолжить' : 'У меня без сдачи'}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    handlePayment();
                  }, 500);
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

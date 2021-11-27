import 'react-native-gesture-handler';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import {NavigationContainerRef} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import YaMap from 'react-native-yamap';
import {useAppDispatch} from '../redux';
import {setFirebaseToken, setShops} from '../redux/UserDataSlice';
// @ts-ignore
import firestore, {DocumentReference} from '@react-native-firebase/firestore';
import {Restaraunt} from '../API';
// @ts-ignore
import auth from '@react-native-firebase/auth';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import DialogView from '../components/_CustomComponents/DialogView';
import BaseButton from '../components/_CustomComponents/BaseButton';
import {withFont} from '../components/_CustomComponents/HOC/withFont';
import {withPressable} from '../components/_CustomComponents/HOC/withPressable';
import {Product} from '../redux/ProductsDataSlice';
import { useSafeAreaInsets } from "react-native-safe-area-context";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default function AppWithNavigationState() {
  const dispatch = useAppDispatch();
  const StyledText = withFont(Text);
  const Button = withPressable(View);
  useEffect(() => {
    console.log('useEffect splash');
    SplashScreen.hide();
    YaMap.init('5f991160-3890-4d3c-acc4-59203f61edd3');
  }, []);
  const {width} = useWindowDimensions();
  const [initializing, setInitializing] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [mark, setMark] = useState<number>(0);
  const [commentary, setCommentary] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [textVisible, setTextVisible] = useState<boolean>(false);
  const routeNameRef = React.useRef<string | undefined>('');
  const navigationRef = React.useRef<NavigationContainerRef>(null);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    dayjs.locale('ru');
  }, []);

  useEffect(() => {
    requestUserPermission().then(() => {
      messaging()
        .getToken()
        .then(fcm_token => {
          console.log('TOKEN', fcm_token);
          dispatch(setFirebaseToken(fcm_token));
          if (auth().currentUser?.displayName) {
            firestore()
              .collection('Пользователи')
              .doc(auth().currentUser?.uid)
              .update({
                Токен: fcm_token,
              });
          }

          // sendTokenToServer(fcm_token, token);
        });
    });
  }, []);

  function processNotification(data: any) {
    if (data.type && data.type === 'MARK') {
      setVisible(true);
      setOrderId(data.id);
    } else if (data.type && data.type === 'PRODUCT') {
      firestore()
        .collection('Продукты')
        .doc(data.id)
        .get()
        .then(doc => {
          let product: Product = {
            id: doc.id,
            name: doc.get<string>('Название')
              ? doc.get<string>('Название')
              : '',
            description: doc.get<string>('Описание')
              ? doc.get<string>('Описание')
              : '',
            picture_url: doc.get<string>('Картинка')
              ? doc.get<string>('Картинка')
              : '',
            price: doc.get<number>('Цена') ? doc.get<number>('Цена') : 0,
            weight: doc.get<number>('Вес') ? doc.get<number>('Вес') : 0,
            isHit: doc.get<boolean>('ХитПродаж')
              ? doc.get<boolean>('ХитПродаж')
              : false,
            isNew: doc.get<boolean>('Новинка')
              ? doc.get<boolean>('Новинка')
              : false,
            size: doc.get<number>('Объем') ? doc.get<number>('Объем') : 0,
            category: doc.get<DocumentReference>('Категория').path,
            categoryOrder: 0,
          };
          navigationRef.current?.navigate('Product', {product});
        });
    }
  }

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      processNotification(remoteMessage.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          processNotification(remoteMessage.data);
        }
      });

    messaging().onMessage(async remoteMessage => {
      console.log('onMessage', remoteMessage);
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('backgroundMessageHandler', remoteMessage);
    });

    return messaging().onTokenRefresh(fcm_token => {
      console.log('REFRESH TOKEN', fcm_token);
      dispatch(setFirebaseToken(fcm_token));
      if (auth().currentUser?.displayName) {
        firestore()
          .collection('Пользователи')
          .doc(auth().currentUser?.uid)
          .update({
            Токен: fcm_token,
          });
      }
    });
  }, []);

  useEffect(() => {
    if (auth().currentUser?.displayName) {
      setInitializing(false);
    } else {
      auth()
        .signInAnonymously()
        .then(res => {
          console.log('SUCESS LOGIN', res);
          setInitializing(false);
        });
    }
  }, []);

  useEffect(() => {
    if (initializing) {
      return;
    }

    const subscriber = firestore()
      .collection('Рестораны')
      .onSnapshot(res => {
        if (res && !res.empty) {
          let newList: Array<Restaraunt> = [];
          res.docs.forEach(rest => {
            let newRest: Restaraunt = {
              address: rest.get<string>('Адрес')
                ? rest.get<string>('Адрес')
                : '',
              id: rest.id,
              name: rest.get<string>('Имя') ? rest.get<string>('Имя') : '',
              phone: rest.get<string>('Телефон')
                ? rest.get<string>('Телефон')
                : '',
              // @ts-ignore
              coords: rest.get<firestore.GeoPoint>('Координаты')
                ? {
                    // @ts-ignore
                    lat: rest.get<firestore.GeoPoint>('Координаты').latitude,
                    // @ts-ignore
                    lan: rest.get<firestore.GeoPoint>('Координаты').longitude,
                  }
                : {lan: 0, lat: 0},
              outOfStock: rest
                .get<Array<DocumentReference>>('Отсутствует')
                .map(it => it.path),
              recommendations: rest
                .get<Array<DocumentReference>>('Рекомендации')
                .map(it => it.path),
              delivery: rest.get<Record<string, string>>('Доставка'),
              workHours: rest.get<Record<string, string>>('РежимРаботы'),
            };
            newList.push(newRest);
          });
          dispatch(setShops(newList));
        }
      });

    return () => subscriber();
  }, [initializing]);

  function renderMarkDialog() {
    return (
      <DialogView
        onSwipeComplete={() => {
          setVisible(false);
          setOrderId('');
          setMark(0);
          setCommentary('');
          setTextVisible(false);
        }}
        avoidKeyboard={true}
        isVisible={visible}>
        <View
          style={{
            backgroundColor: 'white',
            width: width - 110,
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <View
            style={{
              position: 'absolute',
              right: -10,
              top: -10,
              borderRadius: 15,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'white',
            }}>
            <Button
              onPress={() => {
                setVisible(false);
                setOrderId('');
                setMark(0);
                setCommentary('');
                setTextVisible(false);
              }}
              containerStyle={{
                backgroundColor: '#28B3C6',
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: 9.5, height: 9.5}}
                source={require('../assets/closeDialog.png')}
              />
            </Button>
          </View>
          <StyledText
            style={{
              fontWeight: '700',
              fontSize: 18,
              color: 'black',
              marginTop: 22,
              marginBottom: 18,
            }}>
            Оцените заказ
          </StyledText>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: textVisible ? 11 : 60,
            }}>
            <Pressable
              onPress={() => {
                setMark(1);
                setTextVisible(true);
              }}>
              <Image
                style={{
                  width: 46,
                  height: 42,
                  tintColor: mark >= 1 ? '#FCF200' : '#D9D9D9',
                }}
                source={require('../assets/star.png')}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setMark(2);
                setTextVisible(true);
              }}>
              <Image
                style={{
                  width: 46,
                  height: 42,
                  tintColor: mark >= 2 ? '#FCF200' : '#D9D9D9',
                }}
                source={require('../assets/star.png')}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setMark(3);
                setTextVisible(true);
              }}>
              <Image
                style={{
                  width: 46,
                  height: 42,
                  tintColor: mark >= 3 ? '#FCF200' : '#D9D9D9',
                }}
                source={require('../assets/star.png')}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setMark(4);
                setTextVisible(true);
              }}>
              <Image
                style={{
                  width: 46,
                  height: 42,
                  tintColor: mark >= 4 ? '#FCF200' : '#D9D9D9',
                }}
                source={require('../assets/star.png')}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setMark(5);
                setTextVisible(false);
              }}>
              <Image
                style={{
                  width: 46,
                  height: 42,
                  tintColor: mark >= 5 ? '#FCF200' : '#D9D9D9',
                }}
                source={require('../assets/star.png')}
              />
            </Pressable>
          </View>
          {textVisible && (
            <TextInput
              style={{
                textAlignVertical: 'top',
                paddingTop: 11,
                paddingHorizontal: 15,
                marginBottom: 50,
                borderColor: '#D9D9D9',
                borderWidth: 1,
                borderRadius: 10,
                width: width - 140,
                minHeight: 83,
              }}
              multiline={true}
              value={commentary}
              onChangeText={text => setCommentary(text)}
              underlineColorAndroid={'transparent'}
              placeholder={'Что нам стоит улучшить?'}
            />
          )}

          <View style={{position: 'absolute', bottom: -25}}>
            <BaseButton
              textStyle={{
                fontWeight: '700',
                color: 'white',
                fontSize: 15,
              }}
              containerStyle={{
                backgroundColor:
                  mark === 0 || (mark < 5 && !commentary)
                    ? '#8B8B8B'
                    : '#28B3C6',
                width: width - 240,
                borderWidth: 1,
                borderColor: 'white',
              }}
              text={'Отправить'}
              onPress={() => {
                if (mark === 5 || (mark < 5 && commentary)) {
                  firestore()
                    .collection('Заказы')
                    .doc(orderId)
                    .update({
                      Комментарий: commentary,
                      Оценка: mark,
                    })
                    .then(_ => {
                      setVisible(false);
                      setOrderId('');
                      setMark(0);
                      setCommentary('');
                      setTextVisible(false);
                    });
                }
              }}
            />
          </View>
        </View>
      </DialogView>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: 'white',
        },
      }}
      ref={navigationRef}
      onReady={() => {
        if (navigationRef.current !== null) {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          //analytics

          analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}>
      <MainNavigator />
      {renderMarkDialog()}
    </NavigationContainer>
  );
}

import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
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
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import Switch from 'react-native-switch-pro';
import NewBaseInput, {InputRefType} from '../_CustomComponents/NewBaseInput';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
// @ts-ignore
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import * as Progress from 'react-native-progress';
import {useAppDispatch} from '../../redux';
import {logout} from '../../redux/UserDataSlice';
import messaging from '@react-native-firebase/messaging';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Settings'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);
export default function SettingsScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const dateRef = useRef<InputRefType>(null);
  const nameRef = useRef<InputRefType>(null);
  const phoneRef = useRef<InputRefType>(null);
  const emailRef = useRef<InputRefType>(null);
  const [loadingToolbar, setLoadingToolbar] = useState<boolean>(false);
  const [IdTokenResult, setIdTokenResult] = useState<
    FirebaseAuthTypes.IdTokenResult | undefined
  >(undefined);
  const [oldEmail, setOldEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    dayjs.locale('ru');
    auth()
      .currentUser?.getIdTokenResult(true)
      .then(res => {
        setIdTokenResult(res);
        console.log('res', res);
      });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loadingToolbar ? (
          <Progress.CircleSnail
            style={{marginRight: 24}}
            size={24}
            color={['gray', '#28B3C6']}
          />
        ) : (
          <Button
            onPress={() => changeMailAndName()}
            containerStyle={{width: 100, height: 24}}>
            <StyledText
              style={{fontWeight: '700', color: '#28B3C6', fontSize: 15}}>
              Готово
            </StyledText>
          </Button>
        ),
    });
  }, [navigation, loadingToolbar]);

  useEffect(() => {
    firestore()
      .collection('Пользователи')
      .doc(auth().currentUser?.uid)
      .get()
      .then(res => {
        dateRef.current?.setValue(
          dayjs(res.get<Timestamp>('ДеньРождения').seconds * 1000).format(
            'D MMMM',
          ),
        );
        emailRef.current?.setValue(res.get<string>('Почта'));
        phoneRef.current?.setValue(res.get<string>('Телефон'));
        setOldEmail(res.get<string>('Почта'));
      })
      .catch(er => {
        Alert.alert(
          'Ошибка',
          'Произошла ошибка с кодом ' + er.code + ', повторите попытку позже',
        );
      });
  }, []);

  function validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function changeMailAndName() {
    if (
      emailRef.current?.getValue() &&
      !validateEmail(emailRef.current?.getValue())
    ) {
      Alert.alert('Ошибка', 'Почта имеет невалидный формат');
      return;
    }

    if (nameRef.current?.getValue() && nameRef.current?.getValue().length < 2) {
      Alert.alert('Ошибка', 'Недопустимое имя');
      return;
    }

    setLoadingToolbar(true);

    auth()
      .currentUser?.updateProfile({displayName: nameRef.current?.getValue()})
      .then(_ => {
        if (emailRef.current?.getValue() !== oldEmail) {
          firestore()
            .collection('Пользователи')
            .doc(auth().currentUser?.uid)
            .update({
              Почта: emailRef.current?.getValue(),
            })
            .then(_ => {
              setLoadingToolbar(false);

              navigation.goBack();
            })
            .catch(er => {
              setLoadingToolbar(false);

              Alert.alert(
                'Ошибка',
                'Произошла ошибка с кодом ' +
                  er.code +
                  ', повторите попытку позже',
              );
            });
        } else {
          setLoadingToolbar(false);

          navigation.goBack();
        }
      })
      .catch(er => {
        setLoadingToolbar(false);
        Alert.alert(
          'Ошибка',
          'Произошла ошибка с кодом ' + er.code + ', повторите попытку позже',
        );
      });
  }

  async function massDeleteOrders() {
    const usersQuerySnapshot = await firestore()
      .collection('Заказы')
      .where('ИДПользователя', '==', auth().currentUser?.uid)
      .get();

    const batch = firestore().batch();

    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });

    return batch.commit();
  }

  async function massDeleteAddresses() {
    const usersQuerySnapshot = await firestore()
      .collection('Пользователи')
      .doc(auth().currentUser?.uid)
      .collection('Адреса')
      .get();

    const batch = firestore().batch();

    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });

    return batch.commit();
  }

  function checkCanDelete() {
    firestore()
      .collection('Заказы')
      .where('ИДПользователя', '==', auth().currentUser?.uid)
      .where('Активен', '==', true)
      .get()
      .then(res => {
        if (!res.empty) {
          Alert.alert(
            'Ошибка',
            'Нельзя удалить пользователя, имея активные заказы',
          );
        } else {
          auth()
            .currentUser?.delete()
            .then(_ => {
              auth()
                .signInAnonymously()
                .then(_ => {
                  massDeleteOrders()
                    .then(_ =>
                      massDeleteAddresses()
                        .then(_ => {
                          firestore()
                            .collection('Пользователи')
                            .doc(auth().currentUser?.uid)
                            .delete()
                            .then(_ => {
                              navigation.goBack();
                              dispatch(logout());
                            });
                        })
                        .catch(er =>
                          Alert.alert(
                            'Ошибка',
                            'Произошла ошибка с кодом ' +
                              er.code +
                              ', повторите попытку позже',
                          ),
                        ),
                    )
                    .catch(er =>
                      Alert.alert(
                        'Ошибка',
                        'Произошла ошибка с кодом ' +
                          er.code +
                          ', повторите попытку позже',
                      ),
                    );
                });
            })
            .catch(er => {
              if (er.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Ошибка',
                  'Требуется повторно авторизрваться в приложении',
                );
                return;
              }

              Alert.alert(
                'Ошибка',
                'Произошла ошибка с кодом ' +
                  er.code +
                  ', повторите попытку позже',
              );
            });
        }
      })
      .catch(er =>
        Alert.alert(
          'Ошибка',
          'Произошла ошибка с кодом ' + er.code + ', повторите попытку позже',
        ),
      );
  }

  function renderInputs() {
    return (
      <>
        <NewBaseInput
          ref={nameRef}
          value={auth().currentUser?.displayName || ''}
          styleInput={{}}
          styleContainer={{}}
          editable={true}
          placeholder={'Имя'}
          showLabel={true}
          label={'Имя'}
          maxLength={30}
          textContentType={'name'}
          onChangeText={text => {
            setName(text.replace(/[^A-Za-zА-Яа-я-\s!?]/g, ''));
            nameRef.current?.setValue(
              text.replace(/[^A-Za-zА-Яа-я-\s!?]/g, ''),
            );
          }}
          labelStyle={{}}
        />
        <NewBaseInput
          ref={phoneRef}
          styleInput={{}}
          styleContainer={{}}
          editable={false}
          placeholder={'Телефон'}
          showLabel={true}
          label={'Телефон'}
          labelStyle={{}}
        />
        <NewBaseInput
          ref={emailRef}
          styleInput={{}}
          styleContainer={{}}
          editable={!auth().currentUser?.email}
          placeholder={'Не указано'}
          showLabel={true}
          label={'Email'}
          keyboardType={'email-address'}
          textContentType={'emailAddress'}
          labelStyle={{}}
        />
        <NewBaseInput
          ref={dateRef}
          value={''}
          styleInput={{}}
          styleContainer={{}}
          editable={false}
          placeholder={'День рождения'}
          showLabel={true}
          label={'День рождения'}
          labelStyle={{}}
        />
      </>
    );
  }

  function renderNotifications() {
    return (
      <View style={{borderBottomWidth: 1, borderBottomColor: '#F2F2F6'}}>
        <StyledText
          style={{
            fontSize: 18,
            alignSelf: 'flex-start',
            marginTop: 39,
            color: 'black',
            fontWeight: '700',
          }}>
          Уведомления
        </StyledText>

        <Pressable
          onPress={() => {
            if (Platform.OS === 'android') {
              Linking.openSettings();
            } else {
              messaging().requestPermission();
            }
          }}
          style={{
            flexDirection: 'row',
            marginTop: 33,
            marginRight: 22,
            width: width - 19 - 22,
            justifyContent: 'space-between',
          }}>
          <View>
            <StyledText
              style={{
                fontWeight: '500',
                color: 'black',
                width: width / 2,
                fontSize: 15,
                lineHeight: 19,
              }}>
              Сообщать о бонусах, акциях, новинках и статусе заказа
            </StyledText>
            <StyledText
              style={{
                color: '#00000080',
                marginTop: 4,
                fontWeight: '400',
                fontSize: 12,
                lineHeight: 14,
                marginBottom: 26,
              }}>
              Пуш-уведомления, смс
            </StyledText>
          </View>
          <Switch
            backgroundActive={'#65C466'}
            width={53}
            height={35}
            value={messaging().isDeviceRegisteredForRemoteMessages}
            disabled={true}
            circleColorActive={'white'}
            circleColorInactive={'white'}
            style={{paddingHorizontal: 3, overflow: 'hidden', zIndex: -1}}
            circleStyle={{width: 27, height: 27}}
          />
        </Pressable>
      </View>
    );
  }

  function renderLogoutDelete() {
    return (
      <View
        style={{
          alignItems: 'flex-start',
          marginTop: 26,
          width: width - 19,
        }}>
        <Button
          onPress={() => {
            Alert.alert('Выход из аккаунта', 'Вы уверены?', [
              {style: 'default', text: 'Нет'},
              {
                style: 'destructive',
                text: 'Да',
                onPress: () => {
                  auth()
                    .signOut()
                    .then(_ => {
                      auth()
                        .signInAnonymously()
                        .then(_ => {
                          navigation.goBack();
                          dispatch(logout());
                        });
                    })
                    .catch(er => {
                      // console.log('er', er);
                    });
                },
              },
            ]);
          }}
          containerStyle={{}}>
          <StyledText
            style={{
              color: '#28B3C6',
              fontWeight: '500',
              fontSize: 18,
              lineHeight: 23,
            }}>
            Выйти из акканута
          </StyledText>
        </Button>
        <View style={{height: 11}} />
        <Button
          onPress={() =>
            Alert.alert(
              'Удаление аккаунта',
              'Внимание! Данное действие приведет к удалению всей истории заказов',
              [
                {style: 'cancel', text: 'Отменить'},
                {
                  style: 'destructive',
                  text: 'Удалить',
                  onPress: () => checkCanDelete(),
                },
              ],
            )
          }
          containerStyle={{}}>
          <StyledText
            style={{
              color: '#FF0000',
              fontWeight: '500',
              fontSize: 18,
              lineHeight: 23,
            }}>
            Удалить аккаунт
          </StyledText>
        </Button>
        <StyledText
          style={{
            width: width / 2,
            fontWeight: '400',
            color: '#00000080',
            fontSize: 10,
            lineHeight: 13,
          }}>
          Внимание! Данное действие приведет к удалению всей истории заказов.
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 150,
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      {renderInputs()}
      {renderNotifications()}
      {renderLogoutDelete()}
    </ScrollView>
  );
}

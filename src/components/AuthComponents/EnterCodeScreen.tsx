import React, {createRef, RefObject, useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  Vibration,
  View,
  Animated,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import {RouteProp} from '@react-navigation/native';
// @ts-ignore
import auth, {
  // @ts-ignore
  ConfirmationResult,
  // @ts-ignore
  UserCredential,
  // @ts-ignore
  User,
} from '@react-native-firebase/auth';
// @ts-ignore
import {useSmsUserConsent} from '@eabdullazyanov/react-native-sms-user-consent';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'EnterCode'>;
  route: RouteProp<AppStackParamList, 'EnterCode'>;
};
const StyledText = withFont(Text);
export default function EnterCodeScreen({navigation, route}: Props) {
  const firebase_token = useSelector(
    (state: RootState) => state.data.firebase_token,
  );

  const [code, setCode] = useState<string>('');
  const shakeAnimation = new Animated.Value(0);
  const [confirm, setConfirm] = useState<ConfirmationResult>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const count = 60;
  const codeRef: RefObject<TextInput> = createRef();
  const {width} = useWindowDimensions();
  const retrievedCode = useSmsUserConsent();
  const [counter, setCounter] = useState(count);

  useEffect(() => {
    let intervalId: any;

    if (isActive) {
      intervalId = setInterval(() => {
        setCounter(c => c - 1);
      }, 1000);
    }

    if (counter === 0) {
      setIsActive(false);
      setCounter(60);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  useEffect(() => {
    async function signInWithPhoneNumber() {
      auth()
        .signInWithPhoneNumber(route.params.phone)
        .then(confirmation => {
          setConfirm(confirmation);
        })
        .catch(er => {
          Alert.alert(
            'Ошибка',
            'Произошла ошибка с кодом ' + er.code + ', повторите попытку позже',
          );
        });
    }

    signInWithPhoneNumber().then(_ => {});
  }, []);

  useEffect(() => {
    setTimeout(() => codeRef.current?.focus(), 150);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {});
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        codeRef.current?.blur();
      }, 0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (retrievedCode) {
      setCode(retrievedCode);
    }
  }, [retrievedCode]);

  function onAuthStateChanged(user: User | null) {
    console.log('useronAuthStateChanged', user);
    if (user && user.phoneNumber === null) {
      return;
    }

    if (user && !user.displayName) {
      navigation.navigate('EnterName');
    } else {
      firestore()
        .collection('Пользователи')
        .doc(auth().currentUser?.uid)
        .update({
          Токен: firebase_token,
        })
        .then(_ => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        });
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (code.length === 6 && confirm) {
      confirm
        .confirm(code)
        .then((res: UserCredential) => {
          if (res.additionalUserInfo?.isNewUser || !res.user.displayName) {
            navigation.navigate('EnterName');
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          }
        })
        .catch((er: {code: any}) => {
          if (er.code === 'auth/invalid-verification-code') {
            startShake();
          } else if (er.code === 'auth/too-many-requests') {
            Alert.alert(
              'Ошибка',
              'Превышено количество запросов, повторите попытку позже',
            );
          } else {
            Alert.alert(
              'Ошибка',
              'Произошла ошибка с кодом ' +
                er.code +
                ', повторите попытку позже',
            );
          }
        });
    }
  }, [code, confirm]);

  function startShake() {
    // Vibration.vibrate(400);
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      {iterations: 4},
    ).start();
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <StyledText style={{fontWeight: '700', fontSize: 24, marginTop: 30}}>
        Теперь введите код
      </StyledText>
      <StyledText
        style={{
          color: '#000000CC',
          marginTop: 18,
          fontWeight: '400',
          lineHeight: 18,
          textAlign: 'center',
        }}>
        {'Код отправили на номер\n' + route.params.formattedPhone}
      </StyledText>

      <Pressable
        onPress={() => {
          console.log('onPress', codeRef.current);
          setTimeout(() => {
            codeRef.current?.focus();
          }, 0);
        }}
        style={{
          height: 33,
          width: 280,
          marginTop: 40,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Animated.View
          style={{
            transform: [{translateX: shakeAnimation}],
            height: 33,
            width: 280,
            marginTop: 40,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {code[0] ? (
            <StyledText
              style={{
                fontWeight: '700',
                fontSize: 25,
                color: '#000000CC',
                position: 'absolute',
                left: 40,
              }}>
              {code[0]}
            </StyledText>
          ) : (
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: '#C4C4C4',
                position: 'absolute',
                left: 40,
              }}
            />
          )}
          {code[1] ? (
            <StyledText
              style={{
                fontWeight: '700',
                fontSize: 25,
                color: '#000000CC',
                position: 'absolute',
                left: 80,
              }}>
              {code[1]}
            </StyledText>
          ) : (
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,

                backgroundColor: '#C4C4C4',
                position: 'absolute',
                left: 80,
              }}
            />
          )}
          {code[2] ? (
            <StyledText
              style={{
                fontWeight: '700',
                fontSize: 25,
                color: '#000000CC',
                position: 'absolute',
                left: 120,
              }}>
              {code[2]}
            </StyledText>
          ) : (
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,

                backgroundColor: '#C4C4C4',
                position: 'absolute',
                left: 120,
              }}
            />
          )}
          {code[3] ? (
            <StyledText
              style={{
                fontWeight: '700',
                fontSize: 25,
                color: '#000000CC',
                position: 'absolute',
                left: 160,
              }}>
              {code[3]}
            </StyledText>
          ) : (
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,

                backgroundColor: '#C4C4C4',
                position: 'absolute',
                left: 160,
              }}
            />
          )}
          {code[4] ? (
            <StyledText
              style={{
                fontWeight: '700',
                fontSize: 25,
                color: '#000000CC',
                position: 'absolute',
                left: 200,
              }}>
              {code[4]}
            </StyledText>
          ) : (
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,

                backgroundColor: '#C4C4C4',
                position: 'absolute',
                left: 200,
              }}
            />
          )}
          {code[5] ? (
            <StyledText
              style={{
                fontWeight: '700',
                fontSize: 25,
                color: '#000000CC',
                position: 'absolute',
                left: 240,
              }}>
              {code[5]}
            </StyledText>
          ) : (
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: '#C4C4C4',
                position: 'absolute',
                left: 240,
              }}
            />
          )}
        </Animated.View>
      </Pressable>
      <TextInput
        textContentType={'oneTimeCode'}
        style={{width: 0, position: 'absolute'}}
        ref={codeRef}
        value={code}
        autoFocus={true}
        keyboardType={'number-pad'}
        onChangeText={text => setCode(text)}
      />
      <StyledText
        numberOfLines={2}
        style={{
          marginTop: 30,
          color: '#00000066',
          fontWeight: '400',
          fontSize: 12,
          width: width - 140,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        {counter !== 60
          ? 'Если код не придет, можно получить новый через ' + counter + ' сек'
          : ''}
      </StyledText>
      <BaseButton
        containerStyle={{
          backgroundColor: isActive ? '#00000026' : '#28B3C6',
        }}
        active={!isActive}
        text={'Получить новый код'}
        loading={getLoading}
        onPress={() => {
          if (isActive || getLoading) {
            return;
          }

          setGetLoading(true);
          auth()
            .signInWithPhoneNumber(route.params.phone, true)
            .then(confirmation => {
              setConfirm(confirmation);
              setIsActive(true);
              setGetLoading(false);
            })
            .catch(er => {
              setGetLoading(false);

              Alert.alert(
                'Ошибка',
                'Произошла ошибка с кодом ' +
                  er.code +
                  ', повторите попытку позже',
              );
            });
        }}
      />
    </View>
  );
}

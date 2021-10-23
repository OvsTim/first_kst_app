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
} from '@react-native-firebase/auth';
// @ts-ignore
import {useSmsUserConsent} from '@eabdullazyanov/react-native-sms-user-consent';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'EnterCode'>;
  route: RouteProp<AppStackParamList, 'EnterCode'>;
};
const StyledText = withFont(Text);
export default function EnterCodeScreen({navigation, route}: Props) {
  const [code, setCode] = useState<string>('');
  const shakeAnimation = new Animated.Value(0);
  const [confirm, setConfirm] = useState<ConfirmationResult>(null);

  const codeRef: RefObject<TextInput> = createRef();
  const {width} = useWindowDimensions();
  const retrievedCode = useSmsUserConsent();

  useEffect(() => {
    async function signInWithPhoneNumber() {
      auth()
        .signInWithPhoneNumber(route.params.phone)
        .then(confirmation => {
          setConfirm(confirmation);
        })
        .catch(er => {
          console.log('er', er);
        });
    }

    signInWithPhoneNumber().then(_ => {});
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

  useEffect(() => {
    if (code.length === 6 && confirm) {
      confirm
        .confirm(code)
        .then((res: UserCredential) => {
          // if (
          //   res.additionalUserInfo?.isNewUser ||
          //   !res.additionalUserInfo?.username
          // ) {
          navigation.navigate('EnterName');
          // } else {
          //   navigation.popToTop();
          // }
        })
        .catch(er => {
          console.log('er', er.code);
          startShake();
          if (er.code === 'auth/invalid-verification-codе') {
            //todo:тряска
            startShake();
          } else if (er.code === 'auth/too-many-requests') {
            Alert.alert(
              'Ошибка',
              'Превышено количество запросов, повторите попытку позже',
            );
          }
        });
    }
  }, [code, confirm]);

  function startShake() {
    Vibration.vibrate(70);
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
        style={{
          marginTop: 30,
          color: '#00000066',
          fontWeight: '400',
          fontSize: 12,
          width: width - 140,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Если код не придет, можно получить новый через 29 сек
      </StyledText>
      <BaseButton
        containerStyle={{
          backgroundColor: code.length < 6 ? '#00000026' : '#28B3C6',
        }}
        active={code.length === 6}
        text={'Получить новый код'}
        onPress={() => {}}
      />
    </View>
  );
}

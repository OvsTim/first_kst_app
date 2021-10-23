import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {Alert, Pressable, Text, useWindowDimensions, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {withFont} from '../_CustomComponents/HOC/withFont';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import NewBaseInput, {InputRefType} from '../_CustomComponents/NewBaseInput';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'AddEditAddress'>;
  route: RouteProp<AppStackParamList, 'AddEditAddress'>;
};
export default function AddEditAddressScreen({navigation, route}: Props) {
  const StyledText = withFont(Text);
  const {width} = useWindowDimensions();
  const [loadingToolbar, setLoadingToolbar] = useState<boolean>(false);
  const streetRef = useRef<InputRefType>(null);
  const homeRef = useRef<InputRefType>(null);
  const flatRef = useRef<InputRefType>(null);
  const nameRef = useRef<InputRefType>(null);
  const entranceRef = useRef<InputRefType>(null);
  const floorRef = useRef<InputRefType>(null);
  const codeRef = useRef<InputRefType>(null);
  const commentaryRef = useRef<InputRefType>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loadingToolbar ? (
          <Progress.CircleSnail
            style={{marginRight: 24}}
            size={24}
            color={['gray', '#28B3C6']}
          />
        ) : (
          <Pressable
            onPress={() => {
              if (route.params.type === 'add') {
                addAddress();
              } else {
                updateAddress();
              }
            }}
            android_ripple={{color: 'gray', radius: 200}}
            style={{
              width: 80,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <StyledText
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#28B3C6',
              }}>
              Готово
            </StyledText>
          </Pressable>
        ),
    });
  }, [navigation, loadingToolbar, route.params.type]);

  function addAddress() {
    if (
      !nameRef.current?.getValue() ||
      !homeRef.current?.getValue() ||
      !flatRef.current?.getValue() ||
      !streetRef.current?.getValue()
    ) {
      Alert.alert(
        'Ошибка',
        'Заполните обязательные поля (название, дом, квартира, улица)',
      );
      return;
    }

    setLoadingToolbar(true);
    firestore()
      .collection('Пользователи')
      //todo:user_id
      .doc('xlmoN94j09tWcC8mN9qQ')
      .collection('Адреса')
      .doc(nameRef.current?.getValue())
      .set({
        Название: nameRef.current?.getValue(),
        Дом: homeRef.current?.getValue(),
        Квартира: flatRef.current?.getValue(),
        КодДомофона: codeRef.current?.getValue(),
        Комментарий: commentaryRef.current?.getValue(),
        Подъезд: entranceRef.current?.getValue(),
        Улица: streetRef.current?.getValue(),
        Этаж: floorRef.current?.getValue(),
      })
      .then(_ => {
        // console.log('res', res);
        setLoadingToolbar(false);
        navigation.goBack();
      })
      .catch(er => {
        console.log('er', er);
        setLoadingToolbar(false);
      });
  }

  function updateAddress() {
    if (
      !nameRef.current?.getValue() ||
      !homeRef.current?.getValue() ||
      !flatRef.current?.getValue() ||
      !streetRef.current?.getValue()
    ) {
      Alert.alert(
        'Ошибка',
        'Заполните обязательные поля (название, дом, квартира, улица)',
      );
      return;
    }

    setLoadingToolbar(true);

    firestore()
      .collection('Пользователи')
      //todo:user_id
      .doc('xlmoN94j09tWcC8mN9qQ')
      .collection('Адреса')
      .doc(route.params.address?.id)
      .update({
        Название: nameRef.current?.getValue(),
        Дом: homeRef.current?.getValue(),
        Квартира: flatRef.current?.getValue(),
        КодДомофона: codeRef.current?.getValue(),
        Комментарий: commentaryRef.current?.getValue(),
        Подъезд: entranceRef.current?.getValue(),
        Улица: streetRef.current?.getValue(),
        Этаж: floorRef.current?.getValue(),
      })
      .then(_ => {
        // console.log('res', res);
        setLoadingToolbar(false);
        navigation.goBack();
      })
      .catch(er => {
        console.log('er', er);
        setLoadingToolbar(false);
      });
  }

  function deleteAddress() {
    if (loadingToolbar) {
      return;
    }

    setLoadingToolbar(true);
    firestore()
      .collection('Пользователи')
      //todo:user_id
      .doc('xlmoN94j09tWcC8mN9qQ')
      .collection('Адреса')
      .doc(route.params.address?.id)
      .delete()
      .then(_ => {
        // console.log('res', res);
        setLoadingToolbar(false);
        navigation.goBack();
      })
      .catch(er => {
        console.log('er', er);
        setLoadingToolbar(false);
      });
  }

  return (
    <KeyboardAwareScrollView
      extraHeight={25}
      enableOnAndroid={true}
      contentContainerStyle={{
        width,
        paddingBottom: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <View style={{width}}>
        <NewBaseInput
          ref={streetRef}
          styleContainer={{}}
          labelStyle={{}}
          value={route.params.address ? route.params.address.street : ''}
          showLabel={true}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          editable={true}
          placeholder={''}
          label={'Улица'}
          inputProps={{
            textContentType: 'streetAddressLine1',
            keyboardType: 'default',
            maxLength: 30,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              console.log('onSubmitEditing');
              homeRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={homeRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.house : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={''}
          showLabel={true}
          label={'Дом (корпус, строение)'}
          inputProps={{
            textContentType: 'streetAddressLine2',
            keyboardType: 'default',
            maxLength: 4,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              flatRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={flatRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.flat : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={''}
          showLabel={true}
          label={'Квартира'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',
            maxLength: 4,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              entranceRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={entranceRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.entrance : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={''}
          showLabel={true}
          label={'Подъезд '}
          secondLabel={'(не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',
            maxLength: 2,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              floorRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={floorRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.floor : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={''}
          showLabel={true}
          label={'Этаж '}
          secondLabel={'(не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',
            maxLength: 2,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              codeRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={codeRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.code : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={''}
          showLabel={true}
          label={'Код домофона '}
          secondLabel={'(не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',
            maxLength: 4,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              nameRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={nameRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.name : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={''}
          showLabel={true}
          label={'Название (дом, работа, друзья)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',
            maxLength: 10,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              commentaryRef.current?.focus();
            },
          }}
        />
        <NewBaseInput
          ref={commentaryRef}
          labelStyle={{paddingTop: 10}}
          value={route.params.address ? route.params.address.commentary : ''}
          styleInput={{
            height: 30,
            alignSelf: 'center',
            paddingTop: 0,
            paddingBottom: 7,
          }}
          styleContainer={{}}
          editable={true}
          placeholder={'Например, “Домофон не работет”'}
          showLabel={true}
          secondLabel={'(не обязательно)'}
          label={'Комментарий к заказу '}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',
            placeholderTextColor: '#00000033',
            maxLength: 30,
            returnKeyType: 'done',
          }}
        />
        {route.params.type === 'edit' && (
          <Pressable
            onPress={() => deleteAddress()}
            android_ripple={{color: 'gray', radius: 200}}
            style={{
              width: 80,
              height: 30,
              marginTop: 26,
              marginLeft: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <StyledText
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: '#28B3C6',
              }}>
              Удалить
            </StyledText>
          </Pressable>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

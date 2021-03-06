import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {withFont} from '../_CustomComponents/HOC/withFont';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import NewBaseInput, {InputRefType} from '../_CustomComponents/NewBaseInput';
import auth from '@react-native-firebase/auth';
import {setCurrentAddress} from '../../redux/UserDataSlice';
import {useAppDispatch} from '../../redux';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'AddEditAddress'>;
  route: RouteProp<AppStackParamList, 'AddEditAddress'>;
};
export default function AddEditAddressScreen({navigation, route}: Props) {
  const StyledText = withFont(Text);
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
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
          <View style={{borderRadius: 15, overflow: 'hidden'}}>
            <Pressable
              onPress={() => {
                if (route.params.type === 'add') {
                  addAddress();
                } else {
                  updateAddress();
                }
              }}
              android_ripple={{color: '#F3F2F8', radius: 200}}
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
                ????????????
              </StyledText>
            </Pressable>
          </View>
        ),
    });
  }, [navigation, loadingToolbar, route.params.type]);

  function addAddress() {
    if (
      !homeRef.current?.getValue() ||
      !flatRef.current?.getValue() ||
      !streetRef.current?.getValue()
    ) {
      Alert.alert(
        '????????????',
        '?????????????????? ???????????????????????? ???????? (??????, ????????????????, ??????????)',
      );
      return;
    }

    setLoadingToolbar(true);
    firestore()
      .collection('????????????????????????')
      .doc(auth().currentUser?.uid)
      .collection('????????????')
      .add({
        ????????????????: nameRef.current?.getValue(),
        ??????: homeRef.current?.getValue(),
        ????????????????: flatRef.current?.getValue(),
        ??????????????????????: codeRef.current?.getValue(),
        ??????????????????????: commentaryRef.current?.getValue(),
        ??????????????: entranceRef.current?.getValue(),
        ??????????: streetRef.current?.getValue(),
        ????????: floorRef.current?.getValue(),
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
      !homeRef.current?.getValue() ||
      !flatRef.current?.getValue() ||
      !streetRef.current?.getValue()
    ) {
      Alert.alert(
        '????????????',
        '?????????????????? ???????????????????????? ???????? (??????, ????????????????, ??????????)',
      );
      return;
    }

    setLoadingToolbar(true);

    firestore()
      .collection('????????????????????????')
      .doc(auth().currentUser?.uid)
      .collection('????????????')
      .doc(route.params.address?.id)
      .update({
        ????????????????: nameRef.current?.getValue(),
        ??????: homeRef.current?.getValue(),
        ????????????????: flatRef.current?.getValue(),
        ??????????????????????: codeRef.current?.getValue(),
        ??????????????????????: commentaryRef.current?.getValue(),
        ??????????????: entranceRef.current?.getValue(),
        ??????????: streetRef.current?.getValue(),
        ????????: floorRef.current?.getValue(),
      })
      .then(_ => {
        // console.log('res', res);
        setLoadingToolbar(false);
        navigation.goBack();
        dispatch(setCurrentAddress(undefined));
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
      .collection('????????????????????????')
      .doc(auth().currentUser?.uid)
      .collection('????????????')
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
          label={'??????????'}
          maxLength={30}
          textContentType={'streetAddressLine1'}
          keyboardType={'default'}
          secondLabel={' *'}
          secondLabelColor={'red'}
          onSubmitEditing={() => {
            console.log('onSubmitEditing');
            homeRef.current?.focus();
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
          label={'?????? (????????????, ????????????????)'}
          secondLabel={' *'}
          secondLabelColor={'red'}
          textContentType={'streetAddressLine2'}
          keyboardType={'default'}
          onSubmitEditing={() => {
            flatRef.current?.focus();
          }}
          maxLength={4}
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
          maxLength={4}
          label={'????????????????'}
          secondLabel={' *'}
          secondLabelColor={'red'}
          textContentType={'none'}
          onSubmitEditing={() => {
            entranceRef.current?.focus();
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
          label={'?????????????? '}
          maxLength={2}
          textContentType={'none'}
          onSubmitEditing={() => {
            floorRef.current?.focus();
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
          maxLength={2}
          label={'???????? '}
          textContentType={'none'}
          onSubmitEditing={() => {
            codeRef.current?.focus();
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
          label={'?????? ???????????????? '}
          maxLength={4}
          onSubmitEditing={() => {
            nameRef.current?.focus();
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
          placeholder={'??????, ????????????, ????????????'}
          placeholderTextColor={'#00000033'}
          showLabel={true}
          maxLength={10}
          returnKeyType={'next'}
          label={'???????????????? '}
          onSubmitEditing={() => {
            commentaryRef.current?.focus();
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
          placeholder={'????????????????, ????????????????? ???? ???????????????????'}
          showLabel={true}
          label={'?????????????????????? ?? ???????????? '}
          maxLength={30}
          keyboardType={'default'}
          textContentType={'none'}
          returnKeyType={'done'}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          placeholderTextColor={'#00000033'}
        />
        {route.params.type === 'edit' && (
          <Pressable
            onPress={() =>
              Alert.alert('??????????????????', '???? ???????????????', [
                {style: 'default', text: '??????'},
                {
                  style: 'destructive',
                  text: '????',
                  onPress: () => deleteAddress(),
                },
              ])
            }
            android_ripple={{color: '#F3F2F8', radius: 200}}
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
                color: '#FF0000',
              }}>
              ??????????????
            </StyledText>
          </Pressable>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

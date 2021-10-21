import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseInput from '../_CustomComponents/BaseInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {withFont} from '../_CustomComponents/HOC/withFont';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'AddEditAddress'>;
  route: RouteProp<AppStackParamList, 'AddEditAddress'>;
};
export default function AddEditAddressScreen({navigation, route}: Props) {
  const StyledText = withFont(Text);
  const {width} = useWindowDimensions();
  const [street, setStreet] = useState<string>('');
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {}}
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
  }, [navigation]);

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
        <BaseInput
          labelStyle={{}}
          value={street}
          onTextChanges={term => setStreet(term)}
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
          label={'Улица'}
          inputProps={{
            textContentType: 'streetAddressLine1',
            keyboardType: 'default',
            maxLength: 30,
            returnKeyType: 'next',
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          label={'Подъезд (не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',

            maxLength: 2,
            returnKeyType: 'next',
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          label={'Этаж (не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',

            maxLength: 2,
            returnKeyType: 'next',
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          label={'Код домофона (не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',

            maxLength: 4,
            returnKeyType: 'next',
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          }}
        />
        <BaseInput
          labelStyle={{paddingTop: 10}}
          value={''}
          onTextChanges={() => {}}
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
          label={'Комментарий к заказу (не обязательно)'}
          inputProps={{
            textContentType: 'none',
            keyboardType: 'default',

            placeholderTextColor: '#00000033',
            maxLength: 30,
            returnKeyType: 'done',
          }}
        />
        <Pressable
          onPress={() => {}}
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
      </View>
    </KeyboardAwareScrollView>
  );
}

import React, {useState} from 'react';
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {getFontName, withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import auth from '@react-native-firebase/auth';
import {RouteProp} from '@react-navigation/native';
import {window} from '../../utils/scaling';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'CheckPhone'>;
  route: RouteProp<AppStackParamList, 'CheckPhone'>;
};
const StyledText = withFont(Text);
export default function CheckPhoneScreen({navigation, route}: Props) {
  console.log('route.params.tempName', route.params.tempName);

  function onPress() {
    firestore()
      .collection('Пользователи')
      .where('Телефон', '==', route.params.phone)
      .get()
      .then(res => {
        if (!res.empty) {
          Alert.alert(
            'Ошибка',
            'Пользователь с этим номером уже зарегистрирован',
          );
        } else {
          navigation.navigate('EnterName', {
            phone: route.params.phone,
            tempName: route.params.tempName,
          });
        }
      })
      .catch(er => {
        Alert.alert(
          'Ошибка',
          'Произошла ошибка с кодом ' + er.code + ', повторите попытку позже',
        );
      });
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <StyledText
        style={{
          fontWeight: '700',
          color: 'black',
          fontSize: 24,
          textAlign: 'center',
        }}>
        Проверьте правильность введенного номера
      </StyledText>
      <StyledText
        style={{
          marginTop: 18,
          fontSize: 15,
          textAlign: 'center',
          width: window().width - 50,
          color: 'black',
        }}>
        В дальнейшем его будет невозможно поменять
      </StyledText>
      <StyledText
        style={{
          fontSize: 24,
          marginTop: 30,
          marginBottom: 30,
          fontWeight: '700',
        }}>
        {route.params.formattedPhone}
      </StyledText>

      <BaseButton
        containerStyle={{}}
        text={'Изменить номер'}
        onPress={() =>
          navigation.navigate('EditPhone', {
            phone: route.params.phone,
            tempName: route.params.tempName,
          })
        }
      />
      <View style={{height: 16}} />
      <BaseButton
        containerStyle={{
          backgroundColor: 'white',
          borderColor: '#28B3C6',
          borderWidth: 2,
        }}
        textStyle={{color: '#28B3C6', fontSize: 18}}
        text={'Да, номер верный'}
        onPress={() => {
          onPress();
        }}
      />
    </View>
  );
}

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
import TextInputMask from 'react-native-text-input-mask';
import firestore from '@react-native-firebase/firestore';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'EditPhone'>;
  route: RouteProp<AppStackParamList, 'EditPhone'>;
};
const StyledText = withFont(Text);
export default function EditPhoneScreen({navigation, route}: Props) {
  const [phone, setPhone] = useState<string>('');
  const [formattedPhone, setFormattedPhone] = useState<string>('');
  const {width} = useWindowDimensions();

  function onPress() {
    firestore()
      .collection('Пользователи')
      .where('Телефон', '==', '+7' + phone)
      .get()
      .then(res => {
        console.log('res', res);
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
        Введите верный номер
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
      <TextInputMask
        autoFocus={true}
        style={{
          borderColor: '#00000026',
          borderWidth: 1,
          borderRadius: 10,
          width: width - 90,
          textAlign: 'center',
          fontSize: 24,
          height: 53,
          marginTop: 30,
          fontFamily: getFontName('700'),
        }}
        keyboardType={'phone-pad'}
        onChangeText={(formatted, extracted) => {
          setPhone(extracted ? extracted : '');
          setFormattedPhone(formatted);
        }}
        placeholder={'+7 (000) 000 00 00'}
        mask={'+7 ([000]) [000] [00] [00]'}
      />
      <View style={{height: 30}} />
      <BaseButton
        containerStyle={{
          backgroundColor: phone.length < 10 ? '#00000026' : '#28B3C6',
        }}
        active={phone.length === 10}
        text={'Продолжить'}
        onPress={() => {
          if (phone.length === 10) {
            onPress();
          }
        }}
      />
    </View>
  );
}

import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {getFontName, withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import TextInputMask from 'react-native-text-input-mask';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'EnterPhone'>;
};
const StyledText = withFont(Text);
export default function EnterPhoneScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const [phone, setPhone] = useState<string>('');
  const [formattedPhone, setFormattedPhone] = useState<string>('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{borderRadius: 20, overflow: 'hidden', marginLeft: 10}}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            android_ripple={{color: 'gray', radius: 200}}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../../assets/closeAuth.png')}
            />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <StyledText
        style={{
          fontWeight: '700',
          marginTop: 30,
          fontSize: 24,
          textAlign: 'center',
          lineHeight: 29,
          width: width - 50,
        }}>
        Для оформления заказа нужен Ваш телефон
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
      <StyledText
        onPress={() => {}}
        style={{
          marginTop: 11,
          fontWeight: '400',
          textAlign: 'center',
          fontSize: 12,
          lineHeight: 15,
          color: '#00000066',
          width: width - 40,
        }}>
        {'Продолжая, Вы соглашаетесь '}
        <StyledText style={{textDecorationLine: 'underline'}}>
          со сбором, обработкой персональных данных и Пользовательским
          соглашением
        </StyledText>
      </StyledText>
      <View
        style={{
          marginTop: 10,
          width,
          alignItems: 'center',
        }}>
        <BaseButton
          containerStyle={{
            backgroundColor: phone.length < 10 ? '#00000026' : '#28B3C6',
          }}
          active={phone.length === 10}
          text={'Продолжить'}
          onPress={() => {
            if (phone.length === 10) {
              navigation.navigate('EnterCode', {
                phone: '+7' + phone,
                formattedPhone,
              });
            }
          }}
        />
      </View>
    </View>
  );
}

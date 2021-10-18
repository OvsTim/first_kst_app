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
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import {withPressable} from '../_CustomComponents/HOC/withPressable';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Profile'>;
};
const Button = withPressable(View);
export default function ProfileScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);

  const [auth, setAuth] = useState<boolean>(false);

  function renderUnauthorized() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <Image
          style={{width: width - 50, height: 300}}
          source={require('../../assets/ph_profile.png')}
        />
        <StyledText
          style={{
            fontWeight: '700',
            fontSize: 30,
            color: 'black',
            marginTop: 20,
          }}>
          Давайте знакомиться!
        </StyledText>
        <StyledText
          style={{
            fontWeight: '400',
            width: width - 50,
            fontSize: 17,
            lineHeight: 18,
            color: 'black',
            textAlign: 'center',
            marginTop: 8,
          }}>
          Подарим подарок на день рождения, сохраним адрес доставки и расскажем
          об акциях
        </StyledText>
        <View style={{height: 27}} />
        <BaseButton
          width={width - 66 - 67}
          text={'Указать телефон'}
          onPress={() => {
            navigation.setOptions({headerShown: false});
            setAuth(true);
          }}
        />
      </View>
    );
  }

  function renderAuthorized() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <View style={{height: 25}} />
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 18}} />
          <Button onPress={() => {}} containerStyle={{}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StyledText
                style={{fontWeight: '500', fontSize: 15, color: 'black'}}>
                ТРЦ Костанай Плаза
              </StyledText>
              <Image
                style={{width: 12.5, height: 7.12, marginLeft: 9}}
                source={require('../../assets/droprdown.png')}
              />
            </View>
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 50,
            width,
            alignItems: 'center',
          }}>
          <StyledText
            style={{
              fontWeight: '700',
              fontSize: 30,
              color: 'black',
              marginLeft: 18,
            }}>
            Александр
          </StyledText>
          <View
            style={{
              borderRadius: 15,
              overflow: 'hidden',
              position: 'absolute',
              right: 17,
            }}>
            <Button
              onPress={() => navigation.navigate('Settings')}
              containerStyle={{
                backgroundColor: '#F3F3F7',
                width: 30,
                height: 30,
              }}>
              <Image
                style={{width: 18, height: 18}}
                source={require('../../assets/settings.png')}
              />
            </Button>
          </View>
        </View>
        <Pressable
          style={{
            width,
            height: 68,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => {}}
          android_ripple={{color: 'gray', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 18,
              paddingRight: 11,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              Бонусы
            </StyledText>
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            width,
            height: 68,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => navigation.navigate('DeliveryList')}
          android_ripple={{color: 'gray', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 18,
              paddingRight: 11,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              Адреса доставки
            </StyledText>
            <StyledText
              style={{
                position: 'absolute',
                right: 24,
                fontWeight: '500',
                fontSize: 15,
                color: '#0000004D',
              }}>
              2
            </StyledText>
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
        <Pressable
          style={{
            width,
            height: 68,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => navigation.navigate('History')}
          android_ripple={{color: 'gray', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 18,
              paddingRight: 11,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              История заказов
            </StyledText>
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
      </View>
    );
  }

  return auth ? renderAuthorized() : renderUnauthorized();
}

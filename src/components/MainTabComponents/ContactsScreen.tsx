import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import BaseButton from '../_CustomComponents/BaseButton';
import {withFont} from '../_CustomComponents/HOC/withFont';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Contacts'>;
};
const StyledText = withFont(Text);
export default function ContactsScreen({navigation}: Props) {
  function renderImageAndButton() {
    return (
      <>
        <ImageBackground
          style={{
            width: width - 160,
            height: width - 160,
            marginTop: 37,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          source={require('../../assets/map.png')}>
          <BaseButton
            containerStyle={{}}
            text={'Рестораны на карте'}
            onPress={() => {}}
          />
          <View style={{height: 19}} />
        </ImageBackground>
      </>
    );
  }

  function renderContactsCallWhatsApp() {
    return (
      <>
        <StyledText
          style={{
            fontSize: 24,
            fontWeight: '700',
            alignSelf: 'flex-start',
            marginLeft: 19,
            marginTop: 60,
          }}>
          Контакты
        </StyledText>
        <View
          style={{
            width,
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 16,
            paddingBottom: 50,
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}>
          <BaseButton
            textStyle={{color: '#046674', fontSize: 15}}
            containerStyle={{
              backgroundColor: '#BEE8EE',
              width: width / 2 - 13 - 34,
            }}
            text={'Позвонить'}
            onPress={() => {}}
          />
          <View style={{width: 13}} />
          <BaseButton
            textStyle={{color: '#046674', fontSize: 15}}
            containerStyle={{
              backgroundColor: '#BEE8EE',
              width: width / 2 - 13 - 34,
            }}
            text={'WhatsApp'}
            onPress={() => {}}
          />
        </View>
      </>
    );
  }

  function renderSocials() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width,
          justifyContent: 'center',
          marginTop: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#F2F2F6',
        }}>
        <View style={{overflow: 'hidden', borderRadius: 24}}>
          <Pressable
            onPress={() => {}}
            android_ripple={{color: 'gray', radius: 200}}>
            <Image
              style={{width: 48, height: 48}}
              source={require('../../assets/inst.png')}
            />
          </Pressable>
        </View>
        <View style={{width: 20}} />
        <View style={{overflow: 'hidden', borderRadius: 24}}>
          <Pressable
            onPress={() => {}}
            android_ripple={{color: 'gray', radius: 200}}>
            <Image
              style={{width: 48, height: 48}}
              source={require('../../assets/vk.png')}
            />
          </Pressable>
        </View>
        <View style={{width: 20}} />
        <View style={{overflow: 'hidden', borderRadius: 24}}>
          <Pressable
            onPress={() => {}}
            android_ripple={{color: 'gray', radius: 200}}>
            <Image
              style={{width: 48, height: 48}}
              source={require('../../assets/youtube.png')}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  function renderMoreInfoAndAbout() {
    return (
      <>
        <Pressable
          style={{
            width,
            height: 77,
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
              paddingLeft: 21,
              paddingRight: 18,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              Дополнительная информация
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
            height: 77,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F6',
          }}
          onPress={() => navigation.navigate('About')}
          android_ripple={{color: 'gray', radius: 200}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 21,
              paddingRight: 18,
            }}>
            <StyledText style={{fontSize: 20, fontWeight: '500'}}>
              О приложении
            </StyledText>
            <Image
              style={{width: 7, height: 12}}
              source={require('../../assets/arrow_forward.png')}
            />
          </View>
        </Pressable>
        <View style={{height: 30}} />
      </>
    );
  }

  const {width} = useWindowDimensions();
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      {renderImageAndButton()}
      {renderContactsCallWhatsApp()}
      {renderSocials()}
      {renderMoreInfoAndAbout()}
    </ScrollView>
  );
}

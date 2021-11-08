import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import BaseButton from '../_CustomComponents/BaseButton';
import {withFont} from '../_CustomComponents/HOC/withFont';
import firestore from '@react-native-firebase/firestore';
import {openWhatsApp} from '../../utils/linkingUtils';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Contacts'>;
};
const StyledText = withFont(Text);
export default function ContactsScreen({navigation}: Props) {
  const [contactsData, setContactsData] = useState<Record<string, string>>({});

  React.useEffect(() => {
    firestore()
      .collection('Контакты')
      .doc('Данные')
      .get()
      .then(res => {
        if (res.exists) {
          let data: Record<string, string> = {};
          data.whatsapp = res.get<string>('whatsapp');
          data.phone = res.get<string>('phone');

          data.instagram = res.get<string>('instagram');
          if (res.get<string>('vk') !== '') {
            data.vk = res.get<string>('vk');
          }

          if (res.get<string>('youtube') !== '') {
            data.youtube = res.get<string>('youtube');
          }

          setContactsData(data);
        }
      });
  }, []);

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
            containerStyle={{width: 250}}
            text={'Рестораны на карте'}
            onPress={() =>
              navigation.navigate('ChangeRestaraunt', {activeTab: 1})
            }
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
            textStyle={{color: '#046674', fontSize: 18}}
            containerStyle={{
              backgroundColor: '#BEE8EE',
              width: width / 2 - 13 - 34,
            }}
            text={'Позвонить'}
            onPress={() => {
              if (contactsData.phone) {
                Linking.openURL('tel:' + contactsData.phone);
              }
            }}
          />
          <View style={{width: 13}} />
          <BaseButton
            textStyle={{color: '#046674', fontSize: 18}}
            containerStyle={{
              backgroundColor: '#BEE8EE',
              width: width / 2 - 13 - 34,
            }}
            text={'WhatsApp'}
            onPress={() => {
              if (contactsData.whatsapp) {
                openWhatsApp(contactsData.whatsapp);
              }
            }}
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
          height: 89 - 20,
          justifyContent: 'center',
          marginTop: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#F2F2F6',
        }}>
        {contactsData.instagram && (
          <View style={{overflow: 'hidden', borderRadius: 24}}>
            <Pressable
              onPress={() => {
                Linking.openURL(contactsData.instagram);
              }}
              android_ripple={{color: 'lightgrey', radius: 200}}>
              <Image
                style={{width: 48, height: 48}}
                source={require('../../assets/inst.png')}
              />
            </Pressable>
          </View>
        )}
        {contactsData.vk && (
          <>
            <View style={{width: 20}} />
            <View style={{overflow: 'hidden', borderRadius: 24}}>
              <Pressable
                onPress={() => Linking.openURL(contactsData.vk)}
                android_ripple={{color: 'lightgrey', radius: 200}}>
                <Image
                  style={{width: 48, height: 48}}
                  source={require('../../assets/vk.png')}
                />
              </Pressable>
            </View>
          </>
        )}
        {contactsData.youtube && (
          <>
            <View style={{width: 20}} />
            <View style={{overflow: 'hidden', borderRadius: 24}}>
              <Pressable
                onPress={() => Linking.openURL(contactsData.youtube)}
                android_ripple={{color: 'lightgrey', radius: 200}}>
                <Image
                  style={{width: 48, height: 48}}
                  source={require('../../assets/youtube.png')}
                />
              </Pressable>
            </View>
          </>
        )}
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
          android_ripple={{color: 'lightgrey', radius: 200}}>
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
          android_ripple={{color: 'lightgrey', radius: 200}}>
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
      <FocusAwareStatusBar
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

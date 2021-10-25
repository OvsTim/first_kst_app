import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {useAppDispatch} from '../../redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {hScale, vScale, window} from '../../utils/scaling';
import {setAuthData} from '../../redux/UserDataSlice';
import auth from '@react-native-firebase/auth';
import {getFontName, withFont} from '../_CustomComponents/HOC/withFont';
// @ts-ignore
import TabSelectorAnimation from 'react-native-tab-selector';
// @ts-ignore
import firestore, {DocumentReference} from '@react-native-firebase/firestore';
import {Restaraunt} from '../../API';
import BaseButton from '../_CustomComponents/BaseButton';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import YaMap, {Marker} from 'react-native-yamap';
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'SearchShop'>;
};

export default function SelectShopScreen({}: Props) {
  const StyledText = withFont(Text);
  const mapref = useRef<YaMap>(null);

  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();
  // If null, no SMS has been sent
  const [indexTab, setIndexTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

  const [list, setList] = useState<Array<Restaraunt>>(
    Array(5).fill({
      id: '',
      address: '',
      phone: '',
      name: '',
      delivery: {},
      workHours: {},
      recommendations: [],
      outOfStock: [],
      coords: {lat: 0, lan: 0},
    }),
  );
  const [location, setLocation] = useState<{lat: number; lng: number}>({
    lat: 0,
    lng: 0,
  });
  const DATA = [{title: 'Списком'}, {title: 'На карте'}];
  const array = [
    {lat: 50, lon: 50},
    {lat: 50.234, lon: 50.234},
    {lat: 50.345, lon: 50.345},
  ];
  useEffect(() => {
    setLoading(true);
    auth()
      .signInAnonymously()
      .then(() => {
        firestore()
          .collection('Рестораны')
          .get()
          .then(res => {
            let newList: Array<Restaraunt> = [];
            res.docs.forEach(rest => {
              let newRest: Restaraunt = {
                address: rest.get<string>('Адрес')
                  ? rest.get<string>('Адрес')
                  : '',
                id: rest.id,
                name: rest.get<string>('Имя') ? rest.get<string>('Имя') : '',
                phone: rest.get<string>('Телефон')
                  ? rest.get<string>('Телефон')
                  : '',
                // @ts-ignore
                coords: rest.get<firestore.GeoPoint>('Координаты')
                  ? {
                      // @ts-ignore
                      lat: rest.get<firestore.GeoPoint>('Координаты').latitude,
                      // @ts-ignore
                      lan: rest.get<firestore.GeoPoint>('Координаты').longitude,
                    }
                  : {lan: 0, lat: 0},
                outOfStock: rest.get<Array<DocumentReference>>('Отсутствует'),
                recommendations: rest.get<Array<DocumentReference>>(
                  'Рекомендации',
                ),
                delivery: rest.get<Record<string, string>>('Доставка'),
                workHours: rest.get<Record<string, string>>('РежимРаботы'),
              };
              newList.push(newRest);
            });
            console.log('newList', newList);
            setList(newList);
            setLoading(false);
          });
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (indexTab === 1) {
      mapref.current?.fitAllMarkers();
    }
  }, [indexTab]);

  //region handlers
  function getPermissions() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Сообщение',
          message:
            'Для корректного расчета вашего местоположения требуется разрешение',
          buttonPositive: 'Ок',
          buttonNeutral: 'Позже',
          buttonNegative: 'Отмена',
        },
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getGeolocation();
        }
      });
    } else {
      Geolocation.requestAuthorization('whenInUse').then(result => {
        if (result === 'granted' || result === 'restricted') {
          getGeolocation();
        }
      });
    }
  }

  function getGeolocation() {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }

  //endregion handlers

  //region jsx

  function renderRestItem(item: Restaraunt) {
    return (
      <Pressable
        style={{
          width,
          height: 75,

          paddingLeft: 18,
        }}
        onPress={() => {
          dispatch(
            setAuthData({
              token: 'new token kjhfkjdhgkdshf',
              user_id: '123',
              phone: '+789789494',
              surname: 'Фомин',
              name: 'Илья',
              last_name: 'Вячеславович',
            }),
          );
        }}
        android_ripple={{color: 'gray', radius: 200}}>
        <View
          style={{
            width,
            height: 75,
            borderBottomWidth: 0.5,
            borderBottomColor: '#9E989B',
            paddingTop: 13,
          }}>
          <ShimmerPlaceHolder
            visible={!loading}
            style={{
              width: width - 40,
            }}>
            <StyledText
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 18,
              }}>
              {item.name}
            </StyledText>
          </ShimmerPlaceHolder>

          <ShimmerPlaceHolder
            style={{width: width - 40, marginTop: 7}}
            visible={!loading}>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
              }}>
              <StyledText
                style={{
                  fontWeight: '500',
                  fontSize: 15,
                  color: '#696E79',
                }}>
                C 10:00 до 20:00
              </StyledText>
              {location.lng !== 0 && (
                <>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      marginLeft: 26,
                      marginRight: 8,
                    }}
                    source={require('../../assets/Walking.png')}
                  />

                  <StyledText
                    style={{fontWeight: '500', fontSize: 15, color: '#696E79'}}>
                    {(
                      getDistance(
                        {lat: location.lat, lng: location.lng},
                        {lat: item.coords.lat, lng: item.coords.lan},
                      ) / 1000
                    ).toFixed(1) + ' км'}
                  </StyledText>
                </>
              )}
            </View>
          </ShimmerPlaceHolder>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      {indexTab === 0 && (
        <>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={list}
            scrollEnabled={false}
            renderItem={({item}) => renderRestItem(item)}
          />

          <View style={{position: 'absolute', bottom: 120}}>
            <BaseButton
              text={'Узнать местоположение'}
              onPress={() => getPermissions()}
            />
          </View>
        </>
      )}
      {indexTab === 1 && (
        <YaMap
          style={{
            width,
            height: Dimensions.get('window').height - 100,
          }}
          ref={mapref}
          onMapPress={() => console.log('onMapPress')}>
          {list.map((rest, index) => (
            <Marker
              key={index}
              point={{lat: rest.coords.lat, lon: rest.coords.lan}}
              onPress={() => {
                Alert.alert('123');
              }}
              source={require('../../assets/marker.png')}
            />
          ))}
        </YaMap>
      )}
      <View
        style={{
          height: 100,
          position: 'absolute',
          bottom: 0,
          borderTopColor: '#9E989B',
          borderTopWidth: 0.5,
          backgroundColor: '#F6F6F9',
          paddingTop: 14,
          width,
          alignItems: 'center',
        }}>
        <TabSelectorAnimation
          style={{width: width - 22, borderRadius: 9}}
          styleTab={{borderRadius: 9}}
          backgroundColor={'#7676801F'}
          onChangeTab={setIndexTab}
          styleTitle={{fontSize: 15, fontFamily: getFontName('400')}}
          tabs={DATA}
        />
      </View>
    </View>
  );
  //endregion jsx
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'flex-start'},
  text: {
    color: 'black',
    fontSize: hScale(15),
    textAlign: 'center',
  },
  text_underline: {
    color: 'black',
    fontSize: hScale(15),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  text_input_mask: {
    width: window().width - hScale(32),
    height: vScale(44),
    paddingRight: hScale(32),
    paddingLeft: hScale(12),
    fontSize: vScale(14),
    backgroundColor: 'transparent',
    borderWidth: vScale(1),
    borderRadius: vScale(6),
    color: 'black',
  },
  logo: {
    width: hScale(249),
    height: vScale(52),
    marginTop: vScale(39),
  },
});

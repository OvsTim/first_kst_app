import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useAppDispatch, useSelector} from '../../redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {hScale, vScale, window} from '../../utils/scaling';
import {setActiveShop} from '../../redux/UserDataSlice';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {Restaraunt} from '../../API';
import BaseButton from '../_CustomComponents/BaseButton';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import YaMap, {Marker} from 'react-native-yamap';
import {Modalize} from 'react-native-modalize';
import {
  getTodayWorkingHour,
  getWorkHoursStringByMap,
  getWorkingNow,
} from '../../utils/workHourUtils';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '../../navigation/AppNavigator';
import SegmentedControl from 'rn-segmented-control';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'SearchShop'>;
  route: RouteProp<AppStackParamList, 'ChangeRestaraunt'>;
};

export default function SelectShopScreen({navigation, route}: Props) {
  const StyledText = withFont(Text);
  const mapref = useRef<YaMap>(null);
  const modalizeRef = useRef<Modalize>(null);
  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();
  const [indexTab, setIndexTab] = useState<number>(
    route.params && route.params.activeTab ? route.params.activeTab : 0,
  );
  const [shopIndex, setShopIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const list: Array<Restaraunt> = useSelector(state => state.data.shops);

  const [location, setLocation] = useState<{lat: number; lng: number}>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (indexTab === 1) {
      mapref.current?.fitAllMarkers();
      setShopIndex(-1);
    }
  }, [indexTab]);

  useEffect(() => {
    if (list[0] && list[0].name) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [list]);

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
          if (!item.id) {
            return;
          }

          dispatch(setActiveShop(item.id));
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        android_ripple={{color: 'lightgrey', radius: 200}}>
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
                {getTodayWorkingHour(item.workHours)}
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
        <>
          <YaMap
            style={{
              width,
              height: Dimensions.get('window').height - 100,
            }}
            ref={mapref}
            onMapPress={() => console.log('onMapPress')}>
            {list.map((rest, index) => (
              <Marker
                scale={Platform.OS !== 'ios' ? 0.3 : 1}
                key={index}
                point={{lat: rest.coords.lat, lon: rest.coords.lan}}
                onPress={() => {
                  mapref.current?.getCameraPosition(position => {
                    mapref.current?.setCenter({
                      lat: rest.coords.lat - 0.015,
                      lon: rest.coords.lan,
                      zoom: position.zoom,
                    });
                    setShopIndex(index);
                  });
                }}
                source={require('../../assets/marker.png')}
              />
            ))}
          </YaMap>

          <Modalize
            // withHandle={false}
            ref={modalizeRef}
            rootStyle={{zIndex: 900}}
            modalStyle={{borderRadius: 15}}
            alwaysOpen={shopIndex === -1 ? 0 : 350}
            handlePosition="inside">
            {shopIndex !== -1 && (
              <View style={{paddingTop: 50, paddingHorizontal: 18}}>
                <StyledText
                  style={{
                    width: width - 36,
                    fontWeight: '700',
                    fontSize: 18,
                    color: 'black',
                  }}>
                  {list[shopIndex].name}
                </StyledText>
                <StyledText
                  style={{
                    width: width - 36,
                    fontWeight: '500',
                    fontSize: 18,
                    marginTop: 7,
                    color: 'black',
                  }}>
                  {list[shopIndex].address}
                </StyledText>
                <StyledText
                  style={{
                    width: width - 36,
                    fontWeight: '500',
                    fontSize: 18,
                    marginTop: 7,
                    color: '#28B3C6',
                  }}>
                  {getWorkingNow(list[shopIndex].workHours)}
                </StyledText>
                <View
                  style={{
                    marginTop: 25,

                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <StyledText
                    style={{fontWeight: '400', color: 'black', fontSize: 18}}>
                    Доставка
                  </StyledText>
                  <StyledText
                    style={{
                      fontWeight: '500',
                      width: width / 2,
                      textAlign: 'right',

                      color: '#696E79',
                      fontSize: 18,
                    }}>
                    {getWorkHoursStringByMap(list[shopIndex].delivery)}
                  </StyledText>
                </View>

                <View
                  style={{
                    marginTop: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <StyledText
                    style={{fontWeight: '400', color: 'black', fontSize: 18}}>
                    Ресторан
                  </StyledText>
                  <StyledText
                    style={{
                      fontWeight: '500',
                      width: width / 2,
                      textAlign: 'right',
                      color: '#696E79',
                      fontSize: 18,
                    }}>
                    {getWorkHoursStringByMap(list[shopIndex].workHours)}
                  </StyledText>
                </View>

                <View
                  style={{
                    marginTop: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <StyledText
                    style={{fontWeight: '400', color: 'black', fontSize: 18}}>
                    Телефон
                  </StyledText>
                  <Pressable
                    android_ripple={{color: 'lightgrey', radius: 200}}
                    onPress={() =>
                      Linking.openURL('tel:' + list[shopIndex].phone)
                    }>
                    <StyledText
                      style={{
                        fontWeight: '500',
                        color: '#28B3C6',
                        fontSize: 18,
                      }}>
                      {list[shopIndex].phone}
                    </StyledText>
                  </Pressable>
                </View>
              </View>
            )}
          </Modalize>
          {shopIndex !== -1 && (
            <View
              style={{
                position: 'absolute',
                bottom: 100,
                zIndex: 999,
                width,
                height: 90,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <BaseButton
                text={'Забрать здесь'}
                onPress={() => {
                  dispatch(setActiveShop(list[shopIndex].id));
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
              />
            </View>
          )}
        </>
      )}

      <View
        style={{
          zIndex: 999,
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
        <SegmentedControl
          paddingVertical={6}
          width={width - 22}
          theme={'LIGHT'}
          currentIndex={indexTab}
          containerStyle={{
            borderRadius: 9,
            zIndex: 999,
            backgroundColor: '#7676801F',
          }}
          tileStyle={{borderRadius: 9}}
          activeTextColor={'black'}
          textColor={'rgba(0, 0, 0, 0.8)'}
          activeSegmentBackgroundColor={'white'}
          segmentedControlBackgroundColor={'#DBDBDB'}
          textStyle={{
            fontSize: 15,
            fontFamily: 'SFProDisplay-Regular',
          }}
          activeTextWeight={'500'}
          onChange={event => {
            setShopIndex(-1);
            setIndexTab(event);
          }}
          // styleTitle={{fontSize: 15, fontFamily: getFontName('400')}}
          tabs={['Списком', 'На карте']}
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

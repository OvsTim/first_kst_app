import React, {useState} from 'react';
import {
  Alert,
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
import firestore from '@react-native-firebase/firestore';
import {Address} from '../../API';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '../../redux';
import {setAddresses, setCurrentAddress} from '../../redux/UserDataSlice';
import {hScale, vScale} from '../../utils/scaling';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'DeliveryList'>;
  route: RouteProp<AppStackParamList, 'DeliveryList'>;
};
export default function DeliveryListScreen({navigation, route}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const dispatch = useAppDispatch();
  const [addressList, setAddressList] = useState<Array<Address>>(
    Array(5).fill({
      id: '',
      name: '',
      street: '',
      house: '',
      flat: '',
      code: '',
      commentary: '',
      entrance: '',
      floor: '',
    }),
  );

  useFocusEffect(
    React.useCallback(() => {
      firestore()
        .collection('Пользователи')
        .doc(auth().currentUser?.uid)
        .collection('Адреса')
        .where('Улица', '!=', '')
        .get()
        .then(res => {
          let list: Array<Address> = [];
          res.docs.forEach(doc => {
            let newAddress: Address = {
              id: doc.id,
              name: doc.get<string>('Название')
                ? doc.get<string>('Название')
                : '',
              street: doc.get<string>('Улица'),
              house: doc.get<string>('Дом'),
              flat: doc.get<string>('Квартира'),
              code: doc.get<string>('КодДомофона')
                ? doc.get<string>('КодДомофона')
                : '',
              commentary: doc.get<string>('Комментарий')
                ? doc.get<string>('Комментарий')
                : '',
              entrance: doc.get<string>('Подъезд')
                ? doc.get<string>('Подъезд')
                : '',
              floor: doc.get<string>('Этаж') ? doc.get<string>('Этаж') : '',
            };
            list.push(newAddress);
          });
          setAddressList(list);
          dispatch(setAddresses(list));
        })
        .catch(er => console.log('er', er));
    }, []),
  );

  function deleteAddress(id: string) {
    firestore()
      .collection('Пользователи')
      .doc(auth().currentUser?.uid)
      .collection('Адреса')
      .doc(id)
      .delete()
      .then(res => {
        console.log('res', res);
        setAddressList(prevState => prevState.filter(it => it.id !== id));
      })
      .catch(er => console.log('er', er));
  }

  function renderEmpty() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={{width: vScale(375), height: hScale(279)}}
          source={require('../../assets/ph_delivery.png')}
        />
        <StyledText
          style={{
            fontWeight: '700',
            fontSize: 30,
            color: 'black',
            marginTop: 20,
          }}>
          Хмм, как Вас найти?
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
          Здесь будут храниться адреса доставки, которые вы сохранили.
        </StyledText>
        <View style={{height: 27}} />
        <BaseButton
          width={width - 66 - 67}
          text={'Добавить адрес'}
          onPress={() => {
            console.log('route', route);
            if (route.name === 'DeliveryList') {
              navigation.navigate('AddEditAddress', {type: 'add'});
            } else if (route.name === 'DeliveryListBasket') {
              navigation.navigate('AddEditAddressBasket', {type: 'add'});
            } else {
              navigation.navigate('AddEditAddressSelect', {type: 'add'});
            }
          }}
        />
      </View>
    );
  }

  function renderAddress(item: Address) {
    return (
      <Pressable
        style={{
          width,
          height: 60,
          flexDirection: 'row',
          paddingLeft: 14,
          alignItems: 'center',
          backgroundColor: 'white',
        }}
        disabled={item.street === '' ? true : null}
        onPress={() => {
          if (route.name === 'DeliveryList') {
            navigation.navigate('AddEditAddress', {
              address: item,
              type: 'edit',
            });
          } else {
            dispatch(setCurrentAddress(item));
            navigation.goBack();
          }
        }}
        android_ripple={{color: '#F3F2F8', radius: 200}}>
        <ShimmerPlaceHolder
          style={{width: width - 120}}
          visible={item.street !== ''}>
          <StyledText
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{
              fontWeight: '400',
              fontSize: 15,
              color: 'black',
              width: width - 120,
            }}>
            {item.street + ' ' + item.house + ', ' + item.flat}
          </StyledText>
        </ShimmerPlaceHolder>

        <View style={{position: 'absolute', right: 0, flexDirection: 'row'}}>
          <ShimmerPlaceHolder style={{width: 60}} visible={item.street !== ''}>
            {item.name !== '' ? (
              <View
                style={{
                  width: 60,
                  borderRadius: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#28B3C6',
                }}>
                <StyledText
                  style={{
                    fontSize: 10,
                    color: 'white',
                    fontWeight: '700',
                    width: 60,
                    textAlign: 'center',
                  }}>
                  {item.name}
                </StyledText>
              </View>
            ) : (
              <View />
            )}
          </ShimmerPlaceHolder>

          <Image
            style={{
              width: 8,
              height: 14,
              marginHorizontal: 14,
              alignSelf: 'center',
            }}
            source={require('../../assets/arrow_forward.png')}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      {addressList.length === 0 ? (
        renderEmpty()
      ) : (
        <SwipeListView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          // ListEmptyComponent={() => renderEmpty()}
          data={addressList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          closeOnRowOpen={true}
          closeOnRowPress={true}
          bounces={false}
          renderHiddenItem={(data, rowMap) => (
            <Pressable
              disabled={data.item.street === '' ? true : null}
              android_ripple={{color: '#F3F2F8', radius: 200}}
              onPress={() => {
                Alert.alert('Сообщение', 'Вы уверены?', [
                  {style: 'default', text: 'Нет'},
                  {
                    style: 'destructive',
                    text: 'Да',
                    onPress: () => {
                      rowMap[addressList.indexOf(data.item)].closeRow();
                      deleteAddress(data.item.id);
                      dispatch(setCurrentAddress(undefined));
                    },
                  },
                ]);
              }}
              style={{
                backgroundColor: 'red',
                width: 70,
                height: 60,
                position: 'absolute',
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <StyledText
                style={{color: 'white', fontSize: 12, fontWeight: '700'}}>
                Удалить
              </StyledText>
            </Pressable>
          )}
          rightOpenValue={-70}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => renderAddress(item)}
        />
      )}

      {addressList.length > 0 && (
        <>
          <BaseButton
            containerStyle={{width: width - 150}}
            text={'Добавить адрес'}
            onPress={() => {
              if (route.name === 'DeliveryList') {
                navigation.navigate('AddEditAddress', {type: 'add'});
              } else if (route.name === 'DeliveryListBasket') {
                navigation.navigate('AddEditAddressBasket', {type: 'add'});
              } else {
                navigation.navigate('AddEditAddressSelect', {type: 'add'});
              }
            }}
          />
          <View style={{height: 35}} />
        </>
      )}
    </View>
  );
}

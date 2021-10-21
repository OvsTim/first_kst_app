import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  InteractionManager,
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
import {useFocusEffect} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'DeliveryList'>;
};
const StyledText = withFont(Text);
export default function DeliveryListScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);

  const [addressList, setAddressList] = useState<Array<Address>>([]);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        firestore()
          .collection('Пользователи')
          //todo:user_id
          .doc('xlmoN94j09tWcC8mN9qQ')
          .collection('Адреса')
          .get()
          .then(res => {
            let list: Array<Address> = [];
            res.docs.forEach(doc => {
              let newAddress: Address = {
                name: doc.id,
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
          })
          .catch(er => console.log('er', er));
      });

      return () => task.cancel();
    }, []),
  );

  function renderEmpty() {
    return (
      <>
        <Image
          style={{width: width - 30, height: 300}}
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
          onPress={() => {}}
        />
      </>
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
        android_ripple={{color: 'gray', radius: 200}}>
        <StyledText style={{fontWeight: '400', fontSize: 15, color: 'black'}}>
          {item.street + ' ' + item.house + ', ' + item.flat}
        </StyledText>
        <View style={{position: 'absolute', right: 0, flexDirection: 'row'}}>
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
          <Image
            style={{width: 8, height: 14, marginHorizontal: 14}}
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
      <SwipeListView
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        ListEmptyComponent={() => renderEmpty()}
        data={addressList}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        bounces={false}
        renderHiddenItem={(data, rowMap) => (
          <Pressable
            android_ripple={{color: 'gray', radius: 200}}
            onPress={() => {
              rowMap[addressList.indexOf(data.item)].closeRow();
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
        renderItem={({item, index}) => renderAddress(item)}
      />
      {addressList.length > 0 && (
        <>
          <BaseButton
            containerStyle={{width: width - 150}}
            text={'Добавить адрес'}
            onPress={() => navigation.navigate('AddEditAddress', {type: 'add'})}
          />
          <View style={{height: 60}} />
        </>
      )}
    </View>
  );
}

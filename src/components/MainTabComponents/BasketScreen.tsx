import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import BaseButton from '../_CustomComponents/BaseButton';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import {BasketItem, deleteProduct} from '../../redux/BasketDataReducer';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {TENGE_LETTER} from './ProductItem';
import {ProductCountButton} from './ProductCountButton';
import {ImageMap} from '../../redux/UserDataSlice';
import {Restaraunt} from '../../API';
import {RecommendCard} from './RecommendCard';
import auth from '@react-native-firebase/auth';
import {hScale, vScale} from '../../utils/scaling';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useNetInfo} from '@react-native-community/netinfo';
import {getWorkingNow} from '../../utils/workHourUtils';
import {Category, OrderDeliveryType} from '../../redux/ProductsDataSlice';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Basket'>;
};

export default function BasketScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const StyledText = withFont(Text);
  const dispatch = useAppDispatch();
  const imagesMap: ImageMap = useSelector(
    (state: RootState) => state.data.images,
  );
  const orderDeliveryType: OrderDeliveryType = useSelector(
    (state: RootState) => state.data.orderDeliveryType,
  );
  const netinfo = useNetInfo();
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  const active: string = useSelector(
    (state: RootState) => state.data.activeShop,
  );
  const shops: Array<Restaraunt> = useSelector(
    (state: RootState) => state.data.shops,
  );
  const activeShop: Restaraunt =
    shops.filter(value => value.id === active).length > 0
      ? shops.filter(value => value.id === active)[0]
      : {
          id: '',
          phone: '',
          name: '',
          address: '',
          coords: {lat: 0, lan: 0},
          outOfStock: [],
          workHours: {},
          recommendations: [],
          delivery: {},
        };

  const categoriesMap: Record<string, Category> = useSelector(
    (state: RootState) => state.products.categories,
  );
  const [recommends, setRecommends] = useState<Array<string>>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let usedList: Array<string> = [];
    let resRecommendations: Array<string> = [];
    basket.forEach(it => {
      console.log('it.item.category', it.item.category);
      let curCat = it.item.category.replace('??????????????????/', '');
      console.log('categoriesMap[curCat]', categoriesMap[curCat]);
      console.log(
        'categoriesMap[curCat].recommendations',
        categoriesMap[curCat].recommendations,
      );

      if (
        categoriesMap[curCat] &&
        categoriesMap[curCat].recommendations &&
        !usedList.includes(it.item.category)
      ) {
        usedList.push(it.item.category);
        let recs = categoriesMap[curCat].recommendations;
        if (recs.length > 0) {
          resRecommendations.push(
            recs[Math.floor(Math.random() * recs.length)],
          );
        }
      }
    });
    setRecommends(resRecommendations);
    console.log('setRecommends', resRecommendations);
  }, [basket, categoriesMap]);

  useEffect(() => {
    console.log('recommends', recommends);
  }, [recommends]);

  function getNumberOfCounts() {
    return basket.reduce((a, b) => +a + +b.count, 0);
  }

  function getTotalPrice() {
    let price = 0;
    basket.forEach(it => {
      price = price + it.count * it.item.price;
    });
    return price;
  }

  function num_word(value: number, words: Array<string>) {
    value = Math.abs(value) % 100;
    let num = value % 10;
    if (value > 10 && value < 20) {
      return words[2];
    }

    if (num > 1 && num < 5) {
      return words[1];
    }

    if (num === 1) {
      return words[0];
    }

    return words[2];
  }

  function validateAll() {
    if (
      (orderDeliveryType === 'PICKUP' &&
        getWorkingNow(activeShop.workHours) === '??????????????') ||
      (orderDeliveryType === 'DELIVERY' &&
        getWorkingNow(activeShop.delivery) === '??????????????')
    ) {
      Alert.alert(
        '????????????',
        orderDeliveryType === 'DELIVERY'
          ? '???????????? ???????????????? ???????????? ???? ????????????????. ???????????????? ???????????? ????????????????'
          : '???????????? ???????????????? ???????????? ???? ????????????????. ???????????????? ???????????? ????????????????',
      );
      return;
    }

    console.log('blacklist', activeShop.outOfStock);
    let names: Array<string> = [];

    basket.forEach(it => {
      if (activeShop.outOfStock.includes('????????????????/' + it.item.id)) {
        names.push(it.item.name);
      }
    });
    if (names.length > 0) {
      Alert.alert(
        '????????????',

        names.join(' ') +
          ' ?????????????????????? ?? ???????????? ????????????. ?????????????? ?????????????????????????? ???????????? ???? ?????????????? ?? ?????????????????? ??????????????',
      );
      return;
    }

    navigation.navigate('OrderDelivery');
  }

  function renderBasketItem(basketItem: BasketItem) {
    return (
      <View style={{width, height: 190, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 36}} />
          <FastImage
            source={
              imagesMap[basketItem.item.picture_url]
                ? {uri: imagesMap[basketItem.item.picture_url]}
                : require('../../assets/img_ph.png')
            }
            style={{
              height: 94,
              width: width / 2 - 18,
              marginRight: 18,
              borderRadius: 11,
            }}
          />
          <View style={{justifyContent: 'flex-start'}}>
            <StyledText
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={{
                color: 'black',
                fontWeight: '400',
                fontSize: 15,
                width: width / 3,
              }}>
              {basketItem.item.name}
            </StyledText>
            {basketItem.item.description?.toString() !== '' && (
              <StyledText
                style={{
                  width: width / 3,
                  marginTop: 5,
                  color: '#00000080',
                  fontSize: 10,
                  fontWeight: '400',
                }}
                numberOfLines={3}
                ellipsizeMode={'tail'}>
                {basketItem.item.description?.toString()}
              </StyledText>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 18,
            marginHorizontal: 25,
            paddingVertical: 14,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: '#DCDCEB',
            borderBottomColor: '#DCDCEB',
          }}>
          <StyledText
            style={{
              color: 'black',
              fontSize: 15,
              fontWeight: '700',
              marginLeft: 10,
            }}>
            {basketItem.item.price + ' ' + TENGE_LETTER}
          </StyledText>
          <View style={{marginRight: 10}}>
            <ProductCountButton product={basketItem.item} />
          </View>
        </View>
      </View>
    );
  }

  function renderBasketList() {
    return (
      <SwipeListView
        ListHeaderComponent={() => (
          <StyledText
            style={{
              color: 'black',
              width: width - 50,
              marginTop: 25 + insets.top,
              marginBottom: 11,
              marginHorizontal: 25,
              fontWeight: '700',
              fontSize: 25,
            }}>
            {getNumberOfCounts() +
              ' ' +
              num_word(getNumberOfCounts(), ['??????????', '????????????', '??????????????']) +
              '\n???? ?????????? ' +
              getTotalPrice() +
              ' ' +
              TENGE_LETTER}
          </StyledText>
        )}
        contentContainerStyle={{paddingBottom: 150}}
        // ListEmptyComponent={() => renderEmpty()}
        data={basket}
        scrollEnabled={false}
        closeOnRowOpen={true}
        closeOnRowPress={true}
        renderHiddenItem={(data, rowMap) => (
          <Pressable
            android_ripple={{color: '#F3F2F8', radius: 200}}
            onPress={() => {
              rowMap[basket.indexOf(data.item)].closeRow();
              dispatch(deleteProduct(data.item.item));
            }}
            style={{
              backgroundColor: 'red',
              width: 70,
              height: '100%',
              position: 'absolute',
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <StyledText
              style={{color: 'white', fontSize: 12, fontWeight: '700'}}>
              ??????????????
            </StyledText>
          </Pressable>
        )}
        rightOpenValue={-70}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => renderBasketItem(item)}
      />
    );
  }

  function renderRecommendsList() {
    return (
      <FlatList
        contentContainerStyle={{}}
        keyExtractor={(item, index) => index.toString()}
        data={recommends}
        renderItem={({item}) => <RecommendCard recommend={item} />}
        ListFooterComponent={() => <View style={{height: 150}} />}
      />
    );
  }

  if (!netinfo.isConnected) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <FocusAwareStatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <Image
          style={{width: vScale(381), height: hScale(283)}}
          source={require('../../assets/ph_offline.png')}
        />
        <StyledText style={{fontWeight: '700', fontSize: 28, color: 'black'}}>
          ????, ?????? ??????????????????
        </StyledText>
        <StyledText
          style={{
            width: width - 32,
            textAlign: 'center',
            marginVertical: 19,
            color: 'black',
          }}>
          ?? ?????????????????? ?????? ?????????????????? ?????????????? ???? ???????????????? ?? ??????????????????, ????????????????????
          ?????????? ??????????
        </StyledText>
        <BaseButton text={'????????????????'} onPress={() => {}} />
      </View>
    );
  } else if (basket.length === 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <Image
          style={{width: vScale(380), height: hScale(280)}}
          source={require('../../assets/ph_basket.png')}
        />
        <StyledText
          style={{
            fontWeight: '700',
            fontSize: 30,
            color: 'black',
            marginTop: 20,
          }}>
          ????, ?????????????? ??????????
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
          ???????? ?????????????? ??????????, ???????????????? ?????????????? ?? ???????????????? ?????????????????????????? ??????????.
        </StyledText>
        <View style={{height: 27}} />
        <BaseButton
          width={width - 66 - 67}
          text={'?????????????? ?? ????????'}
          onPress={() => {
            navigation.navigate('Menu');
          }}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <FlatList
          data={[1, 2]}
          renderItem={({item, index}) => {
            if (index === 0) {
              return renderBasketList();
            } else {
              return renderRecommendsList();
            }
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopColor: '#F2F2F6',
            borderTopWidth: 1,
            width,
          }}>
          <View style={{height: 20}} />
          <BaseButton
            text={'???????????????? ?????????? ???? ' + getTotalPrice() + ' ' + TENGE_LETTER}
            onPress={() => {
              if (auth().currentUser?.displayName !== null) {
                validateAll();
              } else {
                navigation.navigate('EnterPhone');
              }
            }}
          />
          <View style={{height: 20}} />
        </View>
      </View>
    );
  }
}

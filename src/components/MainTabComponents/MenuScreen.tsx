import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {getFontName, withFont} from '../_CustomComponents/HOC/withFont';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
// @ts-ignore
import TabSelectorAnimation from 'react-native-tab-selector';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {Restaraunt, Stock} from '../../API';
import {useFocusEffect} from '@react-navigation/native';
// @ts-ignore
import firestore, {DocumentReference} from '@react-native-firebase/firestore';
import {setStocks} from '../../redux/UserDataSlice';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import Modal from 'react-native-modal';
import BaseButton from '../_CustomComponents/BaseButton';
import {
  Category,
  Product,
  setCategories,
  setProducts,
} from '../../redux/ProductsDataSlice';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Menu'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);

export default function MenuScreen({navigation}: Props) {
  const HEADER_EXPANDED_HEIGHT = 350;
  const HEADER_COLLAPSED_HEIGHT = 60;

  const onViewRef = useRef(({viewableItems}: any) => {
    console.log('viewableItems', viewableItems);
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 75,
    minimumViewTime: 250,
    waitForInteraction: true,
  });
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const flatlistref = useRef<FlatList>(null);
  const active: string = useSelector(
    (state: RootState) => state.data.activeShop,
  );
  const shops: Array<Restaraunt> = useSelector(
    (state: RootState) => state.data.shops,
  );
  const scrollY = new Animated.Value(0);
  const stocks: Array<Stock> = useSelector(
    (state: RootState) => state.data.stocks,
  );

  const categoriesMap: Record<string, Category> = useSelector(
    (state: RootState) => state.products.categories,
  );
  const categories: Array<Category> = useSelector((state: RootState) =>
    state.products.categoryIds.map(it => categoriesMap[it]),
  );
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const [modalStock, setModalStock] = useState<Stock>({
    id: '',
    name: '',
    image: '',
    productId: '',
    description: '',
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);

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

  function getProductOrderByCategory(path: string, catList: Array<Category>) {
    let res = 0;
    let i;
    for (i = 0; i < catList.length; i++) {
      if (path.includes(catList[i].name)) {
        res = catList[i].order;
      }
    }

    return res;
  }

  function requestProducts(catList: Array<Category>) {
    firestore()
      .collection('Продукты')
      .get()
      .then(res => {
        let prodList: Array<Product> = [];
        res.docs.forEach(doc => {
          prodList.push({
            id: doc.id,
            name: doc.get<string>('Название')
              ? doc.get<string>('Название')
              : '',
            description: doc.get<string>('Описание')
              ? doc.get<string>('Описание')
              : '',
            picture_url: doc.get<string>('Картинка')
              ? doc.get<string>('Картинка')
              : '',
            price: doc.get<number>('Цена') ? doc.get<number>('Цена') : 0,
            weight: doc.get<number>('Вес') ? doc.get<number>('Вес') : 0,
            isHit: doc.get<boolean>('ХитПродаж')
              ? doc.get<boolean>('ХитПродаж')
              : false,
            isNew: doc.get<boolean>('Новинка')
              ? doc.get<boolean>('Новинка')
              : false,
            size: doc.get<number>('Объем') ? doc.get<number>('Объем') : 0,
            category: doc.get<DocumentReference>('Категория').path,
            categoryOrder: getProductOrderByCategory(
              doc.get<DocumentReference>('Категория').path,
              catList,
            ),
          });
        });
        dispatch(setProducts(prodList));
      })
      .catch(er => console.log('er', er));
  }

  useFocusEffect(
    React.useCallback(() => {
      firestore()
        .collection('Акции')
        .get()
        .then(res => {
          let stockList: Array<Stock> = [];
          res.docs.forEach(doc => {
            stockList.push({
              id: doc.id,
              name: doc.get<string>('Заголовок')
                ? doc.get<string>('Заголовок')
                : '',
              description: doc.get<string>('Описание')
                ? doc.get<string>('Описание')
                : '',
              image: doc.get<string>('Картинка')
                ? doc.get<string>('Картинка')
                : '',
              productId: doc.get<DocumentReference>('Продукт').path,
            });
          });
          dispatch(setStocks(stockList));
        })
        .catch(er => console.log('er', er));
      firestore()
        .collection('Категории')
        .orderBy('Порядок', 'asc')
        .get()
        .then(res => {
          let catList: Array<Category> = [];
          res.docs.forEach(doc => {
            catList.push({
              id: doc.id,
              name: doc.get<string>('Название')
                ? doc.get<string>('Название')
                : '',
              fire:
                doc.get<boolean>('Огонь') && doc.get<boolean>('Огонь') === true
                  ? true
                  : false,
              order: doc.get<number>('Порядок')
                ? doc.get<number>('Порядок')
                : 0,
            });
          });
          dispatch(setCategories(catList));
          requestProducts(catList);
        })
        .catch(er => console.log('er', er));
    }, []),
  );

  function renderToolbar() {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 25,
            width,
            backgroundColor: 'white',
            height: 35,
          }}>
          <View style={{width: 18}} />
          <Button
            onPress={() => navigation.navigate('ChangeRestaraunt')}
            containerStyle={{}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StyledText
                style={{fontWeight: '500', fontSize: 15, color: 'black'}}>
                {activeShop.name}
              </StyledText>
              <Image
                style={{
                  width: 14,
                  height: 7,
                  marginLeft: 9,
                  tintColor: 'black',
                }}
                source={require('../../assets/droprdown.png')}
              />
            </View>
          </Button>
          <View
            style={{
              position: 'absolute',
              right: 20,
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            <Button onPress={() => {}} containerStyle={{width: 30, height: 30}}>
              <Image
                style={{width: 30, height: 22}}
                source={require('../../assets/search.png')}
              />
            </Button>
          </View>
        </View>
      </>
    );
  }

  function renderSelection() {
    return (
      <View
        style={{
          borderRadius: 15,
          backgroundColor: '#F5F5F8',
          width: width - 36,
          height: 120,
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <TabSelectorAnimation
          style={{
            marginTop: 20,
            width: width - 70,
            borderRadius: 9,
          }}
          styleTab={{borderRadius: 9}}
          backgroundColor={'#7676801F'}
          onChangeTab={() => {}}
          styleTitle={{fontSize: 15, fontFamily: getFontName('400')}}
          tabs={[{title: 'На доставку'}, {title: 'Самовывоз'}]}
        />
        <View
          style={{
            width: width - 100,
            height: 0.5,
            marginTop: 18,
            backgroundColor: '#DCDDE4',
          }}
        />
        <Button
          onPress={() => navigation.navigate('ChangeRestaraunt')}
          containerStyle={{marginTop: 13 / 2}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 18, height: 18, marginRight: 18}}
              source={require('../../assets/samovivoz.png')}
            />
            <StyledText
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                fontWeight: '400',
                width: width / 2,
                fontSize: 15,
                color: 'black',
              }}>
              {activeShop.address}
            </StyledText>
            <Image
              style={{
                marginLeft: 10,
                tintColor: 'black',
                width: 12,
                height: 6,
                transform: [{rotate: '270deg'}],
              }}
              source={require('../../assets/droprdown.png')}
            />
          </View>
        </Button>
      </View>
    );
  }

  function getRandomData() {
    return new Array(100).fill('').map((item, index) => {
      return {title: 'Title ' + (index + 1)};
    });
  }

  function renderCategoryItem(item: Category, index: number) {
    return (
      <>
        <View
          style={{
            marginRight: 9,
            overflow: 'hidden',
            borderRadius: 15,
            height: 30,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => {
              setActiveCategory(index);
              flatlistref.current?.scrollToIndex({
                index: index * 10,
                animated: true,
              });
            }}
            android_ripple={{color: 'gray', radius: 200}}
            style={{
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 18,
              backgroundColor:
                index === activeCategory && item.fire
                  ? '#FFD0D0'
                  : index === activeCategory && !item.fire
                  ? '#BEE8EE'
                  : '#F3F3F7',
            }}>
            <StyledText
              style={{
                color:
                  index === activeCategory && item.fire
                    ? '#850000'
                    : index === activeCategory && !item.fire
                    ? '#046674'
                    : '#606572',
                fontSize: 12,
                fontWeight: '700',
              }}>
              {item.name}
            </StyledText>
          </Pressable>
        </View>
        {item.fire && (
          <Image
            style={{
              width: 14,
              height: 14,
              position: 'absolute',
              right: 12,
              top: 10,
              tintColor: index === activeCategory ? '#850000' : '#606572',
            }}
            source={require('../../assets/Fire.png')}
          />
        )}
      </>
    );
  }

  function renderModal() {
    return (
      <Modal
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={['down']}
        isVisible={modalVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        deviceHeight={Dimensions.get('screen').height}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            width,
            backgroundColor: 'white',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: 45,
              height: 15,
              marginVertical: 20,
              transform: [{rotate: '180deg'}],
            }}
            source={require('../../assets/modal_arrow.png')}
          />
          <FirebaseImage
            innerUrl={modalStock.image}
            imageStyle={{width: width - 60, height: 150, borderRadius: 15}}
          />
          <StyledText
            style={{
              fontWeight: '700',
              fontSize: 20,
              color: '#000000B2',
              marginTop: 29,
              marginHorizontal: 30,
              alignSelf: 'flex-start',
            }}>
            {modalStock.name}
          </StyledText>
          <StyledText
            style={{
              marginTop: 7,
              marginBottom: 50,
              fontWeight: '400',
              fontSize: 18,
              color: '#6A6F7A',
              marginHorizontal: 30,
              alignSelf: 'flex-start',
            }}>
            {modalStock.description}
          </StyledText>
          <BaseButton text={'Показать'} onPress={() => {}} />
          <View style={{height: 50}} />
        </View>
      </Modal>
    );
  }

  return (
    <>
      <FocusAwareStatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      {renderToolbar()}

      <Animated.View
        style={[
          {
            height: headerHeight,
            backgroundColor: 'lightblue',
            position: 'absolute',
            width,
            overflow: 'hidden',
            top: 60,
            left: 0,
            zIndex: 99,
          },
        ]}>
        {renderSelection()}
        <FlatList
          contentContainerStyle={{
            height: 150,
            alignItems: 'center',
            marginVertical: 18,
          }}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          data={stocks}
          horizontal={true}
          ItemSeparatorComponent={() => <View style={{width: 18}} />}
          ListFooterComponent={() => <View style={{width: 18}} />}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                if (!item.id) {
                  return;
                } else {
                  setModalStock(item);
                  setModalVisible(true);
                }
              }}
              style={{marginLeft: 18}}>
              <FirebaseImage
                innerUrl={item.image}
                resizeMode={'contain'}
                imageStyle={{
                  borderRadius: 15,
                  width: width - 60,
                  height: 126,
                }}
              />
            </Pressable>
          )}
        />

        <View
          style={{
            width,
            height: HEADER_COLLAPSED_HEIGHT,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            alignItems: 'center',
          }}>
          <FlatList
            contentContainerStyle={{
              backgroundColor: 'white',
              alignSelf: 'center',
              paddingLeft: 18,
              height: HEADER_COLLAPSED_HEIGHT,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={categories}
            renderItem={({item, index}) => renderCategoryItem(item, index)}
          />
        </View>
      </Animated.View>

      <FlatList
        contentContainerStyle={{
          paddingTop: HEADER_EXPANDED_HEIGHT,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        scrollEventThrottle={16}
        ref={flatlistref}
        data={getRandomData()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Text style={{height: 150, borderColor: 'red'}}>{item.title}</Text>
        )}
      />
      {renderModal()}
      {/*<BaseButton*/}
      {/*  text={'123'}*/}
      {/*  textStyle={{fontWeight: '700'}}*/}
      {/*  onPress={() => navigation.navigate('Product')}*/}
      {/*/>*/}
    </>
  );
}

import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../redux';
import {Address, Restaraunt, Stock} from '../../API';
import {useFocusEffect} from '@react-navigation/native';
// @ts-ignore
import firestore, {DocumentReference} from '@react-native-firebase/firestore';
import {
  setAddresses,
  setCurrentAddress,
  setOrderDeliveryType,
  setStocks,
} from '../../redux/UserDataSlice';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import Modal from 'react-native-modal';
import BaseButton from '../_CustomComponents/BaseButton';
import {
  Category,
  OrderDeliveryType,
  Product,
  setCategories,
  setProducts,
} from '../../redux/ProductsDataSlice';
import {PRODUCT_ITEM_HEIGHT, ProductItem} from './ProductItem';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import auth from '@react-native-firebase/auth';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Menu'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);

export default function MenuScreen({navigation}: Props) {
  const HEADER_EXPANDED_HEIGHT = 350;
  const HEADER_COLLAPSED_HEIGHT = 60;

  const onViewRef = useRef((info: {viewableItems: Array<ViewToken>}) => {
    if (info.viewableItems.length > 0) {
      //костыль. на самом деле мы видим на 2 элемента раньше, если они есть.
      // console.log('viewableItems', info.viewableItems);

      let reallyFirstViewableItem =
        info.viewableItems[0].index && info.viewableItems[0].index < 2
          ? info.viewableItems[0].item
          : products[
              info.viewableItems[0].index ? info.viewableItems[0].index - 2 : 0
            ];

      // console.log('reallyFirstViewableItem', reallyFirstViewableItem);

      let cat_index = categories.findIndex(
        it => reallyFirstViewableItem.category === 'Категории/' + it.id,
      );

      // console.log('cat_index', cat_index);
      if (cat_index === 0) {
        setActiveCategory(0);
        flatlistCategoryRef.current?.scrollToOffset({
          offset: 0,
          animated: true,
        });
      } else if (cat_index !== -1 && cat_index !== activeCategory) {
        setActiveCategory(cat_index);
        if (cat_index !== 0) {
          flatlistCategoryRef.current?.scrollToIndex({
            index: cat_index,
            animated: true,
            viewOffset: 18,
          });
        }
      }
    } else {
      // setActiveCategory(0);
      // flatlistCategoryRef.current?.scrollToOffset({
      //   offset: 0,
      //   animated: true,
      // });
    }
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 400,
    waitForInteraction: true,
  });
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const flatlistref = useRef<FlatList>(null);
  const flatlistCategoryRef = useRef<FlatList>(null);
  const active: string = useSelector(
    (state: RootState) => state.data.activeShop,
  );
  const shops: Array<Restaraunt> = useSelector(
    (state: RootState) => state.data.shops,
  );
  const orderDeliveryType: OrderDeliveryType = useSelector(
    (state: RootState) => state.data.orderDeliveryType,
  );
  const currentAddress: Address | undefined = useSelector(
    (state: RootState) => state.data.currentAddress,
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

  const productsMap: Record<string, Product> = useSelector(
    (state: RootState) => state.products.products,
  );
  const products: Array<Product> = useSelector((state: RootState) =>
    state.products.productIds.map(it => productsMap[it]),
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
      .orderBy('Название', 'asc')
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
      if (auth().currentUser?.displayName) {
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
            dispatch(setAddresses(list));
          })
          .catch(er => console.log('er', er));
      }

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
            androidRippleColor={'lightgray'}
            onPress={() =>
              navigation.navigate('ChangeRestaraunt', {activeTab: 0})
            }
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
            <Button
              androidRippleColor={'lightgray'}
              onPress={() => navigation.navigate('Search')}
              containerStyle={{width: 30, height: 30}}>
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
        <SegmentedControl
          style={{
            marginTop: 20,
            width: width - 70,
            borderRadius: 9,
            zIndex: 999,
          }}
          fontStyle={{
            fontSize: 15,
            fontWeight: '400',
            fontFamily: 'SFProDisplay-Regular',
          }}
          tabStyle={{borderRadius: 9}}
          backgroundColor={'#7676801F'}
          selectedIndex={orderDeliveryType === 'DELIVERY' ? 0 : 1}
          onChange={event => {
            if (event.nativeEvent.selectedSegmentIndex === 0) {
              dispatch(setOrderDeliveryType('DELIVERY'));
              dispatch(setCurrentAddress(undefined));
            } else {
              dispatch(setOrderDeliveryType('PICKUP'));
            }
          }}
          // styleTitle={{fontSize: 15, fontFamily: getFontName('400')}}
          values={['На доставку', 'Самовывоз']}
        />
        <View
          style={{
            width: width - 100,
            height: 0.5,
            marginTop: 18,
            backgroundColor: '#DCDDE4',
          }}
        />
        {orderDeliveryType === 'PICKUP' ? (
          <Button
            androidRippleColor={'lightgray'}
            onPress={() =>
              navigation.navigate('ChangeRestaraunt', {activeTab: 0})
            }
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
                {activeShop.name}
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
        ) : (
          <Button
            androidRippleColor={'lightgray'}
            onPress={() => {
              if (!auth().currentUser?.displayName) {
                navigation.navigate('EnterPhone');
              } else {
                navigation.navigate('DeliveryListSelect');
              }
            }}
            containerStyle={{marginTop: 13 / 2}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {currentAddress && (
                <Image
                  style={{width: 18, height: 18, marginRight: 18}}
                  source={require('../../assets/delivery_icon.png')}
                />
              )}
              {currentAddress ? (
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontWeight: '400',
                    fontSize: 15,
                    color: 'black',
                  }}>
                  {currentAddress.street +
                    ' ' +
                    currentAddress.house +
                    ', ' +
                    currentAddress.flat}
                </StyledText>
              ) : (
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontWeight: '400',
                    fontSize: 15,
                    color: '#28B3C6',
                  }}>
                  {'Укажите адрес доставки'}
                </StyledText>
              )}
              <Image
                style={{
                  marginLeft: 10,
                  tintColor: currentAddress ? 'black' : '#28B3C6',
                  width: 12,
                  height: 6,
                  transform: [{rotate: '270deg'}],
                }}
                source={require('../../assets/droprdown.png')}
              />
            </View>
          </Button>
        )}
      </View>
    );
  }

  function renderStocks() {
    return (
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
    );
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
              let pr_index = products.findIndex(
                it => it.category === 'Категории/' + item.id,
              );
              if (pr_index !== -1) {
                flatlistref.current?.scrollToIndex({
                  index: pr_index,
                  viewOffset: -HEADER_EXPANDED_HEIGHT + HEADER_COLLAPSED_HEIGHT,
                  viewPosition: 0,
                  animated: true,
                });
              } else {
                flatlistref.current?.scrollToOffset({
                  offset: 0,
                  animated: true,
                });
              }
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
          <BaseButton
            text={'Показать'}
            onPress={() => {
              setModalVisible(false);
              if (
                products.filter(
                  it => 'Продукты/' + it.id === modalStock.productId,
                ).length > 0
              ) {
                setTimeout(() => {
                  navigation.navigate('Product', {
                    product: products.filter(
                      it => 'Продукты/' + it.id === modalStock.productId,
                    )[0],
                  });
                }, 600);
              }
            }}
          />
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
            backgroundColor: 'white',
            position: 'absolute',
            width,
            overflow: 'hidden',
            top: 60,
            left: 0,
            zIndex: 99,
          },
        ]}>
        {renderSelection()}
        {renderStocks()}
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
            ref={flatlistCategoryRef}
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
        getItemLayout={(data, index) => ({
          length: PRODUCT_ITEM_HEIGHT,
          offset: PRODUCT_ITEM_HEIGHT * index,
          index,
        })}
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <ProductItem product={item} />}
      />
      {renderModal()}
    </>
  );
}

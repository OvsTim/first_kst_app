import React, {useRef, useState} from 'react';
import {
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
import SegmentedControl from 'rn-segmented-control';

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
import auth from '@react-native-firebase/auth';
import {hScale, vScale} from '../../utils/scaling';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Menu'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);

export default function MenuScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();

  const HEADER_EXPANDED_HEIGHT = 290 + insets.top;
  const netInfo = useNetInfo();
  const onViewRef = useRef((info: {viewableItems: Array<ViewToken>}) => {
    if (info.viewableItems.length > 0) {
      let cat_index = categories.findIndex(
        it => info.viewableItems[0].item.category === '??????????????????/' + it.id,
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
    }
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 1,
    waitForInteraction: true,
  });
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  const flatlistref = useRef<FlatList>(null);
  const flatlistCategoryRef = useRef<FlatList>(null);
  const mainflatlistRef = useRef<FlatList>(null);
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

  // console.log('products', products);

  const [modalStock, setModalStock] = useState<Stock>({
    id: '',
    name: '',
    image: '',
    productId: '',
    description: '',
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [elevation, setElevation] = useState<number>(0);

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
      if (path.includes(catList[i].id)) {
        res = catList[i].order;
      }
    }

    return res;
  }

  function requestProducts(catList: Array<Category>) {
    firestore()
      .collection('????????????????')
      .orderBy('????????????????', 'asc')
      .get()
      .then(res => {
        let prodList: Array<Product> = [];
        res.docs.forEach(doc => {
          // console.log(
          //   "doc.get<DocumentReference>('??????????????????')",
          //   doc.id,
          //   doc.get<DocumentReference>('??????????????????'),
          // );

          prodList.push({
            id: doc.id,
            name: doc.get<string>('????????????????')
              ? doc.get<string>('????????????????')
              : '',
            description: doc.get<string>('????????????????')
              ? doc.get<string>('????????????????')
              : '',
            picture_url: doc.get<string>('????????????????')
              ? doc.get<string>('????????????????')
              : '',
            price: doc.get<number>('????????') ? doc.get<number>('????????') : 0,
            weight: doc.get<number>('??????') ? doc.get<number>('??????') : 0,
            isHit: doc.get<boolean>('??????????????????')
              ? doc.get<boolean>('??????????????????')
              : false,
            isNew: doc.get<boolean>('??????????????')
              ? doc.get<boolean>('??????????????')
              : false,
            size: doc.get<number>('??????????') ? doc.get<number>('??????????') : 0,
            category: doc.get<DocumentReference>('??????????????????').path,
            categoryOrder: getProductOrderByCategory(
              doc.get<DocumentReference>('??????????????????').path,
              catList,
            ),
            productOrder: doc.get<number>('??????????????')
              ? doc.get<number>('??????????????')
              : 0,
          });
        });
        dispatch(
          setProducts(
            prodList.sort(function (a, b) {
              return (
                (a.productOrder ? a.productOrder : 0) -
                (b.productOrder ? b.productOrder : 0)
              );
            }),
          ),
        );
      })
      .catch(er => console.log('er123', er));
  }

  useFocusEffect(
    React.useCallback(() => {
      if (auth().currentUser?.displayName) {
        firestore()
          .collection('????????????????????????')
          .doc(auth().currentUser?.uid)
          .collection('????????????')
          .where('??????????', '!=', '')
          .get()
          .then(res => {
            let list: Array<Address> = [];
            res.docs.forEach(doc => {
              let newAddress: Address = {
                id: doc.id,
                name: doc.get<string>('????????????????')
                  ? doc.get<string>('????????????????')
                  : '',
                street: doc.get<string>('??????????'),
                house: doc.get<string>('??????'),
                flat: doc.get<string>('????????????????'),
                code: doc.get<string>('??????????????????????')
                  ? doc.get<string>('??????????????????????')
                  : '',
                commentary: doc.get<string>('??????????????????????')
                  ? doc.get<string>('??????????????????????')
                  : '',
                entrance: doc.get<string>('??????????????')
                  ? doc.get<string>('??????????????')
                  : '',
                floor: doc.get<string>('????????') ? doc.get<string>('????????') : '',
              };
              list.push(newAddress);
            });
            dispatch(setAddresses(list));
          })
          .catch(er => console.log('er', er));
      }

      firestore()
        .collection('??????????')
        .get()
        .then(res => {
          let stockList: Array<Stock> = [];
          res.docs.forEach(doc => {
            stockList.push({
              id: doc.id,
              name: doc.get<string>('??????????????????')
                ? doc.get<string>('??????????????????')
                : '',
              description: doc.get<string>('????????????????')
                ? doc.get<string>('????????????????')
                : '',
              image: doc.get<string>('????????????????')
                ? doc.get<string>('????????????????')
                : '',
              productId: doc.get<DocumentReference>('??????????????')
                ? doc.get<DocumentReference>('??????????????').path
                : '',
            });
          });
          dispatch(setStocks(stockList));
        })
        .catch(er => console.log('er', er));
      firestore()
        .collection('??????????????????')
        .orderBy('??????????????', 'asc')
        .get()
        .then(res => {
          let catList: Array<Category> = [];
          res.docs.forEach(doc => {
            catList.push({
              id: doc.id,
              name: doc.get<string>('????????????????')
                ? doc.get<string>('????????????????')
                : '',
              fire:
                doc.get<boolean>('??????????') && doc.get<boolean>('??????????') === true
                  ? true
                  : false,
              order: doc.get<number>('??????????????')
                ? doc.get<number>('??????????????')
                : 0,
              recommendations: doc.get<Array<DocumentReference>>('????????????????????????')
                ? doc
                    .get<Array<DocumentReference>>('????????????????????????')
                    .map(it => it.path)
                : [],
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
            marginTop: 25 + insets.top,
            marginBottom: 10,
            alignItems: 'center',
            width,
            height: 45,
          }}>
          <View style={{width: 8}} />
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 15,
              height: 25,
              alignSelf: 'center',
            }}>
            <Button
              androidRippleColor={'#F3F2F8'}
              onPress={() =>
                navigation.navigate('ChangeRestaraunt', {activeTab: 0})
              }
              containerStyle={{height: 25}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: 10}} />

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
                <View style={{width: 10}} />
              </View>
            </Button>
          </View>
          <View
            style={{
              position: 'absolute',
              right: 20,
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            <Button
              androidRippleColor={'#F3F2F8'}
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
          backgroundColor: '#F5F5F7',
          width: width - 36,
          height: 120,
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <SegmentedControl
          paddingVertical={6}
          width={width - 70}
          theme={'LIGHT'}
          currentIndex={orderDeliveryType === 'DELIVERY' ? 0 : 1}
          containerStyle={{
            marginTop: 20,
            borderRadius: 9,
            zIndex: 999,
            backgroundColor: '#7676801F',
          }}
          tileStyle={{borderRadius: 9}}
          activeTextColor={'black'}
          textColor={'rgba(0, 0, 0, 0.8)'}
          activeSegmentBackgroundColor={'white'}
          segmentedControlBackgroundColor={'#E2E3E8'}
          textStyle={{
            fontSize: 15,
            fontFamily: 'SFProDisplay-Regular',
          }}
          activeTextWeight={'500'}
          onChange={event => {
            if (event === 0) {
              dispatch(setOrderDeliveryType('DELIVERY'));
              dispatch(setCurrentAddress(undefined));
            } else {
              dispatch(setOrderDeliveryType('PICKUP'));
            }
          }}
          tabs={['???? ????????????????', '??????????????????']}
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
          <View style={{overflow: 'hidden', borderRadius: 10, marginTop: 13}}>
            <Button
              androidRippleColor={'#F3F2F8'}
              onPress={() =>
                navigation.navigate('ChangeRestaraunt', {activeTab: 0})
              }
              containerStyle={{}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 10}} />

                <Image
                  style={{width: 18, height: 18, marginRight: 18}}
                  source={require('../../assets/samovivoz.png')}
                />
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontWeight: '400',
                    maxWidth: width / 2,
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
                <View style={{width: 10}} />
              </View>
            </Button>
          </View>
        ) : (
          <View style={{overflow: 'hidden', borderRadius: 10, marginTop: 13}}>
            <Button
              androidRippleColor={'#F3F2F8'}
              onPress={() => {
                if (!auth().currentUser?.displayName) {
                  navigation.navigate('EnterPhone');
                } else {
                  navigation.navigate('DeliveryListSelect');
                }
              }}
              containerStyle={{}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 10}} />
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
                      maxWidth: width / 2,

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
                    {'?????????????? ?????????? ????????????????'}
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
                <View style={{width: 10}} />
              </View>
            </Button>
          </View>
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
        }}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        data={stocks}
        horizontal={true}
        ItemSeparatorComponent={() => <View style={{width: 9}} />}
        ListFooterComponent={() => <View style={{width: 18}} />}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              if (!item.id) {
                return;
              } else {
                setModalStock(item);
                setModalVisible(true);
              }
            }}
            style={{marginLeft: index === 0 ? 18 : 9}}>
            <FirebaseImage
              innerUrl={item.image}
              resizeMode={'cover'}
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
                it => it.category === '??????????????????/' + item.id,
              );
              if (pr_index !== -1) {
                mainflatlistRef.current?.scrollToOffset({
                  offset:
                    pr_index * PRODUCT_ITEM_HEIGHT +
                    HEADER_EXPANDED_HEIGHT -
                    insets.top,
                  animated: true,
                });
              } else {
                mainflatlistRef.current?.scrollToOffset({
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
                  : '#F3F2F8',
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
              right: 14,
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
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
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
          <View
            style={{
              marginVertical: 20,
              backgroundColor: '#D9D9D9',
              width: 42,
              height: 6,
              borderRadius: 3,
            }}
          />
          <FirebaseImage
            resizeMode={'cover'}
            innerUrl={modalStock.image}
            imageStyle={{borderRadius: 15, width: width - 60, height: 126}}
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
            text={modalStock.productId === '' ? '??????????????' : '????????????????'}
            onPress={() => {
              setModalVisible(false);
              if (modalStock.productId === '') {
                return;
              }

              if (
                products.filter(
                  it => '????????????????/' + it.id === modalStock.productId,
                ).length > 0
              ) {
                setTimeout(() => {
                  navigation.navigate('Product', {
                    product: products.filter(
                      it => '????????????????/' + it.id === modalStock.productId,
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

  function renderMainListItems(mainListItem: number) {
    switch (mainListItem) {
      case 1:
        return renderSelection();
      case 2:
        return renderStocks();
      case 3:
        return (
          <View style={{overflow: 'hidden', paddingBottom: 5}}>
            <View
              style={[
                {elevation, backgroundColor: 'white'},
                elevation > 0
                  ? {
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.41,
                    }
                  : {},
              ]}>
              <FlatList
                ref={flatlistCategoryRef}
                contentContainerStyle={{
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  paddingLeft: 18,
                  height: 60,
                }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={categories}
                renderItem={({item, index}) => renderCategoryItem(item, index)}
              />
            </View>
          </View>
        );
      case 4:
        return (
          <FlatList
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            maxToRenderPerBatch={20}
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
        );
      default:
        return <View />;
    }
  }

  if (!netInfo.isConnected) {
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
  } else {
    return (
      <>
        <FocusAwareStatusBar
          translucent={false}
          backgroundColor={'white'}
          barStyle="dark-content"
        />
        {renderToolbar()}
        <FlatList
          onScroll={r => {
            if (
              r.nativeEvent.contentOffset.y > HEADER_EXPANDED_HEIGHT - 40 &&
              elevation === 0
            ) {
              setElevation(3);
            } else if (
              r.nativeEvent.contentOffset.y <= HEADER_EXPANDED_HEIGHT - 40 &&
              elevation === 3
            ) {
              setElevation(0);
            }
          }}
          scrollEventThrottle={16}
          ref={mainflatlistRef}
          stickyHeaderIndices={[2]}
          keyExtractor={(_, index) => index.toString()}
          data={[1, 2, 3, 4]}
          renderItem={({item}) => renderMainListItems(item)}
        />
        {renderModal()}
      </>
    );
  }
}

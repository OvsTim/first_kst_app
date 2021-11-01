import React, {useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
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
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Menu'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);

export default function MenuScreen({navigation}: Props) {
  const HEADER_EXPANDED_HEIGHT = 350;
  const HEADER_COLLAPSED_HEIGHT = 60;
  const {width} = useWindowDimensions();
  const dispatch = useAppDispatch();
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
              name: doc.get<string>('Заголовок'),
              description: doc.get<string>('Описание'),
              image: doc.get<string>('Картинка'),
              productId: doc.get<DocumentReference>('Продукт').path,
            });
          });
          dispatch(setStocks(stockList));
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
              right: 27,
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
    <View style={{flex: 1}}>
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
        <StyledText
          style={{
            width,
            height: HEADER_COLLAPSED_HEIGHT,
            backgroundColor: 'red',
            position: 'absolute',
            bottom: 0,
          }}>
          Здесь будет список категорий
        </StyledText>
      </Animated.View>

      <ScrollView
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
        scrollEventThrottle={16}>
        <Text style={{backgroundColor: 'white'}}>This is Title</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
        <Text style={{backgroundColor: 'white'}}>1213132123123132123132</Text>
      </ScrollView>
      {renderModal()}
      {/*<BaseButton*/}
      {/*  text={'123'}*/}
      {/*  textStyle={{fontWeight: '700'}}*/}
      {/*  onPress={() => navigation.navigate('Product')}*/}
      {/*/>*/}
    </View>
  );
}

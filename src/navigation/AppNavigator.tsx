import 'react-native-gesture-handler';
import * as React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MenuScreen from '../components/MainTabComponents/MenuScreen';
import ProfileScreen from '../components/MainTabComponents/ProfileScreen';
import ContactsScreen from '../components/MainTabComponents/ContactsScreen';
import BasketScreen from '../components/MainTabComponents/BasketScreen';
import {Image, Text, View} from 'react-native';
import {withFont} from '../components/_CustomComponents/HOC/withFont';
import AboutScreen from '../components/AboutComponents/AboutScreen';
import HistoryScreen from '../components/HistoryComponents/HistoryScreen';
import DeliveryListScreen from '../components/DeviveryComponents/DeliveryListScreen';
import MapScreen from '../components/MapComponents/MapScreen';
import SettingsScreen from '../components/SettingsComponents/SettingsScreen';
import ProductScreen from '../components/ProductComponents/ProductScreen';
import OrderDeliveryScreen from '../components/OrderDeliveryComponents/OrderDeliveryScreen';
import BonucesStocksScreen from '../components/BonucesStocksComponents/BonucesStocksScreen';
import {Address} from '../API';
import AddEditAddressScreen from '../components/AddEditAddressComponents/AddEditAddressScreen';
import EnterPhoneScreen from '../components/AuthComponents/EnterPhoneScreen';
import EnterCodeScreen from '../components/AuthComponents/EnterCodeScreen';
import EnterNameScreen from '../components/AuthComponents/EnterNameScreen';
import EnterBirthdayScreen from '../components/AuthComponents/EnterBirthdayScreen';
import SelectShopScreen from '../components/SignInComonents/SelectShopScreen';
import {Product} from '../redux/ProductsDataSlice';
import {BasketItem} from '../redux/BasketDataReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import SearchScreen from '../components/SearchComponents/SearchScreen';

export type AppStackParamList = {
  Home: undefined;
  Basket: undefined;
  Contacts: undefined;
  Menu: undefined;
  Profile: undefined;
  About: undefined;
  DeliveryList: undefined;
  History: undefined;
  Map: undefined;
  Settings: undefined;
  Product: {product: Product};
  OrderDelivery: undefined;
  BonucesStocks: undefined;
  EnterPhone: undefined;
  EnterCode: {phone: string; formattedPhone: string};
  EnterName: undefined;
  EnterBirthday: undefined;
  ChangeRestaraunt: {activeTab: number};
  AddEditAddress: {
    type: 'add' | 'edit';
    address?: Address;
  };
  AddEditAddressSelect: {
    type: 'add' | 'edit';
    address?: Address;
  };
  AddEditAddressBasket: {
    type: 'add' | 'edit';
    address?: Address;
  };
  DeliveryListSelect: undefined;
  DeliveryListBasket: undefined;
  Search: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
const MenuStack = createStackNavigator<AppStackParamList>();
const ProfileStack = createStackNavigator<AppStackParamList>();
const ContactsStack = createStackNavigator<AppStackParamList>();
const BasketStack = createStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppStackParamList>();

const options: StackNavigationOptions = {
  headerStyle: {
    height: 50,
    backgroundColor: '#F2F2F2',
  },
  headerPressColorAndroid: 'transparent',
  headerTitleAlign: 'center',
  headerBackTitleVisible: true,
  headerBackTitleStyle: {
    color: '#28B3C6',
    fontSize: 14,
    marginLeft: 4,
    fontFamily: 'SFProDisplay-Regular',
  },
  headerBackImage: _ => (
    <Image
      style={{width: 12, height: 21, marginRight: 8}}
      source={require('../assets/back.png')}
    />
  ),
  headerTitleStyle: {
    color: 'black',
    fontSize: 17,
    fontFamily: 'SFProDisplay-Bold',
  },
};
const StyledText = withFont(Text);

function MenuTab() {
  return (
    <MenuStack.Navigator screenOptions={options}>
      <MenuStack.Screen
        name="Menu"
        component={MenuScreen}
        options={{headerShown: false}}
      />
      <MenuStack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <MenuStack.Screen
        name="DeliveryListSelect"
        component={DeliveryListScreen}
        options={{title: 'Адреса доставки', headerBackTitle: 'Отменв'}}
      />
      <MenuStack.Screen
        name="AddEditAddressSelect"
        component={AddEditAddressScreen}
        options={{title: 'Адрес доставки', headerBackTitle: 'Назад'}}
      />
    </MenuStack.Navigator>
  );
}

function ProfileTab() {
  return (
    <ProfileStack.Navigator screenOptions={options}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Профиль'}}
      />
      <ProfileStack.Screen
        name="DeliveryList"
        component={DeliveryListScreen}
        options={{title: 'Адреса доставки', headerBackTitle: 'Профиль'}}
      />
      <ProfileStack.Screen
        name="History"
        component={HistoryScreen}
        options={{title: 'История заказов', headerBackTitle: 'Профиль'}}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Настройки', headerBackTitle: 'Профиль'}}
      />
      <ProfileStack.Screen
        name="BonucesStocks"
        component={BonucesStocksScreen}
        options={{title: 'Бонусы и акции', headerBackTitle: 'Профиль'}}
      />
      <ProfileStack.Screen
        name="AddEditAddress"
        component={AddEditAddressScreen}
        options={{title: 'Адрес доставки', headerBackTitle: 'Назад'}}
      />
    </ProfileStack.Navigator>
  );
}

function ContactsTab() {
  return (
    <ContactsStack.Navigator screenOptions={options}>
      <ContactsStack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{headerShown: false}}
      />
      <ContactsStack.Screen
        name="About"
        component={AboutScreen}
        options={{title: 'О приложении', headerBackTitle: 'Контакты'}}
      />
      <ContactsStack.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Рестораны на карте', headerBackTitle: 'Контакты'}}
      />
    </ContactsStack.Navigator>
  );
}

function BasketTab() {
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  return (
    <BasketStack.Navigator screenOptions={options}>
      <BasketStack.Screen
        name="Basket"
        component={BasketScreen}
        options={() => ({title: 'Корзина', headerShown: basket.length === 0})}
      />
      <BasketStack.Screen
        name={'OrderDelivery'}
        component={OrderDeliveryScreen}
        options={() => ({title: '', headerLeft: () => <View />})}
      />
      <BasketStack.Screen
        name="DeliveryListBasket"
        component={DeliveryListScreen}
        options={{title: 'Адреса доставки', headerBackTitle: 'Отменв'}}
      />
      <BasketStack.Screen
        name="AddEditAddressBasket"
        component={AddEditAddressScreen}
        options={{title: 'Адрес доставки', headerBackTitle: 'Назад'}}
      />
    </BasketStack.Navigator>
  );
}

function Home() {
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        inactiveTintColor: 'gray',
        style: {
          height: 80,
          backgroundColor: '#F7F7F7',
        },
      }}>
      <Tab.Screen
        name="Menu"
        component={MenuTab}
        options={{
          tabBarLabel: ({}) => {
            return (
              <StyledText
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: 18,
                }}>
                Меню
              </StyledText>
            );
          },
          tabBarIcon: ({focused, size}) => {
            return (
              <Image
                style={{
                  width: size,
                  height: size,
                  tintColor: focused ? '#28B3C6' : 'rgba(0,0,0,0.3)',
                }}
                source={require('../assets/menu_tab.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarLabel: ({}) => {
            return (
              <StyledText
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: 18,
                }}>
                Профиль
              </StyledText>
            );
          },
          tabBarIcon: ({focused, size}) => {
            return (
              <Image
                style={{
                  width: size,
                  height: size,
                  tintColor: focused ? '#28B3C6' : 'rgba(0,0,0,0.3)',
                }}
                source={require('../assets/Profile_tab.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsTab}
        options={{
          tabBarLabel: ({}) => {
            return (
              <StyledText
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: 18,
                }}>
                Контакты
              </StyledText>
            );
          },
          tabBarIcon: ({focused, size}) => {
            return (
              <Image
                style={{
                  width: size,
                  height: size,
                  tintColor: focused ? '#28B3C6' : 'rgba(0,0,0,0.3)',
                }}
                source={require('../assets/Contact_tab.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Basket"
        component={BasketTab}
        options={{
          tabBarLabel: ({}) => {
            return (
              <StyledText
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: 18,
                }}>
                Корзина
              </StyledText>
            );
          },
          tabBarIcon: ({focused, size}) => {
            return (
              <>
                <Image
                  style={{
                    width: size,
                    height: size,
                    tintColor: focused ? '#28B3C6' : 'rgba(0,0,0,0.3)',
                  }}
                  source={require('../assets/Bag_tab.png')}
                />
                {basket.length > 0 && (
                  <View
                    style={{
                      right: 31,
                      top: 8,
                      position: 'absolute',
                      width: 13,
                      height: 13,
                      backgroundColor: '#FF4545',
                      borderRadius: 13 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <StyledText
                      style={{fontSize: 7, color: 'white', fontWeight: '500'}}>
                      {basket.length}
                    </StyledText>
                  </View>
                )}
              </>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false, headerBackTitleVisible: false}}
      />
      <Stack.Screen
        name={'Product'}
        component={ProductScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'ChangeRestaraunt'}
        component={SelectShopScreen}
        initialParams={{activeTab: 0}}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerPressColorAndroid: 'transparent',
          headerTitleAlign: 'center',
          headerBackTitleStyle: {
            color: '#28B3C6',
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'SFProDisplay-Regular',
          },
          headerBackTitle: 'Отмена',
          headerBackTitleVisible: true,
          headerBackImage: _ => <View />,
          headerTitle: 'Рестораны',
          headerTitleStyle: {
            color: 'black',
            fontSize: 17,
            fontFamily: 'SFProDisplay-Bold',
          },
          headerStyle: {backgroundColor: '#F7F7F7'},
        }}
      />
      <Stack.Screen
        name={'EnterPhone'}
        component={EnterPhoneScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerBackTitleVisible: false,
          headerTitle: '',
          headerStyle: {backgroundColor: 'white'},
        }}
      />
      <Stack.Screen
        name={'EnterCode'}
        component={EnterCodeScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginRight: 8}}
              source={require('../assets/back.png')}
            />
          ),
          headerPressColorAndroid: 'transparent',
          headerTitleAlign: 'center',
          headerBackTitleVisible: true,
          headerBackTitleStyle: {
            color: '#28B3C6',
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'SFProDisplay-Regular',
          },
          headerBackTitle: 'Телефон',
          headerTitle: '',
          headerStyle: {backgroundColor: 'white'},
        }}
      />
      <Stack.Screen
        name={'EnterName'}
        component={EnterNameScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginRight: 8}}
              source={require('../assets/back.png')}
            />
          ),
          headerPressColorAndroid: 'transparent',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerBackTitleStyle: {
            color: '#28B3C6',
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'SFProDisplay-Regular',
          },
          headerTitle: '',
          headerStyle: {backgroundColor: 'white'},
        }}
      />
      <Stack.Screen
        name={'EnterBirthday'}
        component={EnterBirthdayScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginRight: 8}}
              source={require('../assets/back.png')}
            />
          ),
          headerPressColorAndroid: 'transparent',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerBackTitleStyle: {
            color: '#28B3C6',
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'SFProDisplay-Regular',
          },
          headerTitle: '',
          headerStyle: {backgroundColor: 'white'},
        }}
      />
      {/*<Stack.Screen*/}
      {/*  name="EditProfile"*/}
      {/*  component={EditProfileScreen}*/}
      {/*  options={({navigation}) => ({*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerTitle: 'Редактирование профиля',*/}
      {/*    headerLeft: () => renderCloseButton(navigation),*/}
      {/*  })}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="CodeEnter"*/}
      {/*  component={CodeEnterScreen}*/}
      {/*  options={{*/}
      {/*    ...TransitionPresets.DefaultTransition,*/}
      {/*    headerShown: false,*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="Health"*/}
      {/*  component={HealthScreen}*/}
      {/*  options={({navigation}) => ({*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerTitle: 'Сведения о здоровье',*/}
      {/*    headerLeft: () => renderCloseButton(navigation),*/}
      {/*  })}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="Injury"*/}
      {/*  component={InjuryScreen}*/}
      {/*  options={({navigation}) => ({*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerTitle: 'Сведения о травмах',*/}
      {/*    headerLeft: () => renderCloseButton(navigation),*/}
      {/*  })}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="QRCode"*/}
      {/*  component={QRCodeScreen}*/}
      {/*  options={{*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerShown: false,*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="Pool"*/}
      {/*  component={PoolScreen}*/}
      {/*  options={({navigation}) => ({*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerTitle: 'Опрос',*/}
      {/*    headerLeft: () => renderCloseButton(navigation),*/}
      {/*  })}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="SubmitError"*/}
      {/*  component={SubmitErrorScreen}*/}
      {/*  options={() => ({*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerTitle: 'Сообщить об ошибке',*/}
      {/*    headerLeft: () => <BackButton />,*/}
      {/*  })}*/}
      {/*/>*/}
      {/*<Stack.Screen*/}
      {/*  name="Help"*/}
      {/*  component={HelpScreen}*/}
      {/*  options={() => ({*/}
      {/*    ...TransitionPresets.SlideFromRightIOS,*/}
      {/*    headerTitle: 'Справка',*/}
      {/*    headerLeft: () => <BackButton />,*/}
      {/*  })}*/}
      {/*/>*/}
    </>
  );
}

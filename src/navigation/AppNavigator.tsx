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
import {Order, Product} from '../redux/ProductsDataSlice';
import {BasketItem} from '../redux/BasketDataReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import SearchScreen from '../components/SearchComponents/SearchScreen';
import OrderSuccessScreen from '../components/OrderSuccessComponents/OrderSuccessScreen';
import OrderInfoScreen from '../components/OrderInfoComponents/OrderInfoScreen';
import AgreementScreen from '../components/AgreementComponents/AgreementScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CheckPhoneScreen from '../components/AuthComponents/CheckPhoneScreen';
import EditPhoneScreen from '../components/AuthComponents/EditPhoneScreen';

export type AppStackParamList = {
  Agreement: undefined;
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
  EnterName: {phone: string; tempName: string};
  EnterBirthday: {phone: string};
  EditPhone: {phone: string; tempName: string};
  ChangeRestaraunt: {activeTab: number};
  OrderSuccess: undefined;
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
  OrderInfo: {order: Order};
  CheckPhone: {phone: string; formattedPhone: string; tempName: string};
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
    marginLeft: 8,
    fontFamily: 'SFProDisplay-Regular',
  },
  headerBackImage: _ => (
    <Image
      style={{width: 12, height: 21, marginHorizontal: 6}}
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
  const insets = useSafeAreaInsets();

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
        options={{
          title: '???????????? ????????????????',
          headerBackTitle: '????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <MenuStack.Screen
        name="AddEditAddressSelect"
        component={AddEditAddressScreen}
        options={{
          title: '?????????? ????????????????',
          headerBackTitle: '??????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
    </MenuStack.Navigator>
  );
}

function ProfileTab() {
  const insets = useSafeAreaInsets();
  return (
    <ProfileStack.Navigator screenOptions={options}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '??????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ProfileStack.Screen
        name="DeliveryList"
        component={DeliveryListScreen}
        options={{
          title: '???????????? ????????????????',
          headerBackTitle: '??????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ProfileStack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: '?????????????? ??????????????',
          headerBackTitle: '??????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '??????????????????',
          headerBackTitle: '??????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ProfileStack.Screen
        name="BonucesStocks"
        component={BonucesStocksScreen}
        options={{
          title: '???????????? ?? ??????????',
          headerBackTitle: '??????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ProfileStack.Screen
        name="AddEditAddress"
        component={AddEditAddressScreen}
        options={{
          title: '?????????? ????????????????',
          headerBackTitle: '??????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ProfileStack.Screen
        name="OrderInfo"
        component={OrderInfoScreen}
        options={{
          title: '???????????????????? ?? ????????????',
          headerBackTitle: '??????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
    </ProfileStack.Navigator>
  );
}

function ContactsTab() {
  const insets = useSafeAreaInsets();

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
        options={{
          title: '?? ????????????????????',
          headerBackTitle: '????????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <ContactsStack.Screen
        name="Map"
        component={MapScreen}
        options={{title: '?????????????????? ???? ??????????', headerBackTitle: '????????????????'}}
      />
    </ContactsStack.Navigator>
  );
}

function BasketTab() {
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  const insets = useSafeAreaInsets();

  return (
    <BasketStack.Navigator screenOptions={options}>
      <BasketStack.Screen
        name="Basket"
        component={BasketScreen}
        options={() => ({
          title: '??????????????',
          headerShown: basket.length === 0,
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        })}
      />
      <BasketStack.Screen
        name={'OrderDelivery'}
        component={OrderDeliveryScreen}
        options={() => ({
          title: '',
          headerLeft: () => <View />,
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        })}
      />
      <BasketStack.Screen
        name="DeliveryListBasket"
        component={DeliveryListScreen}
        options={{
          title: '???????????? ????????????????',
          headerBackTitle: '????????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
      <BasketStack.Screen
        name="AddEditAddressBasket"
        component={AddEditAddressScreen}
        options={{
          title: '?????????? ????????????????',
          headerBackTitle: '??????????',
          headerStyle: {height: 50 + insets.top, backgroundColor: '#F2F2F2'},
        }}
      />
    </BasketStack.Navigator>
  );
}

function Home() {
  const basket: Array<BasketItem> = useSelector(
    (state: RootState) => state.basket.basket,
  );
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        inactiveTintColor: 'gray',
        style: {
          height: 80 + insets.bottom,
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
                ????????
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
                ??????????????
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
                ????????????????
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
                ??????????????
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
  const insets = useSafeAreaInsets();

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
        name={'OrderSuccess'}
        component={OrderSuccessScreen}
        options={{
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
            marginLeft: 16,

            fontFamily: 'SFProDisplay-Regular',
          },
          headerBackTitle: '????????????',
          headerBackTitleVisible: true,
          headerBackImage: _ => <View />,
          headerTitle: '??????????????????',
          headerTitleStyle: {
            color: 'black',
            fontSize: 17,
            fontFamily: 'SFProDisplay-Bold',
          },
          headerStyle: {backgroundColor: '#F7F7F7', paddingTop: insets.top},
        }}
      />
      <Stack.Screen
        name={'Agreement'}
        component={AgreementScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginHorizontal: 8}}
              source={require('../assets/back.png')}
            />
          ),
          headerPressColorAndroid: 'transparent',
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerTitleAlign: 'center',
          headerBackTitleStyle: {
            color: '#28B3C6',
            fontSize: 14,
            marginLeft: 4,
            fontFamily: 'SFProDisplay-Regular',
          },
          headerBackTitle: '??????????',
          headerBackTitleVisible: true,
          headerTitle: '????????????????????',
          headerTitleStyle: {
            color: 'black',
            fontSize: 17,
            fontFamily: 'SFProDisplay-Bold',
          },
          headerStyle: {backgroundColor: '#F7F7F7', paddingTop: insets.top},
        }}
      />
      <Stack.Screen
        name={'EnterPhone'}
        component={EnterPhoneScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerBackTitleVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'white',
            height: 50 + insets.top,
          },
        }}
      />
      <Stack.Screen
        name={'EnterCode'}
        component={EnterCodeScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginHorizontal: 8}}
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
          headerBackTitle: '??????????????',
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'white',
            height: 50 + insets.top,
          },
        }}
      />
      <Stack.Screen
        name={'EnterName'}
        component={EnterNameScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginHorizontal: 8}}
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
          headerStyle: {
            backgroundColor: 'white',
            height: 50 + insets.top,
          },
        }}
      />
      <Stack.Screen
        name={'CheckPhone'}
        component={CheckPhoneScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginHorizontal: 8}}
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
          headerStyle: {
            backgroundColor: 'white',
            height: 50 + insets.top,
          },
        }}
      />
      <Stack.Screen
        name={'EditPhone'}
        component={EditPhoneScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginHorizontal: 8}}
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
          headerStyle: {
            backgroundColor: 'white',
            height: 50 + insets.top,
          },
        }}
      />
      <Stack.Screen
        name={'EnterBirthday'}
        component={EnterBirthdayScreen}
        options={{
          headerBackImage: _ => (
            <Image
              style={{width: 12, height: 21, marginHorizontal: 8}}
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
          headerStyle: {
            backgroundColor: 'white',
            height: 50 + insets.top,
          },
        }}
      />
    </>
  );
}

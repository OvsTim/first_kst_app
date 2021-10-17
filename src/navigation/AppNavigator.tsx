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
  Product: undefined;
  OrderDelivery: undefined;
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
      style={{width: 12, height: 21}}
      source={require('../assets/back.png')}
    />
  ),
  headerTitleStyle: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'SFProDisplay-Bold',
  },
};
const StyledText = withFont(Text);

function MenuTab() {
  return (
    <MenuStack.Navigator screenOptions={options}>
      <MenuStack.Screen name="Menu" component={MenuScreen} options={{}} />
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
  return (
    <BasketStack.Navigator screenOptions={options}>
      <BasketStack.Screen
        name="Basket"
        component={BasketScreen}
        options={() => ({title: 'Корзина'})}
      />
      <BasketStack.Screen
        name={'OrderDelivery'}
        component={OrderDeliveryScreen}
        options={() => ({title: '', headerLeft: () => <View />})}
      />
    </BasketStack.Navigator>
  );
}

function Home() {
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
                    1
                  </StyledText>
                </View>
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

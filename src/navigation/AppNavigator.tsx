import 'react-native-gesture-handler';
import * as React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {vScale} from '../utils/scaling';
import MenuScreen from '../components/MainTabComponents/MenuScreen';
import ProfileScreen from '../components/MainTabComponents/ProfileScreen';
import ContactsScreen from '../components/MainTabComponents/ContactsScreen';
import BasketScreen from '../components/MainTabComponents/BasketScreen';
import {Image, Text, View} from 'react-native';
import {withFont} from '../components/_CustomComponents/HOC/withFont';
import AboutScreen from '../components/AboutComponents/AboutScreen';

export type AppStackParamList = {
  Home: undefined;
  Basket: undefined;
  Contacts: undefined;
  Menu: undefined;
  Profile: undefined;
  About: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
const MenuStack = createStackNavigator<AppStackParamList>();
const ProfileStack = createStackNavigator<AppStackParamList>();
const PoolsStack = createStackNavigator<AppStackParamList>();
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
  headerBackTitleStyle: {color: '#28B3C6', fontSize: 14, marginLeft: 4},
  headerBackImage: _ => (
    <Image
      style={{width: 12, height: 21}}
      source={require('../assets/back.png')}
    />
  ),
  headerTitleStyle: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
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
        options={{}}
      />
    </ProfileStack.Navigator>
  );
}

function ContactsTab() {
  return (
    <PoolsStack.Navigator screenOptions={options}>
      <PoolsStack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{headerShown: false}}
      />
      <PoolsStack.Screen
        name="About"
        component={AboutScreen}
        options={{title: 'О приложении', headerBackTitle: 'Контакты'}}
      />
    </PoolsStack.Navigator>
  );
}

function BasketTab() {
  return (
    <BasketStack.Navigator screenOptions={options}>
      <BasketStack.Screen
        name="Basket"
        component={BasketScreen}
        options={() => ({})}
      />
    </BasketStack.Navigator>
  );
}

function Home() {
  return (
    <Tab.Navigator
      tabBarOptions={{
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
          tabBarIcon: ({focused, color, size}) => {
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
          tabBarIcon: ({focused, color, size}) => {
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
          tabBarIcon: ({focused, color, size}) => {
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
          tabBarIcon: ({focused, color, size}) => {
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
                    top: 5,
                    position: 'absolute',
                    width: 13,
                    height: 13,
                    backgroundColor: '#FF4545',
                    borderRadius: 13 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: 7, color: 'white'}}>1</Text>
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

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

export type AppStackParamList = {
  Home: undefined;
  Basket: undefined;
  Contacts: undefined;
  Menu: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
const MenuStack = createStackNavigator<AppStackParamList>();
const ProfileStack = createStackNavigator<AppStackParamList>();
const PoolsStack = createStackNavigator<AppStackParamList>();
const BasketStack = createStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppStackParamList>();

const options: StackNavigationOptions = {
  headerStyle: {
    height: vScale(50),
    backgroundColor: '#67b437',
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    color: 'white',
    fontSize: vScale(14),
  },
};

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
        options={{}}
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
        activeTintColor: '#67b437',
        inactiveTintColor: 'gray',
        labelStyle: {fontSize: 13},
        style: {
          height: 60,
          paddingBottom: 3,
        },
      }}>
      <Tab.Screen
        name="Menu"
        component={MenuTab}
        options={{
          title: 'Меню',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          title: 'Скидки',
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsTab}
        options={{
          title: 'Контакты',
        }}
      />
      <Tab.Screen
        name="Basket"
        component={BasketTab}
        options={{
          title: 'Корзина',
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

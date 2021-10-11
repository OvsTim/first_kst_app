import 'react-native-gesture-handler';
import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import {NavigationContainerRef} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {StatusBar} from 'react-native';

export default function AppWithNavigationState() {
  useEffect(() => {
    console.log('useEffect splash');
    SplashScreen.hide();
  }, []);
  const routeNameRef = React.useRef<string | undefined>('');
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: 'white',
        },
      }}
      ref={navigationRef}
      onReady={() => {
        if (navigationRef.current !== null) {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          //analytics
          /*
          *  await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName
          });*/
        }

        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'#2E7E13'}
        barStyle="light-content"
      />
      <MainNavigator />
    </NavigationContainer>
  );
}

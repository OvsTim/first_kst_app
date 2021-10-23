import 'react-native-gesture-handler';
import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import {NavigationContainerRef} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {StatusBar} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import YaMap from 'react-native-yamap';
import {useAppDispatch} from '../redux';
import {setFirebaseToken} from '../redux/UserDataSlice';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default function AppWithNavigationState() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log('useEffect splash');
    SplashScreen.hide();
    YaMap.init('5f991160-3890-4d3c-acc4-59203f61edd3');
  }, []);
  const routeNameRef = React.useRef<string | undefined>('');
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  useEffect(() => {
    requestUserPermission().then(() => {
      messaging()
        .getToken()
        .then(fcm_token => {
          console.log('TOKEN', fcm_token);
          dispatch(setFirebaseToken(fcm_token));
          // sendTokenToServer(fcm_token, token);
        });
    });
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    messaging().onMessage(async remoteMessage => {
      console.log('onMessage', remoteMessage);
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('backgroundMessageHandler', remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    return messaging().onTokenRefresh(fcm_token => {
      console.log('REFRESH TOKEN', fcm_token);
      // dispatch(setFirebaseToken(fcm_token));
      // sendTokenToServer(fcm_token, token);
    });
  }, []);
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

          analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <MainNavigator />
    </NavigationContainer>
  );
}

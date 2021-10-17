import React, {useState, useEffect} from 'react';
import {
  Button,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useAppDispatch} from '../../redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {hScale, vScale, window} from '../../utils/scaling';
import {setAuthData} from '../../redux/UserDataSlice';
import auth, {ConfirmationResult} from '@react-native-firebase/auth';
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'SearchShop'>;
};

export default function SearchShopScreen({}: Props) {
  const dispatch = useAppDispatch();
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    auth()
      .signInAnonymously()
      .then(() => {
        // console.log('User signed in anonymously');
        // console.log('user', auth().currentUser);
        // firestore()
        //   .collection('contacts')
        //   .doc('contact_data')
        //   .get()
        //   .then(res => {
        //     console.log('result', res);
        //   });
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });
  }, []);

  //region handlers

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber: string) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
    console.log('confirmation', confirmation);
    setConfirm(confirmation);
    // const res = await confirmation.confirm('123456');
    // console.log('resConfirm', res);
  }
  //endregion handlers

  //region jsx

  function renderContent() {
    return (
      <View style={styles.container}>
        <Button
          title={'Javascript Crash Now.'}
          onPress={() => {
            // undefinedVariable.notAFunction();
          }}
        />
        <View style={{height: 50}} />
        <Button
          title={'Перейти в основную часть'}
          onPress={() => {
            dispatch(
              setAuthData({
                token: 'new token kjhfkjdhgkdshf',
                user_id: '123',
                phone: '+789789494',
                surname: 'Фомин',
                name: 'Илья',
                last_name: 'Вячеславович',
              }),
            );
          }}
        />
        <View style={{height: 50}} />

        <Button
          title={'Войти по телефону(тест)'}
          onPress={() => signInWithPhoneNumber('+79610268213')}
        />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      {renderContent()}
    </TouchableWithoutFeedback>
  );
  //endregion jsx
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {
    color: 'black',
    fontSize: hScale(15),
    textAlign: 'center',
  },
  text_underline: {
    color: 'black',
    fontSize: hScale(15),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  text_input_mask: {
    width: window().width - hScale(32),
    height: vScale(44),
    paddingRight: hScale(32),
    paddingLeft: hScale(12),
    fontSize: vScale(14),
    backgroundColor: 'transparent',
    borderWidth: vScale(1),
    borderRadius: vScale(6),
    color: 'black',
  },
  logo: {
    width: hScale(249),
    height: vScale(52),
    marginTop: vScale(39),
  },
});

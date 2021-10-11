import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import {useAppDispatch} from '../../redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {hScale, vScale, window} from '../../utils/scaling';
import TextInputMask from 'react-native-text-input-mask';
import {setAuthData} from '../../redux/UserDataSlice';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'SearchShop'>;
};

export default function SearchShopScreen({}: Props) {
  const dispatch = useAppDispatch();

  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    const timer = setTimeout(() => {
      decrementTime();
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (error) {
      Vibration.vibrate(70);
    }
  }, [error]);

  useEffect(() => {
    if (code.length === 4) {
      Keyboard.dismiss();
      if (code !== '1234') {
        setError(true);
      } else {
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
      }
    } else {
      setError(false);
    }
  }, [code]);

  //region handlers
  function decrementTime() {
    if (timeLeft === 0) {
      return;
    }

    setTimeLeft(timeLeft - 1);
  }
  //endregion handlers

  //region jsx

  function renderInput() {
    return (
      <View>
        <Text
          style={{
            fontSize: vScale(12),
            marginLeft: hScale(5),
            marginBottom: vScale(4),
          }}>
          {'Код доступа'}
        </Text>
        <TextInputMask
          keyboardType={'number-pad'}
          style={[
            styles.text_input_mask,
            {borderColor: error ? 'red' : 'black'},
          ]}
          value={code}
          placeholderTextColor={'gray'}
          underlineColorAndroid={'rgba(0,0,0,0)'}
          selectionColor={'black'}
          mask={'[0000]'}
          onChangeText={(formatted, extracted) => {
            // @ts-ignore
            setCode(extracted);
          }}
        />
      </View>
    );
  }

  function renderContent() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={false}
          backgroundColor={'rgba(0,0,0,0.1)'}
          barStyle="dark-content"
        />
        {renderInput()}
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
  container: {flex: 1, alignItems: 'center'},
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

import React, {useState} from 'react';
import {Alert, StatusBar, Text, View} from 'react-native';
import BaseButton from '../_CustomComponents/BaseButton';
import {setAuthData} from '../../redux/UserDataSlice';
import {useAppDispatch, useSelector} from '../../redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {unwrapResult} from '@reduxjs/toolkit';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import {hScale, vScale} from '../../utils/scaling';
import {useTranslation} from 'react-i18next';
import BaseInput from '../_CustomComponents/BaseInput';
import {fetchImages} from '../../redux/thunks';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'One'>;
};

const Button = withPressable(View);

export default function OneScreen({navigation}: Props) {
  const [counter, setCounter] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const {t, i18n} = useTranslation('main');
  const dispatch = useAppDispatch();
  const token = useSelector<string>(state => state.data.token);

  //region handlers
  function fetchImagesFromServer() {
    //todo set loading true
    dispatch(fetchImages('https://picsum.photos/v2/list/'))
      .then(unwrapResult)
      .then(originalPromiseResult => {
        //todo set loading false
        console.log('originalPromiseResult', originalPromiseResult);
      })
      .catch(rejectedValueOrSerializedError => {
        //todo set loading false
        Alert.alert('Ошибка', rejectedValueOrSerializedError);
      });
  }
  //endregion handlers

  //region jsx
  function renderButtons() {
    return (
      <View>
        <Button
          containerStyle={{
            width: hScale(300),
            height: vScale(42),
            borderRadius: hScale(16),
            backgroundColor: 'yellow',
          }}
          androidRippleRadius={200}
          onPress={() => {
            let lang = i18n.language;
            i18n.changeLanguage(lang === 'en' ? 'ru' : 'en');
          }}>
          <Text>{'change lang'}</Text>
        </Button>
        <Button
          containerStyle={{
            width: hScale(300),
            height: vScale(42),
            borderRadius: hScale(16),
            backgroundColor: 'green',
          }}
          androidRippleRadius={200}
          loading={loading}
          onPress={() => {
            console.log('pressed');
            setLoading(!loading);
          }}>
          <Text>{'loading button'}</Text>
        </Button>
        <BaseButton
          text="increment counter"
          onPress={() => {
            setCounter(counter + 1);
          }}
        />
        <BaseButton
          text="Move"
          onPress={() => {
            navigation.navigate('Three', {paramString: 'param'});
          }}
        />
        <BaseButton
          text="fetchImages"
          onPress={() => {
            fetchImagesFromServer();
          }}
        />
        <BaseButton
          text="setToken and Go App"
          onPress={() =>
            dispatch(
              setAuthData({token: 'new token kjhfkjdhgkdshf', user_id: '123'}),
            )
          }
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>One Screen</Text>
      <BaseInput />
      <Text>{token}</Text>
      <Text>{'counter  ' + counter}</Text>
      <Text>{t('localization_sample')}</Text>
      {renderButtons()}
    </View>
  );
  //endregion jsx
}

import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from '../../redux';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'EnterBirthday'>;
};
const StyledText = withFont(Text);
export default function EnterBirthdayScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const firebase_token: string = useSelector(
    state => state.data.firebase_token,
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(
    false,
  );
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setIsFirstTime(false);
  };

  const handleConfirm = (date: Date | null) => {
    if (date && !isFirstTime) {
      setDate(date);
    } else if (
      date &&
      isFirstTime &&
      date.getFullYear() !== 1990 &&
      date.getMonth() !== 2 &&
      date.getDate() !== 1
    ) {
      setDate(date);
    }

    setIsFirstTime(false);
    hideDatePicker();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <StyledText
        style={{
          fontWeight: '700',
          color: 'black',
          fontSize: 24,
          marginTop: 42,
        }}>
        Дата рождения
      </StyledText>

      <Pressable onPress={() => showDatePicker()}>
        <StyledText
          style={{
            fontWeight: '400',
            fontSize: 25,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#0000001A',
            width: width - 80,
            marginTop: 30,
            paddingHorizontal: 20,
            letterSpacing: 10,
          }}>
          {date ? dayjs(date).format('DD/MM/YYYY') : ''}
        </StyledText>
      </Pressable>
      <View style={{height: 50}} />
      <BaseButton
        containerStyle={{
          backgroundColor: date === null ? '#00000026' : '#28B3C6',
        }}
        active={date !== null}
        text={'Продолжить'}
        loading={loading}
        onPress={() => {
          if (date) {
            setLoading(true);
            firestore()
              .collection('Пользователи')
              .doc(auth().currentUser?.uid)
              .set({
                // @ts-ignore
                ДеньРождения: new firestore.Timestamp.fromDate(
                  new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    12,
                    0,
                    0,
                    0,
                  ),
                ),
                ИД: auth().currentUser?.uid,
                Токен: firebase_token,
                Почта: '',
              })
              .then(_ => {
                firestore()
                  .collection('Пользователи')
                  .doc(auth().currentUser?.uid)
                  .collection('Адреса')
                  .add({
                    Название: '',
                    Дом: '',
                    Квартира: '',
                    КодДомофона: '',
                    Комментарий: '',
                    Подъезд: '',
                    Улица: '',
                    Этаж: '',
                  })
                  .then(_ => {
                    setLoading(false);
                    navigation.popToTop();
                  })
                  .catch(er => {
                    setLoading(false);
                    Alert.alert(
                      'Ошибка',
                      'Произошла ошибка с кодом ' +
                        er.code +
                        ', повторите попытку позже',
                    );
                  });
              })
              .catch(er => {
                setLoading(false);
                Alert.alert(
                  'Ошибка',
                  'Произошла ошибка с кодом ' +
                    er.code +
                    ', повторите попытку позже',
                );
              });
          }
        }}
      />
      <DateTimePickerModal
        minimumDate={new Date(1940, 1, 1)}
        date={new Date(1990, 1, 1)}
        display={'spinner'}
        confirmTextIOS={'Выбрать'}
        cancelTextIOS={'Отменить'}
        maximumDate={
          new Date(
            new Date().getFullYear() - 12,
            new Date().getMonth(),
            new Date().getDate(),
          )
        }
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

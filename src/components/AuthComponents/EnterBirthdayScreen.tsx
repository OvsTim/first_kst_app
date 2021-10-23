import React, {useState} from 'react';
import {
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    if (date) {
      setDate(date);
    }

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
        onPress={() => {
          if (date) {
            firestore()
              .collection('Пользователи')
              .doc(auth().currentUser?.uid)
              .set({
                ДеньРождения: new firestore.Timestamp(
                  date?.getTime() / 1000,
                  0,
                ),
                ИД: auth().currentUser?.uid,
                Токен: firebase_token,
              })
              .then(_ => {
                navigation.popToTop();
              });
          }
        }}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

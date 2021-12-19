import React, {useState} from 'react';
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {getFontName, withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import auth from '@react-native-firebase/auth';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'EnterName'>;
};
const StyledText = withFont(Text);
export default function EnterNameScreen({navigation}: Props) {
  const {width} = useWindowDimensions();

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
      <StatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <StyledText style={{fontWeight: '700', color: 'black', fontSize: 24}}>
        Как Вас зовут?
      </StyledText>
      <TextInput
        autoFocus={true}
        value={name}
        style={{
          borderColor: '#00000026',
          borderWidth: 1,
          borderRadius: 10,
          width: width - 90,
          height: 53,
          paddingHorizontal: 16,
          fontSize: 24,
          marginTop: 30,
          marginBottom: 50,
          fontFamily: getFontName('400'),
        }}
        keyboardType={'default'}
        textContentType={'name'}
        onChangeText={text => {
          setName(text.replace(/[^A-Za-zА-Яа-я-\s!?]/g, ''));
        }}
        placeholder={''}
      />

      <BaseButton
        containerStyle={{
          backgroundColor: name.trim().length < 2 ? '#00000026' : '#28B3C6',
        }}
        active={name.trim().length >= 2}
        text={'Продолжить'}
        loading={loading}
        onPress={() => {
          if (name.trim().length >= 2) {
            setLoading(true);
            auth()
              .currentUser?.updateProfile({displayName: name.trim()})
              .then(_ => {
                setLoading(false);
                navigation.navigate('EnterBirthday');
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
    </View>
  );
}

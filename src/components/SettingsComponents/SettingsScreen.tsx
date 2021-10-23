import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import Switch from 'react-native-switch-pro';
import NewBaseInput from '../_CustomComponents/NewBaseInput';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Settings'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);
export default function SettingsScreen({navigation}: Props) {
  const {width} = useWindowDimensions();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {}} containerStyle={{width: 81, height: 24}}>
          <StyledText
            style={{fontWeight: '700', color: '#28B3C6', fontSize: 18}}>
            Готово
          </StyledText>
        </Button>
      ),
    });
  }, [navigation]);

  function validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function renderInputs() {
    return (
      <>
        <NewBaseInput
          value={'Александр'}
          styleInput={{}}
          styleContainer={{}}
          editable={true}
          placeholder={'Имя'}
          showLabel={true}
          label={'Имя'}
          inputProps={{
            keyboardType: 'default',
            textContentType: 'name',
            maxLength: 30,
          }}
          labelStyle={{}}
        />
        <NewBaseInput
          value={'+7 705 303 13 51'}
          styleInput={{}}
          styleContainer={{}}
          editable={false}
          placeholder={'Телефон'}
          showLabel={true}
          label={'Телефон'}
          inputProps={{}}
          labelStyle={{}}
        />
        <NewBaseInput
          value={'mrantonyarafb@gmail.com'}
          styleInput={{}}
          styleContainer={{}}
          editable={true}
          placeholder={'Email'}
          showLabel={true}
          label={'Email'}
          inputProps={{
            keyboardType: 'email-address',
            textContentType: 'emailAddress',
          }}
          labelStyle={{}}
        />
        <NewBaseInput
          value={'9 июля'}
          styleInput={{}}
          styleContainer={{}}
          editable={false}
          placeholder={'День рождения'}
          showLabel={true}
          label={'День рождения'}
          inputProps={{}}
          labelStyle={{}}
        />
      </>
    );
  }

  function renderNotifications() {
    return (
      <View style={{borderBottomWidth: 1, borderBottomColor: '#F2F2F6'}}>
        <StyledText
          style={{
            fontSize: 18,
            alignSelf: 'flex-start',
            marginTop: 39,
            color: 'black',
            fontWeight: '700',
          }}>
          Уведомления
        </StyledText>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 33,
            marginRight: 22,
            width: width - 19 - 22,
            justifyContent: 'space-between',
          }}>
          <View>
            <StyledText
              style={{
                fontWeight: '500',
                color: 'black',
                width: width / 2,
                fontSize: 15,
                lineHeight: 19,
              }}>
              Сообщать о бонусах, акциях, новинках и статусе заказа
            </StyledText>
            <StyledText
              style={{
                color: '#00000080',
                marginTop: 4,
                fontWeight: '400',
                fontSize: 12,
                lineHeight: 14,
                marginBottom: 26,
              }}>
              Пуш-уведомления, смс
            </StyledText>
          </View>
          <Switch
            backgroundActive={'#65C466'}
            width={53}
            height={35}
            circleColorActive={'white'}
            circleColorInactive={'white'}
            style={{paddingHorizontal: 3}}
            circleStyle={{width: 27, height: 27}}
          />
        </View>
      </View>
    );
  }

  function renderLogoutDelete() {
    return (
      <View
        style={{
          alignItems: 'flex-start',
          marginTop: 26,
          width: width - 19,
        }}>
        <Button onPress={() => {}} containerStyle={{}}>
          <StyledText
            style={{
              color: '#28B3C6',
              fontWeight: '500',
              fontSize: 18,
              lineHeight: 23,
            }}>
            Выйти из акканута
          </StyledText>
        </Button>
        <View style={{height: 11}} />
        <Button
          onPress={() =>
            Alert.alert(
              'Удаление аккаунта',
              'Внимание! Данное действие приведет к удалению всей истории заказов',
              [
                {style: 'cancel', text: 'Отменить'},
                {style: 'destructive', text: 'Удалить'},
              ],
            )
          }
          containerStyle={{}}>
          <StyledText
            style={{
              color: '#FF0000',
              fontWeight: '500',
              fontSize: 18,
              lineHeight: 23,
            }}>
            Удалить аккаунт
          </StyledText>
        </Button>
        <StyledText
          style={{
            width: width / 2,
            fontWeight: '400',
            color: '#00000080',
            fontSize: 10,
            lineHeight: 13,
          }}>
          Внимание! Данное действие приведет к удалению всей истории заказов.
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <StatusBar
        translucent={false}
        backgroundColor={'#f2f2f2'}
        barStyle="dark-content"
      />
      {renderInputs()}
      {renderNotifications()}
      {renderLogoutDelete()}
    </ScrollView>
  );
}

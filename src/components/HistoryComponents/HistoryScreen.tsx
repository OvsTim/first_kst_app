import React, {useState} from 'react';
import {
  FlatList,
  Image,
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
import DropShadow from 'react-native-drop-shadow';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'History'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);
export default function HistoryScreen({}: Props) {
  const {width} = useWindowDimensions();
  const [auth, setAuth] = useState<boolean>(false);

  function renderEmpty() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <Image
          style={{width: width - 30, height: 300}}
          source={require('../../assets/ph_history.png')}
        />
        <StyledText
          style={{
            fontWeight: '700',
            fontSize: 30,
            color: 'black',
            marginTop: 20,
          }}>
          Нет истории заказов
        </StyledText>
        <StyledText
          style={{
            fontWeight: '400',
            width: width - 50,
            fontSize: 17,
            lineHeight: 18,
            color: 'black',
            textAlign: 'center',
            marginTop: 8,
          }}>
          Здесь будем хранить все ваши заказы. Чтобы сделать первый, перейдите в
          меню.
        </StyledText>
        <View style={{height: 27}} />
        <BaseButton
          width={width - 66 - 67}
          text={'Перейти в меню'}
          onPress={() => setAuth(true)}
        />
      </View>
    );
  }

  function renderItem() {
    return (
      <DropShadow
        style={{
          marginVertical: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }}>
        <View
          style={{
            width: width - 46,
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <Pressable onPress={() => {}}>
            <StyledText
              style={{
                color: '#00000080',
                fontWeight: '500',
                marginTop: 13,
                marginLeft: 27,
                fontSize: 12,
                lineHeight: 14,
              }}>
              № 2904
            </StyledText>
            <StyledText
              style={{
                color: 'black',
                fontWeight: '700',
                fontSize: 22,
                lineHeight: 24,
                marginHorizontal: 27,
                marginTop: 17,
                paddingBottom: 17,
                borderBottomWidth: 1,
                borderBottomColor: '#F2F2F6',
              }}>
              9 октября 2021 г. в 13:12
            </StyledText>
            <StyledText
              style={{
                marginTop: 15,
                marginLeft: 27,
                color: '#00000080',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 14,
              }}>
              На доставку / на самовывоз
            </StyledText>
            <StyledText
              style={{
                marginTop: 4,
                marginLeft: 27,
                marginRight: 26,
                fontWeight: '400',
                fontSize: 15,
                lineHeight: 18,
                color: 'black',
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F2F2F6',
              }}>
              Костанай, микрорайон Юбилейный, 39
            </StyledText>
          </Pressable>
          <FlatList
            style={{paddingLeft: 27, marginVertical: 10}}
            data={[
              'gs://firstkst.appspot.com/images/eggs.png',
              'gs://firstkst.appspot.com/images/nabor.png',
              'gs://firstkst.appspot.com/images/pancaces.png',
              'gs://firstkst.appspot.com/images/porridge.png',
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            ListFooterComponent={() => <View style={{width: 50}} />}
            renderItem={({item}) => (
              <>
                <View
                  style={{
                    overflow: 'hidden',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FirebaseImage
                    innerUrl={item}
                    imageStyle={{
                      resizeMode: 'cover',
                      width: 135,
                      height: 82,
                    }}
                  />
                </View>
                <View style={{width: 10}} />
              </>
            )}
          />
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#F2F2F6',
              borderTopWidth: 1,
              borderTopColor: '#F2F2F6',
              paddingTop: 11,
              paddingBottom: 13,
              marginHorizontal: 27,
              justifyContent: 'space-between',
            }}>
            <StyledText
              style={{
                color: 'black',
                fontSize: 14,
                lineHeight: 14,
                fontWeight: '700',
              }}>
              Сумма
            </StyledText>
            <StyledText
              style={{
                color: 'black',
                fontSize: 14,
                lineHeight: 14,
                fontWeight: '700',
              }}>
              {'2 000 ₸'}
            </StyledText>
          </View>
          <View style={{height: 10}} />
          <View style={{borderRadius: 15, overflow: 'hidden'}}>
            <Button onPress={() => {}} containerStyle={{}}>
              <View style={{flexDirection: 'row', marginVertical: 20}}>
                <Image
                  style={{width: 16, height: 16}}
                  source={require('../../assets/restart.png')}
                />
                <StyledText
                  style={{
                    marginLeft: 6,
                    color: '#1FA7B5',
                    fontWeight: '400',
                    fontSize: 18,
                    lineHeight: 21,
                  }}>
                  Повторить заказ
                </StyledText>
              </View>
            </Button>
          </View>
        </View>
      </DropShadow>
    );
  }

  function renderList() {
    return (
      <View
        style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        <FlatList
          contentContainerStyle={{width, alignItems: 'center'}}
          data={[1]}
          renderItem={() => renderItem()}
        />
      </View>
    );
  }

  return auth ? renderList() : renderEmpty();
}

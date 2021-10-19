import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import BaseButton from '../_CustomComponents/BaseButton';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';
import AuthBaseInput from '../_CustomComponents/AuthBaseInput';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'OrderDelivery'>;
};
const StyledText = withFont(Text);
export default function OrderDeliveryScreen({navigation}: Props) {
  const {width} = useWindowDimensions();

  const [paymentWay, setPaymentWay] = useState<'cash' | 'card' | 'caspi'>(
    'cash',
  );

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [sdacha, setSdacha] = useState<string>('');
  function renderHeaderAndAddress() {
    return (
      <>
        <StyledText
          style={{
            fontWeight: '700',
            alignSelf: 'flex-start',
            marginLeft: 34,
            marginVertical: 25,
            color: 'black',
            fontSize: 25,
          }}>
          Доставка
        </StyledText>
        <View
          style={{
            width: width - 68,
            backgroundColor: '#0606060D',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <StyledText
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{
              fontSize: 15,
              fontWeight: '400',
              width: width - 100,
              marginTop: 16,
              paddingBottom: 10,
              color: 'black',
              borderBottomColor: '#0000001A',
              borderBottomWidth: 1,
            }}>
            Баймагамбетова 1/2
          </StyledText>
          <View style={{overflow: 'hidden', borderRadius: 15}}>
            <Pressable
              onPress={() => {}}
              android_ripple={{color: 'gray', radius: 200}}
              style={{paddingVertical: 15, width: width - 68}}>
              <StyledText
                style={{marginLeft: 15, color: '#28B3C6', fontWeight: '400'}}>
                Выбрать другой адрес
              </StyledText>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  function renderPaymentWays() {
    return (
      <>
        <StyledText
          style={{
            fontWeight: '700',
            alignSelf: 'flex-start',
            marginLeft: 34,
            marginVertical: 22,
            color: 'black',
            fontSize: 25,
          }}>
          Способ оплаты
        </StyledText>
        <View
          style={{
            width: width - 68,
            backgroundColor: '#0606060D',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 15,
              borderBottomColor: '#0000001A',
              borderBottomWidth: 1,
            }}>
            <Pressable
              onPress={() => setPaymentWay('cash')}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                paddingVertical: 12,
                width: width - 68,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginLeft: 23,
                  marginRight: 10,
                  tintColor: paymentWay === 'cash' ? '#28B3C6' : 'black',
                }}
                source={require('../../assets/Cash.png')}
              />
              <StyledText
                style={{
                  color: paymentWay === 'cash' ? '#28B3C6' : 'black',
                  fontWeight: '400',
                }}>
                Наличными курьеру
              </StyledText>
            </Pressable>
          </View>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 15,
              borderBottomColor: '#0000001A',
              borderBottomWidth: 1,
            }}>
            <Pressable
              onPress={() => setPaymentWay('card')}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                paddingVertical: 12,
                width: width - 68,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginLeft: 23,
                  marginRight: 10,
                  tintColor: paymentWay === 'card' ? '#28B3C6' : 'black',
                }}
                source={require('../../assets/Visa.png')}
              />
              <StyledText
                style={{
                  color: paymentWay === 'card' ? '#28B3C6' : 'black',
                  fontWeight: '400',
                }}>
                Картой курьеру
              </StyledText>
            </Pressable>
          </View>
          <View style={{overflow: 'hidden', borderRadius: 15}}>
            <Pressable
              onPress={() => setPaymentWay('caspi')}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                paddingVertical: 12,
                width: width - 68,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  marginLeft: 23,
                  marginRight: 10,
                  tintColor: paymentWay === 'caspi' ? '#28B3C6' : 'black',
                }}
                source={require('../../assets/Visa.png')}
              />
              <StyledText
                style={{
                  color: paymentWay === 'caspi' ? '#28B3C6' : 'black',
                  fontWeight: '400',
                }}>
                Kaspi Gold (перевод)
              </StyledText>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  function renderCostAndDelivery() {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: width - 68,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <StyledText
            style={{
              fontWeight: '500',
              color: 'black',
              fontSize: 15,
              lineHeight: 23,
            }}>
            Стоимость заказа
          </StyledText>
          <StyledText
            style={{fontWeight: '700', color: '#28B3C6', fontSize: 18}}>
            1 200 ₸
          </StyledText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: width - 68,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <StyledText
            style={{
              fontWeight: '500',
              color: 'black',
              fontSize: 15,
              lineHeight: 23,
            }}>
            Стоимость доставки
          </StyledText>
          <StyledText
            style={{fontWeight: '700', color: '#28B3C6', fontSize: 18}}>
            800 ₸
          </StyledText>
        </View>
      </>
    );
  }

  function renderFreeDeliveryAndMenu() {
    return (
      <>
        <StyledText
          style={{
            marginTop: 24,
            fontWeight: '700',
            fontSize: 15,
            color: '#828282',
          }}>
          Бесплатная доставка от 5000 ₸
        </StyledText>
        <Progress.Bar
          style={{backgroundColor: '#F2F2F6', marginTop: 9}}
          progress={0.3}
          borderColor={'transparent'}
          borderRadius={3}
          width={width - 68}
          height={6}
          color={'#28B3C6'}
        />
        <StyledText
          style={{marginTop: 10, fontWeight: '700', color: '#28B3C6'}}>
          {'1200 '}
          <StyledText style={{fontWeight: '700', color: '#828282'}}>
            / 5000
          </StyledText>
        </StyledText>
        <View style={{height: 16}} />
        <BaseButton
          containerStyle={{width: 148, height: 25}}
          textStyle={{fontSize: 12, color: 'white'}}
          text={'перейти в меню'}
          onPress={() => navigation.navigate('Menu')}
        />
        <View style={{height: 35}} />
      </>
    );
  }

  function renderBottomButton() {
    return (
      <View
        style={{
          borderTopColor: '#F2F2F6',
          borderTopWidth: 1,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          alignItems: 'center',
          width,
          justifyContent: 'center',
        }}>
        <View style={{height: 20}} />
        <BaseButton
          width={width - 68}
          containerStyle={{alignSelf: 'center'}}
          text={'Итого к оплате 2 000 ₸'}
          onPress={() => setModalVisible(true)}
        />
        <View style={{height: 20}} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 0,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingBottom: 100,
        }}>
        <StatusBar
          translucent={false}
          backgroundColor={'#f2f2f2'}
          barStyle="dark-content"
        />
        {renderHeaderAndAddress()}
        {renderPaymentWays()}
        {renderCostAndDelivery()}
        {renderFreeDeliveryAndMenu()}
      </ScrollView>
      {renderBottomButton()}
      <Modal
        swipeDirection={['down']}
        isVisible={isModalVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        deviceHeight={Dimensions.get('screen').height}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            height: '90%',
            width,
            alignSelf: 'center',
            backgroundColor: '#F5F5F8',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}>
          <View
            style={{
              height: '100%',
              width,
            }}>
            <Pressable
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                width: 90,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setModalVisible(false)}>
              <StyledText
                style={{fontWeight: '400', color: '#28B3C6', fontSize: 20}}>
                Отмена
              </StyledText>
            </Pressable>
            <StyledText
              style={{
                marginTop: 28,
                marginHorizontal: 17,
                fontWeight: '700',
                fontSize: 22,
                lineHeight: 26,
                color: 'black',
              }}>
              {'Заказ на 2000 ₸. ' + '\nС какой суммы подготовить сдачу?'}
            </StyledText>
            <AuthBaseInput
              value={sdacha}
              onTextChanges={term => setSdacha(term)}
              styleInput={{}}
              styleContainer={{
                width: width - 34,
                backgroundColor: 'white',
                marginTop: 27,
              }}
              editable={true}
              placeholder={''}
              inputProps={{keyboardType: 'number-pad', textContentType: 'none'}}
            />
            <View
              style={{
                width,
                position: 'absolute',
                bottom: 18,
                alignItems: 'center',
              }}>
              <BaseButton
                text={sdacha ? 'Продолжить' : 'У меня без сдачи'}
                onPress={() => {}}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
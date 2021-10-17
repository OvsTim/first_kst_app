import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {withFont} from '../_CustomComponents/HOC/withFont';
import FirebaseImage from '../_CustomComponents/FirebaseImage';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
import BaseButton from '../_CustomComponents/BaseButton';

type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Product'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);
export default function ProductScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const scrollViewRef = React.createRef<ScrollView>();

  const [numberOfLines, setNumberOfLines] = useState<number | undefined>(3);

  function renderTopImage() {
    return (
      <>
        <FirebaseImage
          innerUrl={'gs://firstkst.appspot.com/images/pancaces.png'}
          imageStyle={{
            width,
            resizeMode: 'cover',
            height: 250,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <View
          style={{
            top: 17,
            left: 18,
            position: 'absolute',
            borderRadius: 45 / 2,
            backgroundColor: '#28B3C6',
            width: 45,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            pressRetentionOffset={20}
            onPress={() => navigation.goBack()}
            android_ripple={{color: 'gray', radius: 200}}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../../assets/product_close.png')}
            />
          </Pressable>
        </View>
      </>
    );
  }

  function renderCard() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          marginTop: -40,
          width,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 37,
            paddingBottom: 34,
            borderBottomWidth: 1,
            borderBottomColor: '#DCDCEB',
            marginHorizontal: 40,
          }}>
          <StyledText
            style={{
              color: 'black',
              fontSize: 30,
              lineHeight: 35,
              fontWeight: '700',
              width: (width / 3) * 2 - 40,
            }}>
            Блинчики с грибами
          </StyledText>
          <View style={{width: width / 3 - 40}}>
            <StyledText
              style={{
                fontWeight: '700',
                color: '#28B3C6',
                fontSize: 30,
                textAlign: 'right',
              }}>
              600 ₸
            </StyledText>
            <StyledText
              style={{
                fontWeight: '500',
                fontSize: 12,
                color: '#00000080',
                textAlign: 'right',
              }}>
              220 гр.
            </StyledText>
          </View>
        </View>
      </View>
    );
  }

  function renderDescription() {
    return (
      <>
        <View
          style={{
            marginTop: 14,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#DCDCEB',
            marginHorizontal: 40,
            width: width - 80,
          }}>
          <StyledText
            numberOfLines={numberOfLines}
            ellipsizeMode={'tail'}
            style={{fontWeight: '400', fontSize: 20, color: '#000000B2'}}>
            Блинчики с грибами это отличная закуска, которая не требует никакого
            другого гарнира к грибам. Блинчики с грибами это отличная закуска,
            которая не требует никакого другого гарнира к грибам. Блинчики с
            грибами это отличная закуска, которая не требует никакого другого
            гарнира к грибам. Блинчики с грибами это отличная закуска, которая
            не требует никакого другого гарнира к грибам. Блинчики с грибами это
            отличная закуска, которая не требует никакого другого гарнира к
            грибам. Блинчики с грибами это отличная закуска, которая не требует
            никакого другого гарнира к грибам. Блинчики с грибами это отличная
            закуска, которая не требует никакого другого гарнира к грибам.
            Блинчики с грибами это отличная закуска, которая не требует никакого
            другого гарнира к грибам.
          </StyledText>
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            marginTop: -10,
            overflow: 'hidden',
            borderRadius: 10,
            borderColor: '#F3F3F7',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Pressable
            pressRetentionOffset={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => {
              if (numberOfLines) {
                setNumberOfLines(undefined);
              } else {
                setNumberOfLines(3);
              }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
            }}
            android_ripple={{color: 'gray', radius: 200}}>
            <Image
              style={{
                height: 5,
                width: 10,
                transform: [{rotate: numberOfLines ? '0deg' : '180deg'}],
              }}
              source={require('../../assets/droprdown.png')}
            />
          </Pressable>
        </View>
      </>
    );
  }

  function renderCount() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 21,
          paddingBottom: 21,
          width: width - 80,
          borderBottomWidth: 1,
          borderBottomColor: '#DCDCEB',
        }}>
        <StyledText>Количество</StyledText>

        <View
          style={{
            flexDirection: 'row',
            width: 80,
            height: 26,
            backgroundColor: '#F3F3F7',
            alignItems: 'center',
            borderRadius: 30,
            justifyContent: 'center',
          }}>
          <View style={{borderRadius: 30, overflow: 'hidden'}}>
            <Pressable
              onPress={() => {}}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                height: 26,
                width: 26,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <StyledText
                style={{fontSize: 12, color: '#5A5858CC', fontWeight: '500'}}>
                -
              </StyledText>
            </Pressable>
          </View>
          <StyledText
            style={{
              fontSize: 12,
              color: '#5A5858CC',
              fontWeight: '500',
              width: 30,
              textAlign: 'center',
            }}>
            2
          </StyledText>
          <View style={{borderRadius: 30, overflow: 'hidden'}}>
            <Pressable
              onPress={() => {}}
              android_ripple={{color: 'gray', radius: 200}}
              style={{
                height: 26,
                width: 26,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <StyledText
                style={{fontSize: 12, color: '#5A5858CC', fontWeight: '500'}}>
                +
              </StyledText>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View
        style={{
          width,
          height: 110,
          backgroundColor: '#28B3C6',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          position: 'absolute',
          bottom: 0,
        }}>
        <BaseButton
          containerStyle={{backgroundColor: 'white'}}
          textStyle={{color: '#28B3C6'}}
          text={'В корзину за 1200 ₸'}
          onPress={() => {}}
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 0,
          alignItems: 'center',
          paddingBottom: 150,
          justifyContent: 'flex-start',
        }}>
        <StatusBar
          translucent={false}
          barStyle={'dark-content'}
          backgroundColor={'white'}
        />
        {renderTopImage()}
        {renderCard()}
        {renderDescription()}
        {renderCount()}
      </ScrollView>
      {renderBottomButton()}
    </View>
  );
}

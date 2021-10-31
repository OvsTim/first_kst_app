import React from 'react';
import {Image, Text, useWindowDimensions, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/AppNavigator';
import {getFontName, withFont} from '../_CustomComponents/HOC/withFont';
import {FocusAwareStatusBar} from '../../navigation/FocusAwareStatusBar';
import {withPressable} from '../_CustomComponents/HOC/withPressable';
// @ts-ignore
import TabSelectorAnimation from 'react-native-tab-selector';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {Restaraunt} from '../../API';
type Props = {
  navigation: StackNavigationProp<AppStackParamList, 'Menu'>;
};
const StyledText = withFont(Text);
const Button = withPressable(View);

export default function MenuScreen({navigation}: Props) {
  const {width} = useWindowDimensions();
  const active: string = useSelector(
    (state: RootState) => state.data.activeShop,
  );
  const shops: Array<Restaraunt> = useSelector(
    (state: RootState) => state.data.shops,
  );
  const activeShop: Restaraunt =
    shops.filter(value => value.id === active).length > 0
      ? shops.filter(value => value.id === active)[0]
      : {
          id: '',
          phone: '',
          name: '',
          address: '',
          coords: {lat: 0, lan: 0},
          outOfStock: [],
          workHours: {},
          recommendations: [],
          delivery: {},
        };
  return (
    <View
      style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <FocusAwareStatusBar
        translucent={false}
        backgroundColor={'white'}
        barStyle="dark-content"
      />
      <View style={{height: 25}} />
      <View style={{flexDirection: 'row', width}}>
        <View style={{width: 18}} />
        <Button
          onPress={() => navigation.navigate('ChangeRestaraunt')}
          containerStyle={{}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <StyledText
              style={{fontWeight: '500', fontSize: 15, color: 'black'}}>
              {activeShop.name}
            </StyledText>
            <Image
              style={{
                width: 14,
                height: 7,
                marginLeft: 9,
                tintColor: 'black',
              }}
              source={require('../../assets/droprdown.png')}
            />
          </View>
        </Button>
        <View
          style={{
            position: 'absolute',
            right: 27,
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          <Button onPress={() => {}} containerStyle={{width: 30, height: 30}}>
            <Image
              style={{width: 30, height: 22}}
              source={require('../../assets/search.png')}
            />
          </Button>
        </View>
      </View>
      <View
        style={{
          borderRadius: 15,
          backgroundColor: '#F5F5F8',
          width: width - 36,
          height: 120,
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <TabSelectorAnimation
          style={{
            marginTop: 20,
            width: width - 70,
            borderRadius: 9,
            zIndex: 999,
          }}
          styleTab={{borderRadius: 9}}
          backgroundColor={'#7676801F'}
          onChangeTab={() => {}}
          styleTitle={{fontSize: 15, fontFamily: getFontName('400')}}
          tabs={[{title: 'На доставку'}, {title: 'Самовывоз'}]}
        />
        <View
          style={{
            width: width - 100,
            height: 0.5,
            marginTop: 18,
            backgroundColor: '#DCDDE4',
          }}
        />
        <Button
          onPress={() => navigation.navigate('ChangeRestaraunt')}
          containerStyle={{marginTop: 13 / 2}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 18, height: 18, marginRight: 18}}
              source={require('../../assets/samovivoz.png')}
            />
            <StyledText
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                fontWeight: '400',
                width: width / 2,
                fontSize: 15,
                color: 'black',
              }}>
              {activeShop.address}
            </StyledText>
            <Image
              style={{
                marginLeft: 10,
                tintColor: 'black',
                width: 12,
                height: 6,
                transform: [{rotate: '270deg'}],
              }}
              source={require('../../assets/droprdown.png')}
            />
          </View>
        </Button>
      </View>
      {/*<BaseButton*/}
      {/*  text={'123'}*/}
      {/*  textStyle={{fontWeight: '700'}}*/}
      {/*  onPress={() => navigation.navigate('Product')}*/}
      {/*/>*/}
    </View>
  );
}

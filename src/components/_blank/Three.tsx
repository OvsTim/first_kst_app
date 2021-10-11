import React from 'react';
import {Text, useWindowDimensions, View} from 'react-native';
import {useSelector} from '../../redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import Onboarding from '../_CustomComponents/Onboarding';
import {hScale} from '../../utils/scaling';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Three'>;
  route: RouteProp<AuthStackParamList, 'Three'>;
};

function OnboardingItem({item}: any) {
  const {width} = useWindowDimensions();
  return <View style={{flex: 1, backgroundColor: item.color, width: width}} />;
}

export default function ThreeScreen({route}: Props) {
  const token = useSelector<string>(state => state.data.token);

  let onboardingSlides: object[] = [
    {color: 'green'},
    {color: 'red'},
    {color: 'blue'},
    {color: 'silver'},
    {color: 'red'},
  ];

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Onboarding
          data={onboardingSlides}
          renderItem={({item}: any) => <OnboardingItem item={item} />}
          nextButtonVisible
          nextButtonProps={{
            width: hScale(100),
            text: 'Next',
          }}
        />
      </View>
      <Text>Three Screen</Text>
      <Text>{'token' + token}</Text>
      <Text>{'paramString ' + route.params?.paramString}</Text>
    </View>
  );
}
